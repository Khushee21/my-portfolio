// Tracks whether an element is on (or near) the screen, so render loops can
// skip drawing while their section is scrolled away.
export function onScreen(el: Element, margin = '150px') {
  const s = { on: true, stop: () => io.disconnect() }
  const io = new IntersectionObserver(([e]) => { s.on = e.isIntersecting }, { rootMargin: margin })
  io.observe(el)
  return s
}
