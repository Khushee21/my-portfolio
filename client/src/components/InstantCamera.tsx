'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { polaroids } from '@/data/site'
import { gsap } from './scroll'

// Mint instant camera in the bottom-right of the home section. Each click: flash + shutter sound,
// a print slides out of the top slot, lands tilted on a fanned stack and
// "develops" from dark to full colour. Clicking the stack opens it big.

type Shot = { id: number; photo: number; rot: number; dx: number; dy: number }
const MAX_STACK = 6

function shutter() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const len = ctx.sampleRate * 0.12
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < len; i++) {
      // two short clicks: shutter open + close
      const t = i / ctx.sampleRate
      const env = Math.exp(-t * 90) + (t > 0.06 ? Math.exp(-(t - 0.06) * 120) * 0.7 : 0)
      d[i] = (Math.random() * 2 - 1) * env * 0.5
    }
    const src = ctx.createBufferSource()
    const hp = ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 1800
    src.buffer = buf
    src.connect(hp).connect(ctx.destination)
    src.start()
    src.onended = () => ctx.close()
  } catch {}
}

export default function InstantCamera() {
  const [shots, setShots] = useState<Shot[]>([])
  const [open, setOpen] = useState<number | null>(null) // index into shots
  const next = useRef(0)
  const busy = useRef(false)
  const cam = useRef<HTMLButtonElement>(null)
  const flash = useRef<HTMLDivElement>(null)

  const take = () => {
    if (busy.current) return
    busy.current = true
    setTimeout(() => (busy.current = false), 450)
    shutter()
    gsap.fromTo(flash.current, { opacity: 0.85 }, { opacity: 0, duration: 0.5, ease: 'power2.out' })
    gsap.fromTo(cam.current, { scale: 0.92 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' })
    const n = next.current++
    setShots(s => [
      ...s.slice(-(MAX_STACK - 1)),
      {
        id: n,
        photo: n % polaroids.length,
        rot: gsap.utils.random(-20, 16),
        dx: gsap.utils.random(-18, 14),
        dy: gsap.utils.random(-14, 10),
      },
    ])
  }

  // Close the big view with Esc; arrows flip through the prints you've taken.
  const step = useCallback((d: number) => setOpen(o => (o === null ? o : (o + d + shots.length) % shots.length)), [shots.length])
  useEffect(() => {
    if (open === null) return
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [open, step])

  const big = open !== null ? shots[open] : null

  return (
    <>
      <div ref={flash} className="pointer-events-none fixed inset-0 z-[80] bg-white opacity-0" aria-hidden />

      <div className="absolute right-3 bottom-3 z-40 md:right-8 md:bottom-6">
        {/* Stack of prints, fanned up-left of the camera */}
        <button
          onClick={() => shots.length && setOpen(shots.length - 1)}
          aria-label="Open photos"
          className="absolute right-[78%] bottom-[62%] size-0"
          style={{ pointerEvents: shots.length ? 'auto' : 'none' }}
        >
          {shots.map((s, i) => (
            <Print key={s.id} shot={s} top={i === shots.length - 1} />
          ))}
        </button>

        <button ref={cam} onClick={take} aria-label="Take a photo"
          className="group relative z-10 block w-24 transition-transform duration-300 hover:-rotate-6 md:w-32">
          <CameraArt />
          {shots.length === 0 && (
            <span className="mono pointer-events-none absolute -top-7 right-0 rounded-full bg-ink px-2.5 py-1 text-[9px] whitespace-nowrap text-cream opacity-90 md:text-[10px]">
              click me 📸
            </span>
          )}
        </button>
      </div>

      {big && (
        <div data-own-cursor className="fixed inset-0 z-[85] grid place-items-center bg-ink/70 p-6 backdrop-blur-sm" onClick={() => setOpen(null)}>
          <figure
            key={big.id}
            onClick={e => e.stopPropagation()}
            className="polaroid-pop relative w-[min(78vw,420px)] bg-[#fdfbf6] p-3 pb-16 shadow-[0_30px_80px_rgba(0,0,0,.45)] md:p-4 md:pb-20"
            style={{ rotate: `${big.rot / 3}deg` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={polaroids[big.photo].src} alt={polaroids[big.photo].caption}
              className="aspect-[4/5] w-full object-cover" style={{ objectPosition: polaroids[big.photo].pos }} />
            <figcaption className="hand absolute inset-x-0 bottom-3 text-center text-2xl text-ink md:bottom-5 md:text-3xl">
              {polaroids[big.photo].caption}
            </figcaption>
          </figure>
          {shots.length > 1 && (
            <div className="mono absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-4 text-xs text-cream" onClick={e => e.stopPropagation()}>
              <button onClick={() => step(-1)} className="rounded-full border border-cream/40 px-3 py-2">←</button>
              <span>{open! + 1} / {shots.length}</span>
              <button onClick={() => step(1)} className="rounded-full border border-cream/40 px-3 py-2">→</button>
            </div>
          )}
          <button onClick={() => setOpen(null)} aria-label="Close" className="mono absolute top-5 right-5 rounded-full bg-cream px-4 py-2 text-xs text-ink">
            Close ✕
          </button>
        </div>
      )}
    </>
  )
}

function Print({ shot, top }: { shot: Shot; top: boolean }) {
  const el = useRef<HTMLDivElement>(null)
  const img = useRef<HTMLImageElement>(null)
  const p = polaroids[shot.photo]

  useEffect(() => {
    const tl = gsap.timeline()
    // 1. slide up out of the slot (starts hidden behind the camera)
    tl.fromTo(el.current, { xPercent: 70, yPercent: 75, rotate: 0, scale: 0.6 }, { yPercent: -25, duration: 0.5, ease: 'power2.out' })
    // 2. flick onto the stack
    tl.to(el.current, { xPercent: 0, yPercent: 0, x: shot.dx, y: shot.dy, rotate: shot.rot, scale: 1, duration: 0.7, ease: 'back.out(1.6)' })
    // 3. develop: dark & grey → full colour
    gsap.fromTo(img.current,
      { filter: 'brightness(0.12) saturate(0) contrast(0.8) sepia(0.4)' },
      { filter: 'brightness(1) saturate(1) contrast(1) sepia(0)', duration: 3.2, ease: 'power1.inOut', delay: 0.4 })
    return () => { tl.kill() }
  }, [shot])

  return (
    <div ref={el} className={`absolute right-0 bottom-0 w-24 bg-[#fdfbf6] p-1.5 pb-5 md:w-32 md:p-2 md:pb-7 ${top ? 'shadow-[0_10px_24px_rgba(0,0,0,.35)]' : 'shadow-[0_4px_12px_rgba(0,0,0,.25)]'}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={img} src={p.src} alt="" draggable={false}
        className="aspect-square w-full bg-ink object-cover" style={{ objectPosition: p.pos }} />
    </div>
  )
}

function CameraArt() {
  return (
    <svg viewBox="0 0 160 140" className="w-full drop-shadow-[0_10px_18px_rgba(0,0,0,.35)]" aria-hidden>
      {/* print slot */}
      <rect x="34" y="6" width="92" height="12" rx="6" fill="#5f8f7d" />
      {/* body */}
      <rect x="6" y="14" width="148" height="120" rx="30" fill="#bfe6d3" />
      <rect x="6" y="14" width="148" height="120" rx="30" fill="url(#shade)" />
      <rect x="6" y="90" width="148" height="44" rx="0" fill="#a9d9c2" opacity=".55" clipPath="url(#body)" />
      {/* viewfinder + flash */}
      <rect x="18" y="26" width="30" height="20" rx="6" fill="#fdfbf6" />
      <rect x="112" y="26" width="26" height="18" rx="5" fill="#1d2b26" />
      <rect x="116" y="29" width="8" height="6" rx="2" fill="#fff" opacity=".45" />
      {/* shutter button */}
      <circle cx="132" cy="64" r="7" fill="#ff6fb1" />
      {/* lens */}
      <circle cx="80" cy="78" r="40" fill="#e9f6ef" />
      <circle cx="80" cy="78" r="33" fill="#1d2b26" />
      <circle cx="80" cy="78" r="24" fill="#0b1210" />
      <circle cx="80" cy="78" r="13" fill="#24403a" />
      <circle cx="71" cy="68" r="6" fill="#fff" opacity=".7" />
      <circle cx="90" cy="88" r="3" fill="#fff" opacity=".35" />
      {/* tiny sticker */}
      <rect x="18" y="110" width="26" height="12" rx="3" fill="#ffd23f" transform="rotate(-8 31 116)" />
      <defs>
        <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".35" />
          <stop offset=".5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".12" />
        </linearGradient>
        <clipPath id="body"><rect x="6" y="14" width="148" height="120" rx="30" /></clipPath>
      </defs>
    </svg>
  )
}
