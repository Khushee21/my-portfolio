'use client'

import { useEffect, useRef, useState } from 'react'
import { letter } from '@/data/site'
import { gsap } from './scroll'
import { SunflowerSticker } from './Stickers'

// "I wrote you something": a cream envelope with a sunflower wax seal.
// Click the seal → it cracks, the flap swings open, the letter slides up and
// unfolds into a tall handwritten note (its bottom stays tucked in the pocket).

const PAPER = '#f7ecd2'
const SIDE = '#efdfba'
const BOTTOM = '#f3e5c4'
const INSIDE = '#d6bd88'
const INK = '#2b2a5a'

export default function SealedLetter() {
  const root = useRef<HTMLDivElement>(null)
  const wrap = useRef<HTMLDivElement>(null)
  const env = useRef<HTMLDivElement>(null)
  const flap = useRef<HTMLDivElement>(null)
  const sheet = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const sealTop = useRef<HTMLDivElement>(null)
  const sealBot = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)
  const [open, setOpen] = useState(false)
  const [typed, setTyped] = useState(0)
  const [stamp, setStamp] = useState({ date: '', time: '' })

  const title = 'I wrote you '
  const titleHand = 'something'
  const full = title.length + titleHand.length

  // Date/time written on the letter and the postmark: the visitor's "now".
  useEffect(() => {
    const d = new Date()
    setStamp({
      date: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    })
  }, [])

  // Type the heading once it scrolls into view.
  useEffect(() => {
    const el = root.current!
    let timer = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      let i = 0
      timer = window.setInterval(() => {
        i++
        setTyped(i)
        if (i >= full) window.clearInterval(timer)
      }, 70)
    }, { threshold: 0.4 })
    io.observe(el)
    return () => { io.disconnect(); window.clearInterval(timer) }
  }, [full])

  const build = () => {
    const e = env.current!
    const s = sheet.current!
    const envH = e.offsetHeight
    const startH = s.offsetHeight
    const fullH = content.current!.scrollHeight
    const grow = Math.max(0, fullH - startH)
    const t = gsap.timeline({ paused: true })
    // 1. seal cracks apart
    t.to(sealTop.current, { x: -5, y: -6, rotate: -16, duration: 0.18, ease: 'power2.out' })
    t.to(sealBot.current, { x: 6, y: 7, rotate: 12, duration: 0.18, ease: 'power2.out' }, '<')
    // 2. flap swings up and over; it drops behind the letter halfway
    t.to(flap.current, {
      rotateX: 180, duration: 0.7, ease: 'power2.inOut',
      onUpdate(this: gsap.core.Tween) { flap.current!.style.zIndex = this.progress() > 0.5 ? '1' : '4' },
    }, '+=0.05')
    t.to(sealBot.current, { autoAlpha: 0, y: 30, duration: 0.4, ease: 'power1.in' }, '<0.1')
    // 3. letter slides up out of the envelope, then unfolds to full height
    t.to(s, { y: -envH * 0.42, duration: 0.55, ease: 'power2.out' }, '-=0.15')
    t.to(s, { y: 0, height: startH + grow, duration: 0.9, ease: 'power3.inOut' })
    t.to(wrap.current, { paddingTop: grow + envH * 0.04, duration: 0.9, ease: 'power3.inOut' }, '<')
    const q = gsap.utils.selector(root)
    t.to(q('.letter-crease'), { opacity: 0.12, duration: 0.9 }, '<')
    t.fromTo(q('.letter-line'), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.4 }, '-=0.35')
    return t
  }

  const toggle = () => {
    if (!tl.current) tl.current = build()
    if (open) tl.current.timeScale(1.6).reverse()
    else tl.current.timeScale(1).play()
    setOpen(o => !o)
  }

  // Rebuild on resize so the unfold height matches the new width.
  useEffect(() => {
    const ro = new ResizeObserver(() => {
      if (!tl.current) return
      const wasOpen = tl.current.progress() > 0.5
      tl.current.progress(0).kill()
      gsap.set([wrap.current, sheet.current], { clearProps: 'all' })
      tl.current = build()
      if (wasOpen) tl.current.progress(1)
    })
    ro.observe(env.current!)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const shown = (s: string, from: number) => s.slice(0, Math.max(0, typed - from))

  return (
    <div ref={root} className="w-full max-w-[420px]">
      <h3 className="min-h-[2.4rem] font-sans text-2xl font-bold text-cobalt md:text-3xl" aria-label={title + titleHand}>
        <span aria-hidden>{shown(title, 0)}</span>
        <span aria-hidden className="hand text-3xl md:text-4xl">{shown(titleHand, title.length)}</span>
        <span aria-hidden className={`ml-0.5 inline-block h-6 w-0.5 translate-y-1 bg-cobalt ${typed >= full ? 'animate-pulse' : ''}`} />
      </h3>
      <p className="mt-2 text-sm text-ink/75 md:text-base">
        Some things read better on paper. Break the seal; it&rsquo;s addressed to you.
      </p>

      <div ref={wrap} className="relative mt-6 w-full max-w-[340px] md:max-w-[360px]">
        <div ref={env} className="relative aspect-[1.6] w-full -rotate-2" style={{ perspective: 1400 }}>
          {/* inside of the envelope */}
          <div className="absolute inset-0 rounded-md" style={{ background: INSIDE, boxShadow: '0 24px 50px rgba(13,18,48,.28)' }} />

          {/* the letter: bottom-anchored inside the pocket, grows upward when opened */}
          <div ref={sheet} className="absolute right-[5%] bottom-[5%] left-[5%] z-[2] h-[88%] overflow-hidden rounded-sm"
            style={{ background: '#fbf6e9', boxShadow: '0 2px 10px rgba(80,55,15,.18)' }}>
            <div className="letter-crease pointer-events-none absolute inset-x-0 top-1/3 h-px bg-[rgba(120,90,40,.45)] opacity-70" />
            <div className="letter-crease pointer-events-none absolute inset-x-0 top-2/3 h-px bg-[rgba(120,90,40,.45)] opacity-70" />
            <div ref={content} className="hand relative px-6 pt-5 pb-[34%] text-[16px] leading-[1.45] md:px-7 md:text-[17px]" style={{ color: INK }}>
              <SunflowerSticker className="absolute top-2 left-2 w-7 -rotate-12 opacity-90" />
              <p className="letter-line text-right text-sm opacity-70">{stamp.date}{stamp.time && `, ${stamp.time}`}</p>
              <p className="letter-line mt-3">{letter.greeting}</p>
              {letter.paragraphs.map((p, i) => (
                <p key={i} className="letter-line mt-3">{p}</p>
              ))}
              <p className="letter-line mt-5 text-right">{letter.signoff}</p>
              <p className="letter-line text-right text-2xl">{letter.name}</p>
            </div>
          </div>

          {/* front pocket: side flaps + bottom flap */}
          <svg viewBox="0 0 160 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 z-[3] h-full w-full" aria-hidden>
            <defs>
              <linearGradient id="envSide" x1="0" x2="1">
                <stop offset="0" stopColor={SIDE} />
                <stop offset="1" stopColor="#e6d2a6" />
              </linearGradient>
            </defs>
            <polygon points="0,0 0,100 76,54" fill="url(#envSide)" />
            <polygon points="160,0 160,100 84,54" fill="url(#envSide)" />
            <polygon points="0,100 160,100 80,46" fill={BOTTOM} stroke="rgba(120,90,40,.25)" strokeWidth=".4" />
            <polyline points="0,0 76,54" stroke="rgba(120,90,40,.2)" strokeWidth=".4" fill="none" />
            <polyline points="160,0 84,54" stroke="rgba(120,90,40,.2)" strokeWidth=".4" fill="none" />
          </svg>

          {/* address, stamp, postmark, pressed sunflower (on the pocket) */}
          <div className="pointer-events-none absolute inset-0 z-[3]">
            <p className="hand absolute bottom-[8%] left-[7%] -rotate-3 text-[clamp(13px,3.4vw,17px)] leading-[1.15]" style={{ color: INK }}>
              {letter.to.map(l => <span key={l} className="block">{l}</span>)}
            </p>
            <Stamp className="absolute right-[6%] bottom-[12%] w-[19%] rotate-6" />
            <Postmark time={stamp.time} className="absolute right-[20%] bottom-[7%] w-[17%] -rotate-12 opacity-80" />
            <SunflowerSticker className="absolute -bottom-3 -left-4 w-10 rotate-12 md:w-11" />
          </div>

          {/* top flap: swings open around its top edge */}
          <div ref={flap} className="absolute inset-x-0 top-0 z-[4] h-[60%]" style={{ transformOrigin: '50% 0%', transformStyle: 'preserve-3d' }}>
            <svg viewBox="0 0 160 60" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" style={{ backfaceVisibility: 'hidden' }} aria-hidden>
              <polygon points="0,0 160,0 80,58" fill={PAPER} stroke="rgba(120,90,40,.3)" strokeWidth=".4" />
            </svg>
            <svg viewBox="0 0 160 60" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }} aria-hidden>
              <polygon points="0,0 160,0 80,58" fill="#e8d4a8" />
            </svg>
            {/* upper half of the seal travels with the flap */}
            <div ref={sealTop} className="absolute left-1/2 w-[19%] -translate-x-1/2" style={{ bottom: '-22%', backfaceVisibility: 'hidden' }}>
              <Seal half="top" />
            </div>
          </div>

          {/* lower half of the seal stays on the pocket */}
          <div ref={sealBot} className="pointer-events-none absolute left-1/2 z-[5] w-[19%] -translate-x-1/2" style={{ top: '42.8%' }}>
            <Seal half="bottom" />
          </div>

          {/* the whole envelope is the button */}
          <button onClick={toggle} aria-expanded={open} aria-label={open ? 'Fold the letter back' : 'Break the seal and read the letter'}
            className={`absolute inset-0 z-[6] rounded-md ${open ? 'pointer-events-none' : ''}`} />
        </div>

        {open && (
          <button onClick={toggle} className="mono mx-auto mt-6 block rounded-full border-2 border-ink bg-cream px-4 py-2 text-[11px] text-ink transition-transform hover:scale-105">
            Fold it back ✉
          </button>
        )}
      </div>
    </div>
  )
}

// Sunflower-yellow wax seal, drawn whole and clipped into a top/bottom half
// along a jagged crack.
function Seal({ half }: { half: 'top' | 'bottom' }) {
  const crack = half === 'top'
    ? 'polygon(0 0,100% 0,100% 52%,82% 47%,66% 56%,50% 48%,34% 57%,18% 49%,0 54%)'
    : 'polygon(0 54%,18% 49%,34% 57%,50% 48%,66% 56%,82% 47%,100% 52%,100% 100%,0 100%)'
  return (
    <div className="relative aspect-square w-full" style={{ clipPath: crack, filter: 'drop-shadow(0 3px 3px rgba(80,50,0,.35))', marginTop: half === 'bottom' ? 0 : undefined }}>
      <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
        <defs>
          <radialGradient id={`wax-${half}`} cx="40%" cy="35%" r="70%">
            <stop offset="0" stopColor="#ffd84d" />
            <stop offset=".55" stopColor="#f2b416" />
            <stop offset="1" stopColor="#b97a05" />
          </radialGradient>
        </defs>
        <path d="M50 3c9 0 13 6 21 7s14 9 15 17 7 12 7 22-5 14-8 21-6 13-14 17-12 8-21 8-14-5-22-8-14-8-17-16-8-12-8-22 5-15 9-22 8-12 16-16 13-9 22-9z" fill={`url(#wax-${half})`} />
        <circle cx="50" cy="50" r="27" fill="none" stroke="#a86c03" strokeWidth="2.5" opacity=".7" />
        {/* embossed sunflower */}
        {Array.from({ length: 12 }, (_, i) => (
          <ellipse key={i} cx="50" cy="35" rx="4.5" ry="9" fill="#c88a09" transform={`rotate(${i * 30} 50 50)`} opacity=".85" />
        ))}
        <circle cx="50" cy="50" r="8" fill="#8e5a02" />
        <ellipse cx="38" cy="28" rx="10" ry="5" fill="#fff" opacity=".35" transform="rotate(-30 38 28)" />
      </svg>
    </div>
  )
}

function Stamp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 124" className={className} style={{ filter: 'drop-shadow(1px 2px 2px rgba(80,55,15,.3))' }} aria-hidden>
      <defs>
        <mask id="perf">
          <rect width="100" height="124" fill="#fff" />
          {Array.from({ length: 10 }, (_, i) => <circle key={`t${i}`} cx={5 + i * 10} cy="0" r="3.2" fill="#000" />)}
          {Array.from({ length: 10 }, (_, i) => <circle key={`b${i}`} cx={5 + i * 10} cy="124" r="3.2" fill="#000" />)}
          {Array.from({ length: 12 }, (_, i) => <circle key={`l${i}`} cx="0" cy={6 + i * 10} r="3.2" fill="#000" />)}
          {Array.from({ length: 12 }, (_, i) => <circle key={`r${i}`} cx="100" cy={6 + i * 10} r="3.2" fill="#000" />)}
        </mask>
        <linearGradient id="stampSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff9a3c" />
          <stop offset="1" stopColor="#ffd23f" />
        </linearGradient>
      </defs>
      <g mask="url(#perf)">
        <rect width="100" height="124" fill="#fff" />
        <rect x="8" y="8" width="84" height="108" fill="url(#stampSky)" />
        <circle cx="70" cy="34" r="12" fill="#fff3c4" opacity=".8" />
        <path d="M50 116V70" stroke="#2a7a43" strokeWidth="4" />
        <ellipse cx="40" cy="96" rx="10" ry="4" fill="#2a7a43" transform="rotate(-30 40 96)" />
        {Array.from({ length: 12 }, (_, i) => (
          <ellipse key={i} cx="50" cy="52" rx="4" ry="10" fill="#ffc21a" stroke="#7a4a05" strokeWidth="1" transform={`rotate(${i * 30} 50 62)`} />
        ))}
        <circle cx="50" cy="62" r="8" fill="#6b3b12" />
        <path d="M8 108h84v8H8z" fill="#5a2e0c" />
        <text x="13" y="24" fontSize="9" fontWeight="700" fill="#fff">INDIA</text>
        <text x="75" y="114" fontSize="8" fontWeight="700" fill="#fff">₹5</text>
      </g>
    </svg>
  )
}

function Postmark({ time, className }: { time: string; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <path id="pmRing" d="M50 50m-36 0a36 36 0 1 1 72 0a36 36 0 1 1 -72 0" />
      </defs>
      <circle cx="50" cy="50" r="46" fill="none" stroke="#3d4aa8" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="28" fill="none" stroke="#3d4aa8" strokeWidth="1.8" />
      <text fontSize="9.5" fontWeight="700" fill="#3d4aa8" letterSpacing="1.5">
        <textPath href="#pmRing">DELIVERED TO YOU · SENT WITH LOVE ·</textPath>
      </text>
      <text x="50" y="54" textAnchor="middle" fontSize="11" fontWeight="700" fill="#3d4aa8">{time || '—'}</text>
    </svg>
  )
}
