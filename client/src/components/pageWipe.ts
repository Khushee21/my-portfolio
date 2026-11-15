'use client'

import { gsap } from './scroll'

// Sunflower-collage circle that grows from the click point, then navigates.
// The next page calls revealPage() to fade it away once it has painted.
export function wipeTo(go: () => void, x = innerWidth / 2, y = innerHeight / 2) {
  document.getElementById('page-wipe')?.remove()
  const el = document.createElement('div')
  el.id = 'page-wipe'
  el.className = 'intro-backdrop'
  el.style.cssText = `position:fixed;inset:0;z-index:200;pointer-events:none;clip-path:circle(0px at ${x}px ${y}px)`
  document.body.appendChild(el)
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  gsap.to(el, { clipPath: `circle(${r}px at ${x}px ${y}px)`, duration: 0.75, ease: 'power3.inOut', onComplete: go })
}

export function revealPage() {
  const el = document.getElementById('page-wipe')
  if (!el) return
  gsap.to(el, { opacity: 0, duration: 0.5, delay: 0.2, ease: 'power1.out', onComplete: () => el.remove() })
}
