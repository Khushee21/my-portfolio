'use client'

import { useEffect, useRef } from 'react'
import { Renderer, Camera, Transform, Plane, Program, Mesh, Texture } from 'ogl'
import { intro } from '@/data/site'
import { drawBack, drawFront, fontsFromCss, loadImage } from './postcard'
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

  useEffect(() => {
    const el = host.current!
    const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2), alpha: true, premultipliedAlpha: false })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    el.appendChild(gl.canvas)
    gl.canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%'

    const camera = new Camera(gl)
    camera.position.z = 2000
    const scene = new Transform()
    const tFront = new Texture(gl, { generateMipmaps: false })
    const tBack = new Texture(gl, { generateMipmaps: false })
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
    const fonts = fontsFromCss()

    // (Re)draw both faces whenever the card switches between landscape and portrait.
    const buildTextures = async (isPortrait: boolean) => {
      const [W, H] = isPortrait ? [1200, 1800] : [1800, 1200]
      await Promise.all([
        document.fonts.load(`600 40px ${fonts.hand}`),
        document.fonts.load(`700 40px ${fonts.sans}`),
        document.fonts.load(`400 40px ${fonts.sans}`),
        document.fonts.load(`700 40px ${fonts.mono}`),
      ])
      const [photo, stamp] = await Promise.all([
        loadImage(isPortrait ? intro.front.portrait : intro.front.landscape),
        loadImage(intro.stamp),
      ])
      if (!alive) return
      tFront.image = drawFront(W, H, photo, fonts)
      tBack.image = drawBack(W, H, stamp, fonts)
    }

    let cardW = 1, cardH = 1
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
      if (shadow.current) {
        shadow.current.style.width = `${cardW}px`
        shadow.current.style.height = `${cardH}px`
      }
      if (isPortrait !== portrait) {
        portrait = isPortrait
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

    let raf = 0
    const loop = () => {
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
      if (hint.current) hint.current.style.opacity = String(1 - Math.min(1, p * 6))
      renderer.render({ scene, camera })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      st.kill()
      drift.scrollTrigger?.kill()
      drift.kill()
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      gl.canvas.remove()
    }
  }, [])

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
        <div ref={host} className="absolute inset-0" />

        <div ref={hint} className="mono pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-cream px-4 py-2 text-[10px] text-ink shadow-md">
          <span className="inline-block h-4 w-2.5 rounded-full border-2 border-ink" /> Scroll
        </div>
      </div>
    </section>
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
