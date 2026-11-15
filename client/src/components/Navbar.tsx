'use client'

import { site } from '@/data/site'
import { scrollTo } from './scroll'

export default function Navbar() {
  // Every section is busy (picnic cloth, cards, yellow footer), so each group sits on a dark glass pill.
  const pill = 'flex items-center rounded-full bg-ink/75 px-3 py-2 backdrop-blur-md'
  const link = 'mono text-[11px] text-sun transition-opacity hover:opacity-70'

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 md:px-12 md:py-7">
      <div className={`${pill} gap-4`}>
        <button onClick={() => scrollTo(0)} className="mono whitespace-nowrap text-[11px] text-sun">{site.short} ©{new Date().getFullYear()}</button>
      </div>
      <nav className={`${pill} gap-5 md:gap-8`}>
        <button onClick={() => scrollTo(0)} className={`${link} hidden sm:block`}>Home</button>
        <button onClick={() => scrollTo('#work')} className={link}>Work</button>
        <a href={site.links.bookCall} target="_blank" rel="noreferrer" className={`${link} hidden sm:block`}>Book a call ↗</a>
        <button onClick={() => scrollTo('#contact')}
          className="mono whitespace-nowrap rounded-full bg-sun px-4 py-2.5 text-[11px] text-cobalt transition-transform hover:scale-105">
          Let&apos;s talk
        </button>
      </nav>
    </header>
  )
}
