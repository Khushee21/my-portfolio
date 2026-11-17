'use client'

import { useEffect, useRef } from 'react'
import { Renderer, Camera, Transform, Plane, Program, Mesh, Texture } from 'ogl'
import { inFlight, workCardSize } from './flight'
import { onScreen } from './onScreen'

// Vertical stack of project screenshots on bent cards. `progress` (0 … n-1)
// says which card is centred; scroll speed bends the cards harder and pulls
// the colour channels apart.

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec2 uv;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uBend;
  uniform float uOffset;   // card centre distance from screen centre, in card heights
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    float y = uv.y * 2. - 1.;                       // -1 bottom … 1 top
    float edge = y * y;
    p.x *= 1. + uBend * edge;                       // flared top & bottom
    p.x *= 1. - 0.06 * min(abs(uOffset), 1.5);      // neighbours sit narrower
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
  }
`

const fragment = /* glsl */ `
  precision highp float;
  uniform sampler2D tMap;
  uniform vec2 uPlane;     // px
  uniform vec2 uImage;     // px
  uniform float uSplit;
  uniform float uOffset;
  uniform float uAlpha;
  varying vec2 vUv;

  vec2 cover(vec2 uv) {
    vec2 s = uPlane / uImage;
    float k = max(s.x, s.y);
    vec2 size = uImage * k;
    return (uv * uPlane + (size - uPlane) * vec2(.5, 1.)) / size;   // anchor to top of screenshot
  }

  float rounded(vec2 uv) {
    vec2 p = (uv - .5) * uPlane;
    vec2 q = abs(p) - uPlane * .5 + 26.;
    return length(max(q, 0.)) - 26.;
  }

  void main() {
    vec2 uv = cover(vUv);
    vec2 o = vec2(0., uSplit);
    vec3 col = vec3(
      texture2D(tMap, uv + o).r,
      texture2D(tMap, uv).g,
      texture2D(tMap, uv - o).b
    );
    col *= 1. - 0.45 * min(abs(uOffset), 1.);      // dim cards that aren't centred
    float a = 1. - smoothstep(-1., 1., rounded(vUv));
    gl_FragColor = vec4(col, a * uAlpha);
  }
`

type Item = { image: string }

export default function WorkCanvas({ items, progress }: { items: Item[]; progress: React.RefObject<number> }) {
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = host.current!
    const vis = onScreen(el)
    const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2), alpha: true, premultipliedAlpha: false })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    el.appendChild(gl.canvas)
    gl.canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%'

    const camera = new Camera(gl)
    camera.position.z = 10
    const scene = new Transform()
    const geometry = new Plane(gl, { width: 1, height: 1, widthSegments: 24, heightSegments: 24 })

    const cards = items.map(it => {
      const texture = new Texture(gl, { generateMipmaps: false })
      const program = new Program(gl, {
        vertex,
        fragment,
        transparent: true,
        uniforms: {
          tMap: { value: texture },
          uPlane: { value: [1, 1] },
          uImage: { value: [1, 1] },
          uBend: { value: 0.06 },
          uSplit: { value: 0 },
          uOffset: { value: 0 },
          uAlpha: { value: 1 },
        },
      })
      const img = new Image()
      img.onload = () => {
        texture.image = img
        program.uniforms.uImage.value = [img.naturalWidth, img.naturalHeight]
      }
      img.src = encodeURI(it.image)
      const mesh = new Mesh(gl, { geometry, program })
      mesh.setParent(scene)
      return { mesh, program }
    })

    let W = 1, H = 1, cardW = 1, cardH = 1, gap = 1
    const resize = () => {
      const r = el.getBoundingClientRect()
      W = r.width; H = r.height
      renderer.setSize(W, H)
      camera.orthographic({ left: -W / 2, right: W / 2, top: H / 2, bottom: -H / 2, near: 0.1, far: 100 })
      ;({ w: cardW, h: cardH } = workCardSize(W, H))
      gap = cardH + Math.max(40, H * 0.08)
      cards.forEach(c => {
        c.mesh.scale.set(cardW, cardH, 1)
        c.program.uniforms.uPlane.value = [cardW, cardH]
      })
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    const n = items.length
    let p = progress.current ?? 0
    let vel = 0
    let raf = 0
    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (!vis.on) return
      const target = progress.current ?? 0
      const next = p + (target - p) * 0.12
      vel += ((next - p) - vel) * 0.25
      p = next
      const speed = Math.min(Math.abs(vel) * 18, 1)
      cards.forEach((c, i) => {
        // wrap so the list loops: centre card ± half the deck
        let off = i - p
        off = ((off % n) + n + n / 2) % n - n / 2
        c.mesh.position.y = -off * gap
        c.program.uniforms.uOffset.value = off
        c.program.uniforms.uBend.value = 0.07 + speed * 0.22
        c.program.uniforms.uSplit.value = speed * 0.018 * Math.sign(vel || 1)
        // the first card is the intro stamp until it has landed here
        c.program.uniforms.uAlpha.value = i === 0 && inFlight() ? 0 : 1
      })
      renderer.render({ scene, camera })
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      vis.stop()
      ro.disconnect()
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      gl.canvas.remove()
    }
  }, [items, progress])

  return <div ref={host} data-work-stage className="absolute inset-0" aria-hidden />
}
