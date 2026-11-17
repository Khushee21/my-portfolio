'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { wipeTo } from './pageWipe'
import WorkCanvas from './WorkCanvas'
import { projects } from '@/data/site'
import { ScrollTrigger, scrollTo } from './scroll'

// Pinned section: page scroll steps through the projects. Each step has a
// short hold in the middle so a card rests before the next one slides in.
const hold = (t: number) => {
  const i = Math.floor(t)
  const f = t - i
  const s = Math.min(1, Math.max(0, (f - 0.3) / 0.4))
  return i + s * s * (3 - 2 * s)
}

export default function Work() {
  const section = useRef<HTMLElement>(null)
  const progress = useRef(0)
  const [idx, setIdx] = useState(0)
  const n = projects.length
  const router = useRouter()
  // open a project's case study with the sunflower circle wipe from the click point
  const open = (e: React.MouseEvent, i: number) => wipeTo(() => router.push(`/work/${projects[i].slug}`), e.clientX, e.clientY)

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: section.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: self => {
        const p = hold(self.progress * (n - 1) * 0.999)
        progress.current = p
        setIdx(Math.round(p))
      },
    })
    return () => st.kill()
  }, [n])

  const go = (i: number) => {
    const el = section.current!
    const top = el.offsetTop
    const span = el.offsetHeight - window.innerHeight
    const k = ((i % n) + n) % n
    scrollTo(top + (span * k) / (n - 1))
  }

  const p = projects[idx]

  return (
    <section id="work" ref={section} className="relative" style={{ height: `${n * 100}svh` }}>
      <div className="intro-backdrop sticky top-0 grid h-svh grid-cols-1 grid-rows-[auto_minmax(0,1fr)] overflow-hidden md:grid-rows-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        {/* soft cream wash so the text reads over the busy collage */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(251,246,234,.92)_0%,rgba(251,246,234,.75)_45%,rgba(251,246,234,0)_70%)] md:bg-[linear-gradient(90deg,rgba(251,246,234,.92)_0%,rgba(251,246,234,.78)_38%,rgba(251,246,234,0)_58%)]" />
        {/* Left: big title, details, controls */}
        <div className="relative z-10 flex flex-col gap-6 px-5 pt-24 pb-2 md:justify-between md:px-12 md:pt-28 md:pb-12">
          <div>
            <p className="mono mb-4 text-xs text-ink/60">Selected work</p>
            {/* --land (set by StampFlight) lifts the title in as the intro stamp touches down */}
            <div className="overflow-hidden"
              style={{ opacity: 'var(--land, 1)', transform: 'translateY(calc((1 - var(--land, 1)) * 30%))' }}>
              <h2 key={p.title} className="display work-title text-cobalt" style={{ fontSize: 'clamp(3.6rem, 12vw, 13rem)' }}>
                <button onClick={e => open(e, idx)} className="text-left uppercase transition-colors hover:text-ink">{p.title}</button>
              </h2>
            </div>
            <div key={p.title + '-meta'} className="work-meta mt-6 max-w-md">
              <p className="mono text-sm text-ink">{p.kind}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.stack.map(s => (
                  <span key={s} className="mono rounded-full border border-ink/30 bg-cream/60 px-3 py-1 text-[11px] text-ink/85">{s}</span>
                ))}
              </div>
              <div className="mono mt-5 flex flex-wrap items-center gap-5 text-xs">
                <button onClick={e => open(e, idx)} className="rounded-full bg-ink px-4 py-2 text-[11px] text-cream transition-transform hover:scale-105">
                  Case study →
                </button>
                {p.links.map((l, i) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noreferrer"
                    className={`underline-offset-4 hover:underline ${i === 0 ? 'font-semibold text-cobalt' : 'text-ink/80'}`}>{l.label} ↗</a>
                ))}
                {p.links.length === 0 && p.linkNote && (
                  <span className="rounded-full border border-dashed border-ink/40 px-3 py-1.5 text-[11px] text-ink/65">🚧 {p.linkNote}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => go(idx + 1)} aria-label="Next project"
              className="grid size-14 place-items-center rounded-full bg-ink text-cream transition-transform hover:scale-105 md:size-16">
              <Arrow down />
            </button>
            <button onClick={() => go(idx - 1)} aria-label="Previous project"
              className="grid size-14 place-items-center rounded-full border border-ink/40 text-ink transition-transform hover:scale-105 md:size-16">
              <Arrow />
            </button>
            <span className="ml-1 font-sans text-sm font-semibold text-ink">
              {String(idx + 1).padStart(2, '0')} <span className="text-ink/40">/ {String(n).padStart(2, '0')}</span>
            </span>
          </div>
        </div>

        {/* Right: WebGL cards (below the text on phones) */}
        <div className="relative cursor-pointer" onClick={e => open(e, idx)} role="link" aria-label={`Open ${p.title} case study`}>
          <WorkCanvas items={projects} progress={progress} />
        </div>
      </div>
    </section>
  )
}

function Arrow({ down }: { down?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5" style={{ transform: down ? 'rotate(180deg)' : undefined }} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  )
}
