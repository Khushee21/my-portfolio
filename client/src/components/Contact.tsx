'use client'

import { useEffect, useRef } from 'react'
import { site } from '@/data/site'
import { gsap } from './scroll'
import { AvatarSticker } from './Stickers'
import BeeGarden from './BeeGarden'
import SealedLetter from './SealedLetter'

const icons: Record<string, React.ReactNode> = {
  email: <path d="M3 6h18v12H3zM3 7l9 6 9-6" />,
  github: <path d="M9 19c-4 1.3-4-2-6-2.5m12 5v-3.5a3 3 0 0 0-.9-2.4c3-.3 6-1.5 6-6.6a5 5 0 0 0-1.4-3.6 4.7 4.7 0 0 0-.1-3.6s-1.1-.3-3.6 1.4a12.4 12.4 0 0 0-6.5 0C5.9 1.6 4.8 1.9 4.8 1.9a4.7 4.7 0 0 0-.1 3.6A5 5 0 0 0 3.3 9c0 5.1 3 6.3 6 6.6a3 3 0 0 0-.9 2.4V22" />,
  linkedin: <path d="M4 9h4v11H4zM6 4.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4M10 9h4v1.6c.6-1 1.9-1.9 3.6-1.9 3 0 3.4 2 3.4 4.6V20h-4v-5.6c0-1.3 0-3-1.8-3S13 12.8 13 14.3V20h-3z" />,
}

export default function Contact() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.talk-word', {
        yPercent: 110, duration: 1, ease: 'expo.out', stagger: 0.06,
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      })
      gsap.from('.talk-avatar', {
        scale: 0, rotate: -40, duration: 0.9, ease: 'back.out(2)',
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const links = (['email', 'github', 'linkedin'] as const).filter(k => site.links[k])

  return (
    <footer id="contact" ref={root} className="relative overflow-hidden bg-sun px-5 pt-16 text-cobalt md:px-12 md:pt-24">
      <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-start">
        <div className="flex items-center gap-5 md:gap-8">
          <AvatarSticker className="talk-avatar size-24 shrink-0 md:size-36" />
          <div>
            <h2 className="display overflow-hidden" style={{ fontSize: 'clamp(4.5rem, 11vw, 10rem)' }}>
              <span className="talk-word inline-block">Let&apos;s</span>{' '}
              <span className="talk-word inline-block">talk!</span>
            </h2>
            <p className="mono mt-4 text-xs md:text-sm">{site.contactLine}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href={site.links.bookCall} target="_blank" rel="noreferrer"
                className="mono flex h-14 items-center gap-2 rounded-full bg-cobalt px-6 text-xs text-sun shadow-[0_6px_0_rgba(13,18,48,.25)] transition-transform hover:-translate-y-0.5">
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
                Book a call ↗
              </a>
              {links.map(k => (
                <a key={k} href={site.links[k]} target={k === 'email' ? undefined : '_blank'} rel="noreferrer" aria-label={k}
                  className="grid size-14 place-items-center rounded-full border border-cobalt/60 transition-colors hover:bg-cobalt hover:text-sun">
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{icons[k]}</svg>
                </a>
              ))}
            </div>
          </div>
        </div>
        <SealedLetter />
      </div>
      <div className="mono mt-14 flex justify-between border-t border-cobalt/30 pt-5 text-[11px]">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span>{site.place}</span>
      </div>
      <BeeGarden />
    </footer>
  )
}
