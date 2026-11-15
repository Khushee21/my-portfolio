'use client'

import { useEffect, useRef } from 'react'
import { gsap } from './scroll'
import { ChaiSticker, CodeSticker, HeartSticker, LaptopSticker, StarSticker, SunflowerSticker } from './Stickers'

// Two cursors, only on devices with a real mouse:
// • Home section (#about): the normal arrow stays, and a big sticker trails it
//   with a little lag, tilting with speed. Every ~260px of travel it swaps to
//   the next sticker with a pop.
// • Everywhere else: a small chai sticker replaces the arrow.

const BIG = [ChaiSticker, LaptopSticker, SunflowerSticker, CodeSticker, HeartSticker, StarSticker]
const SWAP_EVERY = 260

export default function Cursor() {
  const small = useRef<HTMLDivElement>(null)
  const big = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches) return
    const html = document.documentElement
    const s = small.current!
    const b = big.current!
    const items = Array.from(b.children) as HTMLElement[]

    const sx = gsap.quickTo(s, 'x', { duration: 0.35, ease: 'power3' })
    const sy = gsap.quickTo(s, 'y', { duration: 0.35, ease: 'power3' })
    const srot = gsap.quickTo(s, 'rotate', { duration: 0.5, ease: 'power3' })
    const bx = gsap.quickTo(b, 'x', { duration: 0.55, ease: 'power3' })
    const by = gsap.quickTo(b, 'y', { duration: 0.55, ease: 'power3' })
    const brot = gsap.quickTo(b, 'rotate', { duration: 0.6, ease: 'power3' })

    let cur = 0
    let travelled = 0
    let last: { x: number; y: number } | null = null
    let mode: 'home' | 'small' | 'none' = 'none'
    const show = (i: number) => items.forEach((el, k) => (el.style.display = k === i ? 'block' : 'none'))
    show(cur)

    const setMode = (m: typeof mode) => {
      if (m === mode) return
      mode = m
      html.classList.toggle('has-cursor', m === 'small')
      gsap.to(s, { autoAlpha: m === 'small' ? 1 : 0, duration: 0.2 })
      gsap.to(b, { autoAlpha: m === 'home' ? 1 : 0, scale: m === 'home' ? 1 : 0.6, duration: 0.25 })
    }

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const t = e.target as HTMLElement
      const onHome = !!t.closest('#about')
      const hot = !!t.closest('a,button')
      // areas that draw their own cursor (the bee garden's racket) get the plain pointer
      const own = !!t.closest('[data-own-cursor]')
      setMode(own ? 'none' : onHome ? (hot ? 'none' : 'home') : 'small')

      const dx = last ? e.clientX - last.x : 0
      const dy = last ? e.clientY - last.y : 0
      last = { x: e.clientX, y: e.clientY }

      sx(e.clientX); sy(e.clientY)
      srot(gsap.utils.clamp(-25, 25, dx * 1.5))
      gsap.to(s, { scale: hot ? 1.5 : 1, duration: 0.3, overwrite: 'auto' })

      bx(e.clientX); by(e.clientY)
      brot(gsap.utils.clamp(-28, 28, dx * 1.2))

      if (mode === 'home') {
        travelled += Math.hypot(dx, dy)
        if (travelled > SWAP_EVERY) {
          travelled = 0
          cur = (cur + 1) % items.length
          show(cur)
          gsap.fromTo(items[cur], { scale: 0.4, rotate: -24 }, { scale: 1, rotate: 0, duration: 0.45, ease: 'back.out(3)' })
        }
      }
    }
    const leave = () => setMode('none')
    window.addEventListener('pointermove', move)
    document.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
      html.classList.remove('has-cursor')
    }
  }, [])

  return (
    <>
      <div ref={small} className="pointer-events-none fixed top-0 left-0 z-[90] hidden opacity-0 [@media(pointer:fine)]:block" style={{ marginLeft: -18, marginTop: -22 }}>
        <ChaiSticker className="w-9" />
      </div>
      {/* Big home-section stickers; centred on the pointer */}
      <div ref={big} className="pointer-events-none fixed top-0 left-0 z-[90] hidden opacity-0 [@media(pointer:fine)]:block" style={{ marginLeft: -55, marginTop: -55 }}>
        {BIG.map((Sticker, i) => (
          <div key={i} className="w-[110px]" style={{ filter: 'drop-shadow(3px 6px 0 rgba(13,18,48,.25))' }}>
            <Sticker className="h-[110px] w-full" />
          </div>
        ))}
      </div>
    </>
  )
}
