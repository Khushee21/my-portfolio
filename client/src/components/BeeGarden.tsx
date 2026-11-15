'use client'

import { useEffect, useRef, useState } from 'react'
import { createBeeSounds, type BeeSounds } from './beeSounds'

// Footer mini-game: bees buzz around swaying sunflowers. "+ Bee" sends out
// another bee; the racket turns the mouse into an electric mosquito racket —
// click near a bee to catch it (zap + "+1"). Sounds are synthesized; 🔊 mutes.

type Flower = { x: number; stem: number; r: number; phase: number }
type Bee = { x: number; y: number; vx: number; vy: number; f: number; orbit: number; ang: number; spin: number; retarget: number; born: number }
type Spark = { x: number; y: number; a: number; len: number; life: number; color: string }
type Plus = { x: number; y: number; life: number }

const MAX_BEES = 40
const INK = '#0d1230'

export default function BeeGarden() {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const api = useRef<{ addBee: () => void } | null>(null)
  const sfx = useRef<BeeSounds | null>(null)
  const [muted, setMuted] = useState(false)
  const racketOn = useRef(false)
  const [racket, setRacket] = useState(false)
  const [caught, setCaught] = useState(0)
  const [buzzing, setBuzzing] = useState(0)

  useEffect(() => {
    racketOn.current = racket
  }, [racket])

  // remember the mute choice for this visitor
  useEffect(() => {
    try { if (localStorage.getItem('bee-muted') === '1') setMuted(true) } catch { }
  }, [])
  useEffect(() => {
    sfx.current?.setMuted(muted)
    try { localStorage.setItem('bee-muted', muted ? '1' : '0') } catch { }
  }, [muted])

  useEffect(() => {
    const cv = canvas.current!
    const ctx = cv.getContext('2d')!
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    let W = 0, H = 0
    let flowers: Flower[] = []
    let blades: { x: number; h: number; lean: number; c: string; front: boolean }[] = []
    const bees: Bee[] = []
    const sparks: Spark[] = []
    const pluses: Plus[] = []
    const mouse = { x: -999, y: -999, in: false, swing: 0 }
    const sound = createBeeSounds()
    sfx.current = sound
    let t = 0

    const layout = () => {
      const r = wrap.current!.getBoundingClientRect()
      W = r.width
      H = r.height
      const dpr = Math.min(devicePixelRatio, 2)
      cv.width = W * dpr
      cv.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.max(3, Math.floor(W / 150))
      flowers = Array.from({ length: n }, (_, i) => ({
        x: ((i + 0.5) * W) / n + (Math.random() - 0.5) * 50,
        stem: H * (0.38 + Math.random() * 0.3),
        r: 15 + Math.random() * 8,
        phase: Math.random() * 6,
      }))
      blades = Array.from({ length: Math.floor(W / 5) }, () => ({
        x: Math.random() * W,
        h: 26 + Math.random() * H * 0.32,
        lean: (Math.random() - 0.5) * 22,
        c: ['#2f8a4e', '#3f9e5a', '#1f6b3a', '#57b26c'][Math.floor(Math.random() * 4)],
        front: Math.random() < 0.35,
      }))
      bees.forEach(b => (b.f = Math.min(b.f, flowers.length - 1)))
    }

    const head = (f: Flower) => ({
      x: f.x + Math.sin(t * 1.1 + f.phase) * 5,
      y: H - f.stem + Math.cos(t * 0.9 + f.phase) * 2,
    })

    const addBee = (from?: number) => {
      if (bees.length >= MAX_BEES) return
      const f = from ?? Math.floor(Math.random() * flowers.length)
      const h = head(flowers[f])
      bees.push({
        x: h.x, y: h.y, vx: (Math.random() - 0.5) * 4, vy: -2 - Math.random() * 2,
        f, orbit: 18 + Math.random() * 22, ang: Math.random() * 6, spin: (Math.random() < 0.5 ? -1 : 1) * (1.5 + Math.random() * 1.5),
        retarget: 3 + Math.random() * 5, born: t,
      })
      setBuzzing(bees.length)
    }
    api.current = {
      addBee: () => {
        if (bees.length >= MAX_BEES) return
        addBee()
        sound.buzz()
      },
    }

    layout()
    for (let i = 0; i < 5; i++) addBee()
    const ro = new ResizeObserver(layout)
    ro.observe(wrap.current!)

    const drawBlade = (b: (typeof blades)[number]) => {
      const sway = Math.sin(t * 1.6 + b.x * 0.05) * 5
      ctx.strokeStyle = b.c
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(b.x, H + 2)
      ctx.quadraticCurveTo(b.x + b.lean * 0.3, H - b.h * 0.55, b.x + b.lean + sway, H - b.h)
      ctx.stroke()
    }

    const drawFlower = (f: Flower) => {
      const h = head(f)
      ctx.strokeStyle = '#2a7a43'
      ctx.lineWidth = 5
      ctx.beginPath()
      ctx.moveTo(f.x, H + 2)
      ctx.quadraticCurveTo(f.x - 6, H - f.stem * 0.5, h.x, h.y)
      ctx.stroke()
      // leaf
      ctx.fillStyle = '#3f9e5a'
      ctx.beginPath()
      const ly = H - f.stem * 0.45
      ctx.ellipse(f.x + 12, ly, 16, 6, -0.6, 0, Math.PI * 2)
      ctx.fill()
      // petals
      const n = 14
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + t * 0.15
        ctx.save()
        ctx.translate(h.x, h.y)
        ctx.rotate(a)
        ctx.fillStyle = '#ffc21a'
        ctx.strokeStyle = INK
        ctx.lineWidth = 1.6
        ctx.beginPath()
        ctx.ellipse(0, -f.r * 1.05, f.r * 0.32, f.r * 0.7, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        ctx.restore()
      }
      ctx.fillStyle = '#6b3b12'
      ctx.strokeStyle = INK
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(h.x, h.y, f.r * 0.55, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    }

    const drawBee = (b: Bee) => {
      const age = t - b.born
      const s = Math.min(1, age * 4)
      ctx.save()
      ctx.translate(b.x, b.y)
      ctx.scale(b.vx < 0 ? -s : s, s)
      ctx.rotate(Math.max(-0.4, Math.min(0.4, b.vy * 0.08)))
      // wings (flapping)
      const flap = 0.55 + 0.45 * Math.abs(Math.sin(t * 38 + b.ang))
      ctx.fillStyle = `rgba(255,255,255,${0.75 * flap})`
      ctx.strokeStyle = 'rgba(13,18,48,.5)'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.ellipse(-2, -8, 5, 7 * flap, -0.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
      ctx.beginPath(); ctx.ellipse(3, -8, 4, 6 * flap, 0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
      // body
      ctx.fillStyle = '#ffd23f'
      ctx.strokeStyle = INK
      ctx.lineWidth = 1.8
      ctx.beginPath(); ctx.ellipse(0, 0, 10, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
      ctx.save()
      ctx.clip()
      ctx.fillStyle = INK
      ctx.fillRect(-4, -8, 3, 16)
      ctx.fillRect(2, -8, 3, 16)
      ctx.restore()
      // stinger + eye
      ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(-14, 1); ctx.lineTo(-10, 2); ctx.fill()
      ctx.beginPath(); ctx.arc(7, -2, 1.4, 0, Math.PI * 2); ctx.fill()
      ctx.restore()
    }

    const drawRacket = () => {
      const swing = mouse.swing
      ctx.save()
      ctx.translate(mouse.x, mouse.y)
      ctx.rotate(-0.5 + swing * 0.9)
      // handle
      ctx.fillStyle = '#ff6fb1'
      ctx.strokeStyle = INK
      ctx.lineWidth = 2.5
      ctx.beginPath(); ctx.roundRect(-6, 36, 12, 46, 5); ctx.fill(); ctx.stroke()
      ctx.fillStyle = '#ffd23f'
      ctx.beginPath(); ctx.arc(0, 50, 3, 0, Math.PI * 2); ctx.fill()
      // head
      ctx.fillStyle = 'rgba(255,255,255,.18)'
      ctx.lineWidth = 4
      ctx.beginPath(); ctx.roundRect(-28, -36, 56, 72, 22); ctx.fill(); ctx.stroke()
      ctx.save()
      ctx.beginPath(); ctx.roundRect(-24, -32, 48, 64, 18); ctx.clip()
      ctx.strokeStyle = swing > 0.2 ? 'rgba(124,199,255,.95)' : 'rgba(13,18,48,.35)'
      ctx.lineWidth = 1
      for (let i = -24; i <= 24; i += 6) { ctx.beginPath(); ctx.moveTo(i, -32); ctx.lineTo(i, 32); ctx.stroke() }
      for (let j = -32; j <= 32; j += 6) { ctx.beginPath(); ctx.moveTo(-24, j); ctx.lineTo(24, j); ctx.stroke() }
      ctx.restore()
      ctx.restore()
    }

    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
      mouse.in = true
      sound.setHum(true, bees.length)
    }
    const onLeave = () => {
      mouse.in = false
      sound.setHum(false, 0)
    }
    const onDown = (e: PointerEvent) => {
      if (!racketOn.current) return
      onMove(e)
      mouse.swing = 1
      let got = 0
      for (let i = bees.length - 1; i >= 0; i--) {
        const b = bees[i]
        if (Math.hypot(b.x - mouse.x, b.y - mouse.y) < 40) {
          for (let k = 0; k < 12; k++) {
            sparks.push({ x: b.x, y: b.y, a: Math.random() * Math.PI * 2, len: 8 + Math.random() * 14, life: 1, color: k % 2 ? '#7cc7ff' : '#ffd23f' })
          }
          pluses.push({ x: b.x, y: b.y, life: 1 })
          bees.splice(i, 1)
          got++
        }
      }
      if (got) {
        sound.zap()
        sound.chime()
        setCaught(c => c + got)
        setBuzzing(bees.length)
      } else sound.swoosh()
      sound.setHum(true, bees.length)
    }
    cv.addEventListener('pointermove', onMove)
    cv.addEventListener('pointerleave', onLeave)
    cv.addEventListener('pointerdown', onDown)

    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000) * (reduce ? 0.35 : 1)
      last = now
      t += dt
      ctx.clearRect(0, 0, W, H)

      blades.filter(b => !b.front).forEach(drawBlade)
      flowers.forEach(drawFlower)

      for (const b of bees) {
        b.retarget -= dt
        if (b.retarget <= 0) {
          b.f = Math.floor(Math.random() * flowers.length)
          b.retarget = 3 + Math.random() * 6
        }
        b.ang += b.spin * dt
        const h = head(flowers[b.f])
        const tx = h.x + Math.cos(b.ang) * b.orbit
        const ty = h.y + Math.sin(b.ang) * b.orbit * 0.6 - 6
        b.vx += (tx - b.x) * 0.9 * dt + (Math.random() - 0.5) * 10 * dt
        b.vy += (ty - b.y) * 0.9 * dt + (Math.random() - 0.5) * 10 * dt
        // bees near the racket get nervous and dart away a bit
        if (racketOn.current && mouse.in) {
          const d = Math.hypot(b.x - mouse.x, b.y - mouse.y)
          if (d < 90) { b.vx += ((b.x - mouse.x) / d) * 30 * dt; b.vy += ((b.y - mouse.y) / d) * 30 * dt }
        }
        b.vx *= 0.96
        b.vy *= 0.96
        b.x += b.vx * 60 * dt
        b.y += b.vy * 60 * dt
        b.y = Math.max(10, Math.min(H - 20, b.y))
        drawBee(b)
      }

      blades.filter(b => b.front).forEach(drawBlade)

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.life -= dt * 3
        if (s.life <= 0) { sparks.splice(i, 1); continue }
        const r0 = (1 - s.life) * 18
        ctx.strokeStyle = s.color
        ctx.globalAlpha = s.life
        ctx.lineWidth = 2.5
        ctx.beginPath()
        ctx.moveTo(s.x + Math.cos(s.a) * r0, s.y + Math.sin(s.a) * r0)
        ctx.lineTo(s.x + Math.cos(s.a) * (r0 + s.len), s.y + Math.sin(s.a) * (r0 + s.len))
        ctx.stroke()
        ctx.globalAlpha = 1
      }
      for (let i = pluses.length - 1; i >= 0; i--) {
        const p = pluses[i]
        p.life -= dt * 1.2
        if (p.life <= 0) { pluses.splice(i, 1); continue }
        ctx.globalAlpha = p.life
        ctx.fillStyle = INK
        ctx.font = '700 16px ui-monospace, monospace'
        ctx.textAlign = 'center'
        ctx.fillText('+1 🐝', p.x, p.y - (1 - p.life) * 40)
        ctx.globalAlpha = 1
      }

      if (racketOn.current && mouse.in) {
        mouse.swing = Math.max(0, mouse.swing - dt * 5)
        drawRacket()
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      cv.removeEventListener('pointermove', onMove)
      cv.removeEventListener('pointerleave', onLeave)
      cv.removeEventListener('pointerdown', onDown)
      sound.dispose()
      sfx.current = null
    }
  }, [])

  const btn = 'mono flex h-11 items-center gap-2 rounded-full border-2 border-ink px-4 text-[11px] text-ink transition-transform hover:scale-105'
  return (
    <div className="relative mt-3 -mx-5 md:-mx-12">
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 px-5">
        <button onClick={() => api.current?.addBee()} className={`${btn} bg-cream`} aria-label="Add a bee">
          <span className="text-base leading-none">🐝</span>
        </button>
        <button onClick={() => { sfx.current?.click(); setRacket(r => !r) }} aria-pressed={racket} aria-label="Toggle the bee racket"
          className={`${btn} ${racket ? 'bg-ink text-sun' : 'bg-cream'}`}>
          <span className="text-base leading-none">🏸</span>
        </button>
        <button onClick={() => setMuted(m => !m)} aria-pressed={muted} aria-label={muted ? 'Turn sound on' : 'Mute sound'}
          className={`${btn} bg-cream px-3`}>
          <span className="text-base leading-none">{muted ? '🔇' : '🔊'}</span>
        </button>
        <span className="mono text-[11px] text-ink/80">caught {caught} · buzzing {buzzing}</span>
      </div>
      <div ref={wrap} data-own-cursor className="relative h-[180px] md:h-[230px]">
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" style={{ cursor: racket ? 'none' : 'default' }}
          aria-label="Bee garden: use the racket to catch bees" />
      </div>
    </div>
  )
}
