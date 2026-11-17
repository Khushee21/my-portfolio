'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { projects, site } from '@/data/site'
import Cursor from './Cursor'
import { gsap, scrollTo, startScroll } from './scroll'
import { revealPage, wipeTo } from './pageWipe'
import { ChaiSticker, CodeSticker, HeartSticker, StarSticker, SunflowerSticker } from './Stickers'

// Project page: a cream paper sheet on the sunflower collage, with a stamp of
// the project, a details row, (A)–(D) sections, a polaroid gallery and a link
// to the next project.

export default function CaseStudy({ index }: { index: number }) {
  const p = projects[index]
  const next = projects[(index + 1) % projects.length]
  const router = useRouter()
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    startScroll()
    scrollTo(0, true)
    revealPage()
    const ctx = gsap.context(() => {
      gsap.from('.cs-sheet', { y: 120, rotate: 1.5, opacity: 0, duration: 1, ease: 'expo.out', delay: 0.15 })
      gsap.from('.cs-stamp', { scale: 1.6, rotate: -20, opacity: 0, duration: 0.8, ease: 'back.out(1.8)', delay: 0.55 })
      gsap.from('.cs-postmark', { scale: 2, opacity: 0, duration: 0.5, ease: 'power3.out', delay: 0.9 })
      gsap.utils.toArray<HTMLElement>('.cs-reveal').forEach(el =>
        gsap.from(el, { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } }),
      )
      gsap.utils.toArray<HTMLElement>('.cs-polaroid').forEach((el, i) =>
        gsap.from(el, { y: 60, rotate: i % 2 ? 8 : -8, opacity: 0, duration: 0.7, ease: 'back.out(1.4)', scrollTrigger: { trigger: el, start: 'top 90%' } }),
      )
      gsap.to('.cs-prop', { y: (i: number) => (i % 2 ? -140 : -80), rotate: (i: number) => (i % 2 ? 14 : -10), ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } })
    }, root)
    return () => ctx.revert()
  }, [index])

  const back = () => (history.length > 1 ? router.back() : router.push('/'))
  const goNext = (e: React.MouseEvent) => wipeTo(() => router.push(`/work/${next.slug}`), e.clientX, e.clientY)

  return (
    <div ref={root} className="relative min-h-svh pb-24">
      <Cursor />
      <div className="intro-backdrop fixed inset-0 -z-10" />
      <div className="pointer-events-none fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 40%, rgba(80,50,10,0), rgba(80,50,10,.35))' }} />

      {/* props peeking from the sides */}
      <div className="pointer-events-none fixed inset-0 z-0 hidden md:block" aria-hidden>
        <SunflowerSticker className="cs-prop absolute top-[18%] left-[2%] w-24 -rotate-12" />
        <ChaiSticker className="cs-prop absolute bottom-[10%] left-[4%] w-20 rotate-6" />
        <StarSticker className="cs-prop absolute top-[30%] right-[3%] w-16 rotate-12" />
        <HeartSticker className="cs-prop absolute right-[4%] bottom-[16%] w-16 -rotate-6" />
        <CodeSticker className="cs-prop absolute top-[64%] left-[1.5%] w-20 -rotate-6" />
      </div>

      <button onClick={back} className="mono fixed top-5 left-5 z-50 rounded-full bg-cream px-4 py-2.5 text-[11px] text-ink shadow-md transition-transform hover:scale-105 md:top-7 md:left-8">
        ← Back
      </button>

      <article className="cs-sheet relative z-10 mx-auto mt-20 w-[min(94vw,1040px)] rounded-[4px] px-6 py-12 text-ink shadow-[0_30px_80px_rgba(60,35,5,.35)] md:mt-24 md:px-16 md:py-16"
        style={{ background: '#fbf6e9', backgroundImage: 'radial-gradient(rgba(120,90,40,.06) 1px, transparent 1px)', backgroundSize: '6px 6px' }}>
        {/* washi tape holding the sheet */}
        <span className="absolute -top-3 left-10 h-7 w-28 -rotate-6 bg-sun/70 shadow-sm" aria-hidden />
        <span className="absolute -top-3 right-14 h-7 w-24 rotate-3 bg-[#9fd3b8]/70 shadow-sm" aria-hidden />

        {/* header */}
        <div className="relative grid gap-10 md:grid-cols-[minmax(0,1fr)_220px]">
          <div>
            <p className="mono text-[11px] text-ink/55">
              Case study · {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')} · {p.kind}
            </p>
            <h1 className="display mt-4 text-cobalt" style={{ fontSize: 'clamp(4rem, 10vw, 8.5rem)' }}>{p.title}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/85 md:text-xl">{p.summary}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              {p.links.map((l, i) => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer"
                  className={`mono rounded-full px-5 text-[11px] transition-transform hover:scale-105 ${i === 0 ? 'bg-ink py-3 text-cream' : 'border-2 border-ink py-2.5'}`}>
                  {l.label} ↗
                </a>
              ))}
              {p.links.length === 0 && <span className="mono rounded-full border-2 border-dashed border-ink/40 px-5 py-2.5 text-[11px] text-ink/60">{p.linkNote ?? 'No public link'}</span>}
            </div>
          </div>
          <div className="relative mx-auto h-[220px] w-[200px] md:mx-0">
            <ProjectStamp src={p.image} title={p.title} className="cs-stamp absolute top-0 right-2 w-[150px] rotate-6" />
            <svg viewBox="0 0 100 100" className="cs-postmark absolute top-[96px] left-0 w-[110px] -rotate-12 opacity-80" aria-hidden>
              <defs><path id="csRing" d="M50 50m-36 0a36 36 0 1 1 72 0a36 36 0 1 1 -72 0" /></defs>
              <circle cx="50" cy="50" r="46" fill="none" stroke="#3d4aa8" strokeWidth="2.5" />
              <circle cx="50" cy="50" r="27" fill="none" stroke="#3d4aa8" strokeWidth="1.8" />
              <text fontSize="9" fontWeight="700" fill="#3d4aa8" letterSpacing="1.4"><textPath href="#csRing">SHIPPED WITH LOVE · {p.status.toUpperCase()} ·</textPath></text>
              <text x="50" y="54" textAnchor="middle" fontSize="10" fontWeight="700" fill="#3d4aa8">KR</text>
            </svg>
            <svg viewBox="0 0 120 40" className="absolute top-[150px] left-[70px] w-[120px] opacity-60" aria-hidden>
              {[8, 18, 28].map(y => <path key={y} d={`M0 ${y} q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 t20 0`} fill="none" stroke="#3d4aa8" strokeWidth="2" />)}
            </svg>
          </div>
        </div>

        {/* details row */}
        <dl className="cs-reveal mt-12 grid grid-cols-2 gap-6 border-y border-ink/15 py-6 md:grid-cols-4">
          {[
            ['Role', p.role],
            ['Platform', p.platform],
            ['Status', p.status],
            ['Stack', p.stack.slice(0, 3).join(' · ')],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="mono text-[10px] text-ink/50">{k}</dt>
              <dd className="mt-1.5 text-[15px] font-semibold">{v}</dd>
            </div>
          ))}
        </dl>

        {/* hero media */}
        <div className="cs-reveal mt-10">
          {p.device === 'cover' ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.image} alt={`${p.title} screens`} className="w-full rounded-2xl shadow-xl" />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-ink/15 bg-white shadow-xl">
              <div className="flex items-center gap-1.5 border-b border-ink/10 bg-cream px-4 py-2.5">
                {['#ff6b6b', '#ffd23f', '#5ccf8a'].map(c => <span key={c} className="size-2.5 rounded-full" style={{ background: c }} />)}
                <span className="mono ml-3 truncate text-[10px] text-ink/50">{p.links[0]?.href.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') ?? ''}</span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt={`${p.title} screenshot`} className="w-full" />
            </div>
          )}
        </div>

        {/* (A)–(D) */}
        <Section label="(A) Overview"><p className="text-xl leading-relaxed md:text-2xl">{p.overview}</p></Section>
        <Section label="(B) Challenge"><p className="hand text-3xl leading-snug text-cobalt md:text-4xl">“{p.challenge}”</p></Section>
        <Section label="(C) What I built">
          <ol>
            {p.built.map((b, i) => (
              <li key={b} className="flex gap-5 border-b border-ink/12 py-4 last:border-0">
                <span className="mono pt-1 text-[11px] text-cobalt">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-base md:text-lg">{b}</span>
              </li>
            ))}
          </ol>
          <div className="mt-5 flex flex-wrap gap-2">
            {p.stack.map(s => <span key={s} className="mono rounded-full border border-ink/25 bg-cream px-3 py-1 text-[10px]">{s}</span>)}
          </div>
        </Section>
        <Section label="(D) Result"><p className="text-xl leading-relaxed md:text-2xl">{p.result}</p></Section>

        {/* (E) gallery as polaroids */}
        {p.gallery.length > 1 && (
          <div className="mt-16">
            <div className="cs-reveal flex items-baseline justify-between border-t border-ink/15 pt-6">
              <p className="mono text-[11px] text-cobalt">(E) Gallery</p>
              <p className="mono text-[10px] text-ink/45">{String(p.gallery.length).padStart(2, '0')} pieces</p>
            </div>
            <div className="mt-8 columns-2 gap-6 md:columns-3">
              {p.gallery.map((src, i) => (
                <figure key={src} className="cs-polaroid mb-6 break-inside-avoid bg-white p-2.5 pb-9 shadow-[0_10px_24px_rgba(60,35,5,.18)] transition-transform duration-300 hover:z-10 hover:scale-105 hover:rotate-0"
                  style={{ rotate: `${[-3, 2, -1.5, 3, -2.5, 1.5][i % 6]}deg` }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`${p.title} screen ${i + 1}`} loading="lazy" className="w-full bg-cream" />
                  <figcaption className="hand mt-2 text-center text-lg text-ink/70">{p.title.toLowerCase()} · {i + 1}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* next project */}
      <button onClick={goNext} className="group relative z-10 mx-auto mt-14 flex w-[min(94vw,1040px)] items-center justify-between gap-6 rounded-2xl bg-ink px-6 py-6 text-left text-cream shadow-xl md:px-10">
        <span>
          <span className="mono block text-[10px] text-cream/50">Next project · {String(((index + 1) % projects.length) + 1).padStart(2, '0')}</span>
          <span className="display mt-2 block text-sun transition-transform group-hover:translate-x-2" style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)' }}>{next.title}</span>
        </span>
        <ProjectStamp src={next.image} title={next.title} className="w-20 shrink-0 rotate-6 transition-transform group-hover:rotate-0 md:w-28" />
      </button>

      <p className="relative z-10 mx-auto mt-8 w-[min(94vw,1040px)] text-center">
        <span className="hand text-2xl text-ink">Like what you see?</span>{' '}
        <a href={site.links.bookCall} target="_blank" rel="noreferrer" className="mono ml-2 inline-block rounded-full bg-cobalt px-5 py-3 text-[11px] text-sun transition-transform hover:scale-105">
          Book a call ↗
        </a>
      </p>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="cs-reveal mt-14 grid gap-4 md:grid-cols-[180px_minmax(0,1fr)] md:gap-10">
      <p className="mono pt-1.5 text-[11px] text-cobalt">{label}</p>
      <div>{children}</div>
    </section>
  )
}

// Perforated postage stamp with a project screenshot inside.
function ProjectStamp({ src, title, className }: { src: string; title: string; className?: string }) {
  const perf = 'radial-gradient(circle at 50% 50%, transparent 4px, #000 4.5px)'
  return (
    <div className={className} style={{ filter: 'drop-shadow(2px 4px 4px rgba(60,35,5,.3))' }} aria-hidden>
      <div className="bg-white p-[9%]" style={{ WebkitMask: `${perf} -6px -6px / 12px 12px`, mask: `${perf} -6px -6px / 12px 12px` }}>
        <div className="relative aspect-[4/5] overflow-hidden bg-cobalt">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className="h-full w-full object-cover object-top" />
          <span className="mono absolute inset-x-0 bottom-0 bg-ink/80 px-1.5 py-1 text-[7px] text-sun">{title} · ₹5</span>
        </div>
      </div>
    </div>
  )
}
