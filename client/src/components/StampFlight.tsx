'use client'

import { useEffect, useRef } from 'react'
import { intro, projects } from '@/data/site'
import { flight, workCardSize } from './flight'

// The avatar stamp on the back of the intro postcard peels off as you scroll,
// floats over the page and lands as the first project card in Work.
// Fully scroll-driven: scrolling back up puts it back on the postcard.

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const smooth = (a: number, b: number, v: number) => { const x = clamp((v - a) / (b - a)); return x * x * (3 - 2 * x) }
const inOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

// Flight starts this far through the pinned intro (the flip is done by ~0.68).
const START_AT = 0.78

export default function StampFlight() {
  const box = useRef<HTMLDivElement>(null)
  const stamp = useRef<HTMLDivElement>(null)
  const shot = useRef<HTMLDivElement>(null)
  const price = useRef<SVGGElement>(null)
  const name = useRef<HTMLParagraphElement>(null)
  const first = projects[0]

  useEffect(() => {
    let raf = 0
    const root = document.documentElement
    let lastLand = '', shown = true
    const loop = () => {
      raf = requestAnimationFrame(loop)
      const about = document.getElementById('about')
      const work = document.getElementById('work')
      const stage = document.querySelector<HTMLElement>('[data-work-stage]')
      const el = box.current
      if (!about || !work || !stage || !el) return

      const vh = window.innerHeight
      const from = about.offsetTop + START_AT * (about.offsetHeight - vh)
      const to = work.offsetTop
      const t = clamp((window.scrollY - from) / Math.max(1, to - from))
      flight.t = t
      // Work's title fades/slides in as the stamp touches down
      const land = (t <= 0 ? 1 : smooth(0.82, 1, t)).toFixed(3)
      if (land !== lastLand) { lastLand = land; root.style.setProperty('--land', land) }

      const s = flight.start
      if (t <= 0 || t >= 1 || !s) {
        if (shown) { shown = false; el.style.visibility = 'hidden' }
        return
      }
      shown = true

      // landing spot: the centred card of the Work stage
      const r = stage.getBoundingClientRect()
      const card = workCardSize(r.width, r.height)
      const ex = r.left + r.width / 2, ey = r.top + r.height / 2

      // Two legs: peel off and float to the middle of the screen (growing),
      // then glide down into the Work card slot while turning into the card.
      const MID = 0.42
      const out = (v: number) => 1 - Math.pow(1 - v, 3)
      const a = out(clamp(t / MID))
      const b = inOut(clamp((t - MID) / (1 - MID)))
      const mx = window.innerWidth / 2, my = vh * 0.46
      const big = Math.min(2.4, (vh * 0.42) / s.h)      // stamp size mid-air
      const arc = Math.sin(Math.PI * t)
      const x = t < MID ? lerp(s.x, mx, a) : lerp(mx, ex, b)
      const y = t < MID ? lerp(s.y, my, a) : lerp(my, ey, b)
      const sw = s.w * lerp(1, big, a), sh = s.h * lerp(1, big, a)
      const w = lerp(sw, card.w, b)
      const h = lerp(sh, card.h, b)
      const rot = t < MID ? lerp(s.rot, -0.1, a) : lerp(-0.1, 0, b)
      const face = smooth(MID + 0.1, 0.85, t)       // avatar → project screenshot

      el.style.visibility = 'visible'
      el.style.width = `${w}px`
      el.style.height = `${h}px`
      el.style.transform = `translate(${x - w / 2}px, ${y - h / 2}px) rotate(${rot}rad)`
      el.style.filter = `drop-shadow(0 ${6 + arc * 30}px ${8 + arc * 26}px rgba(13,18,48,${0.25 + arc * 0.15}))`
      if (stamp.current) stamp.current.style.opacity = String(1 - face)
      if (shot.current) {
        shot.current.style.opacity = String(face)
        shot.current.style.borderRadius = `${lerp(4, 26, face)}px`
      }
      // the stamp's "₹5 INDIA" turns into the project name early in the flight
      const label = smooth(0.08, 0.3, t)
      if (price.current) price.current.style.opacity = String(1 - label)
      if (name.current) name.current.style.opacity = String(label)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      root.style.removeProperty('--land')
      flight.t = 0
    }
  }, [])

  return (
    <div ref={box} aria-hidden className="pointer-events-none fixed top-0 left-0 z-40 will-change-transform"
      style={{ visibility: 'hidden', containerType: 'inline-size' }}>
      {/* the perforated avatar stamp, same drawing as on the postcard */}
      <div ref={stamp} className="absolute inset-0">
        <svg viewBox="0 0 100 122" preserveAspectRatio="none" className="h-full w-full">
          <defs>
            <mask id="flightPerf">
              <rect width="100" height="122" fill="#fff" />
              {Array.from({ length: 11 }, (_, i) => <circle key={`t${i}`} cx={3.5 + i * 9.1} cy="0" r="3.5" fill="#000" />)}
              {Array.from({ length: 11 }, (_, i) => <circle key={`b${i}`} cx={3.5 + i * 9.1} cy="122" r="3.5" fill="#000" />)}
              {Array.from({ length: 14 }, (_, i) => <circle key={`l${i}`} cx="0" cy={3.5 + i * 9.1} r="3.5" fill="#000" />)}
              {Array.from({ length: 14 }, (_, i) => <circle key={`r${i}`} cx="100" cy={3.5 + i * 9.1} r="3.5" fill="#000" />)}
            </mask>
            <clipPath id="flightFace"><rect x="10" y="10" width="80" height="96" /></clipPath>
          </defs>
          <g mask="url(#flightPerf)">
            <rect width="100" height="122" fill="#fff" />
            <rect x="6" y="6" width="88" height="110" fill="#2440c8" />
            <image href={intro.stamp} x="10" y="10" width="80" height="96" preserveAspectRatio="xMidYMin slice" clipPath="url(#flightFace)" />
            <g ref={price} fill="#ffd23f" fontSize="11" fontWeight="700" fontFamily="var(--font-jet), monospace">
              <text x="11" y="114.5">₹5</text>
              <text x="89" y="114.5" textAnchor="end">INDIA</text>
            </g>
          </g>
        </svg>
        <p ref={name} className="display absolute inset-x-[8%] bottom-[3.2%] truncate text-center text-sun"
          style={{ fontSize: '11cqw', opacity: 0 }}>{first.title}</p>
      </div>
      {/* what it becomes: the first project's card */}
      <div ref={shot} className="absolute inset-0 overflow-hidden bg-cream" style={{ opacity: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={encodeURI(first.image)} alt="" className="h-full w-full object-cover object-top" />
      </div>
    </div>
  )
}
