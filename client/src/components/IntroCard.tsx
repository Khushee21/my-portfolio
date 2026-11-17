'use client'

import { useEffect, useRef, useState } from 'react'
import { Renderer, Camera, Transform, Plane, Program, Mesh, Texture } from 'ogl'
import { intro } from '@/data/site'
import { drawBack, drawFront, fontsFromCss, loadImage, stampBox, STAMP_TILT } from './postcard'
import { flight } from './flight'
import { onScreen } from './onScreen'
import { gsap, ScrollTrigger } from './scroll'
import { ChaiSticker, CodeSticker, StarSticker } from './Stickers'
import InstantCamera from './InstantCamera'

// Pinned section: a photo print on a picnic cloth. Scrolling peels it up
// from the top-right corner, curls it over like real paper and lands it
// flipped, showing the postcard on the back.

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec2 uv;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform vec2 uSize;     // card size px
  uniform float uProg;    // 0 flat front … 1 flipped
  uniform float uAngle;   // tilt of the curl line (rad); 0 = vertical
  uniform float uR;       // curl radius px
  varying vec2 vUv;
  varying float vShade;
  const float PI = 3.14159265;

  void main() {
    vUv = uv;
    vec2 p = position.xy * uSize;
    vec2 d = vec2(-cos(uAngle), -sin(uAngle));          // from the top-right corner into the card
    vec2 corner = uSize * 0.5;
    float s = dot(p - corner, d);                        // 0 at the corner, grows into the card
    float sMax = dot(-uSize, d);
    float L = uProg * (sMax + PI * uR);                  // where the paper is folding now
    float u = L - s;                                     // how far past the fold (peeled side)
    float z = 0.;
    float sNew = s;
    vShade = 1.;
    if (u > 0.) {
      float a = u / uR;
      if (a < PI) {
        sNew = L - uR * sin(a);
        z = uR * (1. - cos(a));
        vShade = 0.72 + 0.28 * cos(a * 0.5);
      } else {
        sNew = L + (u - PI * uR);
        z = 2. * uR;
      }
    }
    p += d * (sNew - s);
    // slide the whole sheet back so the flipped card ends where it started
    p -= d * (sMax + PI * uR) * smoothstep(0.35, 1.0, uProg);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, z, 1.);
  }
`

const fragment = /* glsl */ `
  precision highp float;
  uniform sampler2D tFront;
  uniform sampler2D tBack;
  varying vec2 vUv;
  varying float vShade;
  void main() {
    vec3 col = gl_FrontFacing
      ? texture2D(tFront, vUv).rgb
      : texture2D(tBack, vec2(1. - vUv.x, vUv.y)).rgb;
    gl_FragColor = vec4(col * vShade, 1.);
  }
`

export default function IntroCard() {
  const section = useRef<HTMLElement>(null)
  const host = useRef<HTMLDivElement>(null)
  const shadow = useRef<HTMLDivElement>(null)
  const hint = useRef<HTMLDivElement>(null)
  const fallback = useRef<HTMLDivElement>(null)
  const flip = useRef<HTMLDivElement>(null)      // CSS 3D flip used when WebGL can't draw
  const backFace = useRef<HTMLDivElement>(null)
  const debug = useRef<HTMLPreElement>(null)     // shown with ?debug=1
  // bumped when the phone drops the WebGL context, to rebuild everything
  const [gen, setGen] = useState(0)
  const [isTall, setIsTall] = useState(true)

  useEffect(() => {
    const el = host.current!
    const vis = onScreen(el)
    // The plain photo card shows until WebGL has proven it draws the real card.
    const showFallback = (on: boolean) => {
      if (fallback.current) fallback.current.style.opacity = on ? '1' : '0'
      gl.canvas.style.opacity = on ? '0' : '1'
    }
    const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2), alpha: true, premultipliedAlpha: false })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    el.appendChild(gl.canvas)
    gl.canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;opacity:0;transition:opacity .4s'
    // Mobile browsers can drop WebGL to save memory; rebuild when it comes back.
    const onLost = (e: Event) => { e.preventDefault(); showFallback(true) }
    const onRestored = () => setGen(g => g + 1)
    gl.canvas.addEventListener('webglcontextlost', onLost)
    gl.canvas.addEventListener('webglcontextrestored', onRestored)

    const camera = new Camera(gl)
    camera.position.z = 2000
    const scene = new Transform()
    const tFront = new Texture(gl, { generateMipmaps: false })
    const tBack = new Texture(gl, { generateMipmaps: false })
    const tPeeled = new Texture(gl, { generateMipmaps: false }) // back face once the stamp has flown off
    const program = new Program(gl, {
      vertex,
      fragment,
      cullFace: false,
      uniforms: {
        tFront: { value: tFront },
        tBack: { value: tBack },
        uSize: { value: [1, 1] },
        uProg: { value: 0 },
        uAngle: { value: 0.45 },
        uR: { value: 40 },
      },
    })
    const mesh = new Mesh(gl, { geometry: new Plane(gl, { width: 1, height: 1, widthSegments: 80, heightSegments: 80 }), program })
    mesh.setParent(scene)

    let portrait: boolean | null = null
    let alive = true
    let ready = false      // both faces uploaded
    let verified = false   // WebGL really drew the photo (not a black quad)
    let checks = 0
    let lastPx = '-'
    let failReason = ''
    const showDebug = typeof location !== 'undefined' && location.search.includes('debug')
    const glInfo = (() => {
      const ext = gl.getExtension('WEBGL_debug_renderer_info')
      return {
        version: typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext ? 'webgl2' : 'webgl1',
        gpu: ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : 'n/a',
        maxTex: gl.getParameter(gl.MAX_TEXTURE_SIZE),
        dpr: window.devicePixelRatio,
      }
    })()
    const fonts = fontsFromCss()

    // (Re)draw both faces whenever the card switches between landscape and portrait.
    const buildTextures = async (isPortrait: boolean) => {
      // phones get ~2.5x less canvas memory; layout is relative so it still looks the same
      const [W, H] = isPortrait ? [760, 1140] : [1800, 1200]
      texW = W; texH = H
      ready = false
      try {
        // don't wait forever for web fonts on a slow mobile connection
        await Promise.race([
          Promise.all([
            document.fonts.load(`600 40px ${fonts.hand}`),
            document.fonts.load(`700 40px ${fonts.sans}`),
            document.fonts.load(`400 40px ${fonts.sans}`),
            document.fonts.load(`700 40px ${fonts.mono}`),
          ]),
          new Promise(r => setTimeout(r, 2500)),
        ])
        const [photo, stamp] = await Promise.all([
          loadImage(isPortrait ? intro.front.portrait : intro.front.landscape),
          loadImage(intro.stamp),
        ])
        if (!alive) return
        const frontCanvas = drawFront(W, H, photo, fonts)
        const backCanvas = drawBack(W, H, stamp, fonts)
        const peeledCanvas = drawBack(W, H, stamp, fonts, true)
        // A canvas the phone couldn't allocate paints nothing: its corner is transparent instead of paper.
        const painted = (c: HTMLCanvasElement) => {
          try { return c.getContext('2d')!.getImageData(4, 4, 1, 1).data[3] > 0 } catch { return false }
        }
        if (!painted(frontCanvas) || !painted(backCanvas)) throw new Error('canvas came out blank on this device')
        tFront.image = frontCanvas
        tBack.image = backCanvas
        tPeeled.image = peeledCanvas
        tFront.needsUpdate = true
        tBack.needsUpdate = true
        tPeeled.needsUpdate = true
        ready = true
        verified = false
        checks = 0
      } catch (err) {
        failReason = String(err)
        showFallback(true) // keep the plain photo card
      }
    }

    let cardW = 1, cardH = 1
    let texW = 1800, texH = 1200
    const resize = () => {
      const r = el.getBoundingClientRect()
      renderer.setSize(r.width, r.height)
      camera.orthographic({ left: -r.width / 2, right: r.width / 2, top: r.height / 2, bottom: -r.height / 2, near: 1, far: 4000 })
      const isPortrait = r.width < 700
      if (isPortrait) {
        cardW = Math.min(r.width * 0.84, (r.height * 0.74) / 1.5)
        cardH = cardW * 1.5
      } else {
        cardW = Math.min(r.width * 0.62, 940, (r.height * 0.72) * 1.5)
        cardH = cardW / 1.5
      }
      program.uniforms.uSize.value = [cardW, cardH]
      program.uniforms.uR.value = Math.min(cardW, cardH) * 0.11
      for (const box of [shadow.current, fallback.current]) {
        if (!box) continue
        box.style.width = `${cardW}px`
        box.style.height = `${cardH}px`
      }
      fallback.current?.style.setProperty('--u', `${Math.min(cardW, cardH)}px`)
      if (isPortrait !== portrait) {
        portrait = isPortrait
        setIsTall(isPortrait)
        buildTextures(isPortrait)
      }
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    // Scroll drives the flip; the card also straightens and settles as it turns.
    const state = { prog: 0, target: 0 }
    const st = ScrollTrigger.create({
      trigger: section.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: self => {
        const t = gsap.utils.clamp(0, 1, (self.progress - 0.06) / 0.62)
        state.target = t
      },
    })

    const props = gsap.utils.toArray<HTMLElement>('.intro-prop', section.current)
    const drift = gsap.timeline({ scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom bottom', scrub: true } })
    props.forEach((p, i) => drift.to(p, { y: (i % 2 ? -1 : 1) * 60, rotate: (i % 2 ? 12 : -10), ease: 'none' }, 0))

    // Tell the stamp flight where the avatar stamp sits on screen right now, and
    // take it off the postcard while it's flying.
    const fbStamp = fallback.current?.querySelector<HTMLElement>('[data-stamp]')
    const trackStamp = () => {
      const lifted = flight.t > 0
      if (verified) {
        const r = el.getBoundingClientRect()
        const k = cardW / texW
        const b = stampBox(texW, texH)
        const dx = (b.sx + b.sw / 2 - texW / 2) * k
        const dy = (b.sy + b.sh / 2 - texH / 2) * k
        const th = -mesh.rotation.z // card tilt as a CSS (clockwise) angle
        flight.start = {
          x: r.left + r.width / 2 + dx * Math.cos(th) - dy * Math.sin(th),
          y: r.top + r.height / 2 + dx * Math.sin(th) + dy * Math.cos(th),
          w: b.sw * k, h: b.sh * k, rot: th + STAMP_TILT,
        }
        const want = lifted ? tPeeled : tBack
        if (program.uniforms.tBack.value !== want) program.uniforms.tBack.value = want
      } else if (fbStamp) {
        const r = fbStamp.getBoundingClientRect()
        flight.start = { x: r.left + r.width / 2, y: r.top + r.height / 2, w: fbStamp.offsetWidth, h: fbStamp.offsetHeight, rot: -0.02 }
        fbStamp.style.visibility = lifted ? 'hidden' : ''
      }
    }

    let raf = 0
    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (!vis.on) return
      state.prog += (state.target - state.prog) * 0.1
      const p = state.prog
      program.uniforms.uProg.value = p
      program.uniforms.uAngle.value = 0.45 * (1 - gsap.parseEase('power2.out')(p))
      mesh.rotation.z = gsap.utils.interpolate(-0.07, -0.015, p)
      const lift = Math.sin(Math.PI * p)
      if (shadow.current) {
        shadow.current.style.transform = `translate(-50%,-50%) rotate(${mesh.rotation.z * -57.3}deg) scale(${1 + lift * 0.04})`
        shadow.current.style.boxShadow = `0 ${18 + lift * 40}px ${40 + lift * 60}px rgba(13,18,48,${0.35 - lift * 0.12})`
        shadow.current.style.opacity = String(1 - lift * 0.6)
      }
      trackStamp()
      if (hint.current) hint.current.style.opacity = String(1 - Math.min(1, p * 6))
      // CSS flip card (visible only when WebGL isn't): turn over around the vertical axis
      if (flip.current) {
        flip.current.style.transform = `rotateY(${-180 * p}deg) rotateX(${lift * 10}deg) scale(${1 + lift * 0.06})`
      }
      if (showDebug && debug.current) {
        debug.current.textContent =
          `${glInfo.version} · max tex ${glInfo.maxTex} · dpr ${glInfo.dpr}\n${glInfo.gpu}\n` +
          `textures ready: ${ready} · webgl verified: ${verified} · checks ${checks}\n` +
          `centre pixel: ${lastPx} · lost: ${gl.isContextLost()}\n${failReason}`
      }
      if (ready) {
        renderer.render({ scene, camera })
        // Check once that the card's centre isn't black; some phone GPUs fail silently.
        if (!verified && checks < 90) {
          checks++
          const px = new Uint8Array(4)
          gl.readPixels(gl.drawingBufferWidth >> 1, gl.drawingBufferHeight >> 1, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px)
          lastPx = Array.from(px).join(',')
          if (checks === 90 && !verified) failReason = failReason || 'WebGL drew black — using CSS flip'
          if (px[0] + px[1] + px[2] > 30) { verified = true; showFallback(false) }
        }
      }
    }
    raf = requestAnimationFrame(loop)

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      vis.stop()
      ro.disconnect()
      st.kill()
      flight.start = null
      drift.scrollTrigger?.kill()
      drift.kill()
      gl.canvas.removeEventListener('webglcontextlost', onLost)
      gl.canvas.removeEventListener('webglcontextrestored', onRestored)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      gl.canvas.remove()
    }
  }, [gen])

  return (
    <section id="about" ref={section} className="relative" style={{ height: '260svh' }}>
      <h1 className="sr-only">Khushi Rathore — Software Developer</h1>
      <div className="intro-backdrop sticky top-0 h-svh overflow-hidden">
        {/* warm vignette so the card stands out from the busy collage */}
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 65% at 50% 50%, rgba(80,50,10,.05), rgba(80,50,10,.38))' }} />

        {/* props scattered around the card */}
        <ChaiSticker className="intro-prop absolute bottom-[8%] left-[6%] w-20 -rotate-12 md:w-28" />
        <StarSticker className="intro-prop absolute top-[10%] right-[8%] w-14 rotate-12 md:w-20" />
        <CodeSticker className="intro-prop absolute top-[12%] left-[7%] w-20 -rotate-6 md:w-32" />
        <Leaf className="intro-prop absolute top-[44%] right-[3%] w-16 rotate-[30deg] md:w-24" />

        {/* instant camera lives only on the home section */}
        <InstantCamera />

        <div ref={shadow} className="pointer-events-none absolute top-1/2 left-1/2" style={{ transform: 'translate(-50%,-50%)' }} />

        {/* Plain photo card: shown until (or instead of, if WebGL fails) the curling WebGL card */}
        <div ref={fallback} className="pointer-events-none absolute top-1/2 left-1/2 transition-opacity duration-500"
          style={{ transform: 'translate(-50%,-50%) rotate(-4deg)', perspective: '1400px' }}>
          <div ref={flip} className="relative h-full w-full" style={{ transformStyle: 'preserve-3d' }}>
            {/* front: the photo print */}
            <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', background: '#fbf6e9', padding: '4.5%', boxShadow: '0 18px 40px rgba(13,18,48,.35)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={intro.front.portrait} alt="Khushi Rathore" className="h-full w-full object-cover" style={{ objectPosition: '50% 35%' }} />
              <p className="hand absolute top-[58%] left-[10%] -rotate-6 leading-[0.86] text-sun"
                style={{ fontSize: 'clamp(2.4rem, 9vw, 4.5rem)', textShadow: '0 2px 0 rgba(13,18,48,.55), 0 0 8px rgba(13,18,48,.35)' }}>
                {intro.note.map(t => <span key={t} className="block">{t}</span>)}
              </p>
            </div>
            {/* back: the postcard (filled with the same drawing the WebGL card uses) */}
            <div ref={backFace} className="absolute inset-0 overflow-hidden"
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: '#fbf6e9', boxShadow: '0 18px 40px rgba(13,18,48,.35)' }}>
              <PostcardBack tall={isTall} />
            </div>
          </div>
        </div>

        <div ref={host} className="absolute inset-0" />
        <pre ref={debug} className="pointer-events-none absolute top-20 left-2 z-50 max-w-[94vw] rounded bg-ink/85 p-2 text-[10px] whitespace-pre-wrap text-cream empty:hidden" />

        <div ref={hint} className="mono pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-cream px-4 py-2 text-[10px] text-ink shadow-md">
          <span className="inline-block h-4 w-2.5 rounded-full border-2 border-ink" /> Scroll
        </div>
      </div>
    </section>
  )
}

// Postcard back as plain HTML — what phones see when WebGL/canvas painting isn't available.
function PostcardBack({ tall }: { tall: boolean }) {
  const u = (k: number) => `calc(var(--u) * ${k})`
  const airmail = 'repeating-linear-gradient(-45deg,#2440c8 0 7px,#fbf6e9 7px 10px,#ffd23f 10px 17px,#fbf6e9 17px 20px)'
  const left = (
    <div className="min-w-0">
      <p className="font-semibold" style={{ fontSize: u(0.05) }}>{intro.greeting}</p>
      <p className="mt-[0.6em] leading-[1.5] text-ink/85" style={{ fontSize: u(tall ? 0.037 : 0.031) }}>{intro.body}</p>
      <div className="mt-[0.9em] flex" style={{ gap: u(0.035) }}>
        {intro.badges.map(b => (
          <div key={b.label} className="flex flex-col items-center" style={{ gap: u(0.012) }}>
            <span className="mono grid place-items-center rounded-full font-bold normal-case"
              style={{ width: u(0.1), height: u(0.1), fontSize: u(0.034), background: b.color, color: b.color === '#ffd23f' ? '#0d1230' : '#fff' }}>{b.glyph}</span>
            <span className="mono font-bold" style={{ fontSize: u(0.018) }}>{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
  const right = (
    <div className="min-w-0">
      <div className="relative flex justify-end" style={{ height: u(0.26) }}>
        <svg viewBox="0 0 100 100" className="absolute top-[18%] opacity-80" style={{ width: u(0.17), right: u(0.2) }} aria-hidden>
          <circle cx="50" cy="50" r="46" fill="none" stroke="#2440c8" strokeWidth="3" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="#2440c8" strokeWidth="2" />
          <text x="50" y="47" textAnchor="middle" fontSize="13" fontWeight="700" fill="#2440c8">{intro.postmark.date}</text>
          <text x="50" y="63" textAnchor="middle" fontSize="11" fontWeight="700" fill="#2440c8">{intro.postmark.year}</text>
        </svg>
        <div data-stamp className="rotate-3 bg-white p-[5%] shadow-sm" style={{ width: u(0.19) }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={intro.stamp} alt="" className="aspect-[4/5] w-full bg-cobalt object-cover" />
        </div>
      </div>
      {intro.lines.map((l, i) => (
        <p key={l} className={`border-b border-ink/20 ${i === 0 ? 'font-bold' : 'font-medium'}`}
          style={{ fontSize: u(i === 0 ? 0.055 : 0.033), paddingTop: u(0.02), paddingBottom: u(0.008) }}>{l}</p>
      ))}
    </div>
  )
  return (
    <div className="absolute inset-0 text-ink" style={{ padding: u(0.035), background: airmail }}>
      <div className="flex h-full flex-col bg-[#fbf6e9]" style={{ padding: u(0.05) }}>
        <p className="text-center font-bold" style={{ fontSize: u(0.042), letterSpacing: '0.35em' }}>POST CARD</p>
        {tall ? (
          <div className="mt-[4%] flex flex-1 flex-col justify-between">
            {left}
            <div className="border-t border-cobalt/50 pt-[3%]">{right}</div>
          </div>
        ) : (
          <div className="mt-[3%] grid flex-1 grid-cols-[1.15fr_1px_0.85fr] items-start" style={{ gap: u(0.05) }}>
            {left}
            <div className="h-full bg-cobalt/50" />
            {right}
          </div>
        )}
      </div>
    </div>
  )
}

function Leaf({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 60" className={className} aria-hidden style={{ filter: 'drop-shadow(3px 6px 4px rgba(13,18,48,.3))' }}>
      <path d="M4 30C30 2 84 0 116 30 84 60 30 58 4 30z" fill="#2f8a4e" />
      <path d="M4 30h112M30 30l14-12M30 30l14 12M58 30l14-14M58 30l14 14M86 30l12-10M86 30l12 10" stroke="#1d6537" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}
