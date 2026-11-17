// Draws the two faces of the intro card onto canvases (used as WebGL textures).

import { intro } from '@/data/site'

const COBALT = '#2440c8'
const SUN = '#ffd23f'
const INK = '#0d1230'
const PAPER = '#fbf6ea'

type Fonts = { sans: string; hand: string; mono: string }

export function fontsFromCss(): Fonts {
  const cs = getComputedStyle(document.documentElement)
  const v = (n: string, f: string) => cs.getPropertyValue(n).trim() || f
  return { sans: v('--font-inter', 'Inter Tight'), hand: v('--font-hand', 'Caveat'), mono: v('--font-jet', 'monospace') }
}

export const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image()
    i.onload = () => res(i)
    i.onerror = rej
    i.src = src
  })

function cover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number, fy = 0.5) {
  const s = Math.max(w / img.naturalWidth, h / img.naturalHeight)
  const sw = w / s, sh = h / s
  ctx.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) * fy, sw, sh, x, y, w, h)
}

// Fixed-seed noise so the paper grain is identical on every load.
function grain(ctx: CanvasRenderingContext2D, W: number, H: number, amount: number) {
  let seed = 7
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  for (let i = 0; i < amount; i++) {
    ctx.fillStyle = rnd() > 0.5 ? 'rgba(80,60,30,.05)' : 'rgba(255,255,255,.08)'
    ctx.fillRect(rnd() * W, rnd() * H, 1 + rnd() * 2, 1 + rnd() * 2)
  }
}

function wrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number) {
  let line = ''
  for (const word of text.split(' ')) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, y)
      line = word
      y += lh
    } else line = test
  }
  ctx.fillText(line, x, y)
  return y + lh
}

export function drawFront(W: number, H: number, photo: HTMLImageElement, f: Fonts) {
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d')!
  ctx.fillStyle = PAPER
  ctx.fillRect(0, 0, W, H)
  const m = Math.min(W, H) * 0.045
  cover(ctx, photo, m, m, W - m * 2, H - m * 2, 0.35)
  // soft vignette so the yellow note reads
  const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.2, W / 2, H / 2, Math.max(W, H) * 0.7)
  g.addColorStop(0, 'rgba(0,0,0,0)')
  g.addColorStop(1, 'rgba(0,0,0,.35)')
  ctx.fillStyle = g
  ctx.fillRect(m, m, W - m * 2, H - m * 2)
  grain(ctx, W, H, 3000)

  // Handwritten note
  const portrait = H > W
  const size = (portrait ? W * 0.2 : H * 0.17)
  ctx.save()
  ctx.translate(portrait ? W * 0.12 : W * 0.06, portrait ? H * 0.62 : H * 0.3)
  ctx.rotate(-0.1)
  ctx.font = `600 ${size}px ${f.hand}`
  ctx.lineJoin = 'round'
  intro.note.forEach((t, i) => {
    const y = i * size * 0.86
    ctx.strokeStyle = 'rgba(13,18,48,.55)'
    ctx.lineWidth = size * 0.06
    ctx.strokeText(t, i * size * 0.18, y)
    ctx.fillStyle = SUN
    ctx.fillText(t, i * size * 0.18, y)
  })
  ctx.restore()
  return c
}

// Where the avatar stamp sits on the back face (canvas px, before its 0.05 rad tilt).
// Shared with the scroll flight so the flying stamp lifts off exactly from here.
export const STAMP_TILT = 0.05
export function stampBox(W: number, H: number) {
  const portrait = H > W
  const u = Math.min(W, H)
  const pad = u * 0.035 + u * 0.022 + u * 0.06
  const right = portrait
    ? { x: pad, y: H * 0.6, w: W - pad * 2 }
    : { x: W * 0.6, y: H * 0.15, w: W * 0.4 - pad }
  const sw = u * (portrait ? 0.2 : 0.16), sh = sw * 1.22
  return { sx: right.x + right.w - sw, sy: right.y + (portrait ? u * 0.02 : 0), sw, sh }
}

// `peeled`: the stamp has been lifted off; leave only its faint glue mark.
export function drawBack(W: number, H: number, stampImg: HTMLImageElement, f: Fonts, peeled = false) {
  const portrait = H > W
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d')!
  const u = Math.min(W, H) // base unit

  ctx.fillStyle = PAPER
  ctx.fillRect(0, 0, W, H)
  grain(ctx, W, H, 6000)

  // Airmail border: diagonal cobalt / sun stripes
  const t = u * 0.022
  const pat = document.createElement('canvas')
  pat.width = pat.height = Math.round(u * 0.06)
  const p = pat.getContext('2d')!
  const s = pat.width
  p.fillStyle = PAPER
  p.fillRect(0, 0, s, s)
  p.lineWidth = s * 0.28
  ;[COBALT, SUN].forEach((col, i) => {
    p.strokeStyle = col
    const o = i * s * 0.5
    p.beginPath()
    p.moveTo(-s + o, s); p.lineTo(o, 0)
    p.moveTo(o, s); p.lineTo(s + o, 0)
    p.stroke()
  })
  ctx.save()
  ctx.fillStyle = ctx.createPattern(pat, 'repeat')!
  const b = u * 0.035
  ctx.beginPath()
  ctx.rect(b, b, W - b * 2, H - b * 2)
  ctx.rect(b + t, b + t, W - (b + t) * 2, H - (b + t) * 2)
  ctx.fill('evenodd')
  ctx.restore()

  // Header
  ctx.fillStyle = INK
  ctx.textAlign = 'center'
  ctx.font = `700 ${u * 0.042}px ${f.sans}`
  ;(ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${u * 0.02}px`
  ctx.fillText('POST CARD', W / 2, b + t + u * 0.085)
  ;(ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '0px'
  ctx.textAlign = 'left'

  // Layout boxes
  const pad = b + t + u * 0.06
  const left = portrait
    ? { x: pad, y: H * 0.13, w: W - pad * 2 }
    : { x: pad, y: H * 0.22, w: W * 0.5 - pad }
  const right = portrait
    ? { x: pad, y: H * 0.6, w: W - pad * 2, h: H * 0.34 }
    : { x: W * 0.6, y: H * 0.15, w: W * 0.4 - pad, h: H * 0.72 }

  // Divider + tiny vertical caption
  ctx.strokeStyle = 'rgba(36,64,200,.55)'
  ctx.lineWidth = u * 0.003
  ctx.beginPath()
  if (portrait) { ctx.moveTo(pad, H * 0.575); ctx.lineTo(W - pad, H * 0.575) }
  else { ctx.moveTo(W * 0.56, H * 0.17); ctx.lineTo(W * 0.56, H * 0.86) }
  ctx.stroke()
  if (!portrait) {
    ctx.save()
    ctx.translate(W * 0.575, H * 0.8)
    ctx.rotate(-Math.PI / 2)
    ctx.fillStyle = 'rgba(13,18,48,.35)'
    ctx.font = `500 ${u * 0.015}px ${f.mono}`
    ctx.fillText('KHUSHI RATHORE · PORTFOLIO · EDITION OF 2026 · NO. 001', 0, 0)
    ctx.restore()
  }

  // Left: greeting + paragraph
  ctx.fillStyle = INK
  ctx.font = `600 ${u * 0.038}px ${f.sans}`
  ctx.fillText(intro.greeting, left.x, left.y)
  ctx.fillStyle = 'rgba(13,18,48,.86)'
  const bodySize = u * (portrait ? 0.036 : 0.03)
  ctx.font = `400 ${bodySize}px ${f.sans}`
  const endY = wrap(ctx, intro.body, left.x, left.y + u * 0.07, left.w, bodySize * 1.5)

  // Skill badges
  const bd = u * (portrait ? 0.1 : 0.085)
  const by = portrait ? endY + u * 0.02 : H * 0.7
  intro.badges.forEach((bg, i) => {
    const cx = left.x + bd / 2 + i * bd * 1.45
    const cy = by + bd / 2
    ctx.fillStyle = bg.color
    ctx.beginPath()
    ctx.arc(cx, cy, bd / 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = bg.color === SUN ? INK : '#fff'
    ctx.font = `700 ${bd * 0.36}px ${f.mono}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(bg.glyph, cx, cy + bd * 0.02)
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = INK
    ctx.font = `700 ${u * 0.015}px ${f.mono}`
    ctx.fillText(bg.label, cx, cy + bd * 0.5 + u * 0.03)
    ctx.textAlign = 'left'
  })

  // Right: stamp (perforated) with the avatar
  const { sx, sy, sw, sh } = stampBox(W, H)
  ctx.save()
  ctx.translate(sx + sw / 2, sy + sh / 2)
  ctx.rotate(STAMP_TILT)
  ctx.translate(-sw / 2, -sh / 2)
  if (peeled) {
    // cleaner, paler paper where the stamp kept the sun off, plus a few glue dabs
    ctx.fillStyle = 'rgba(255,255,255,.5)'
    ctx.fillRect(0, 0, sw, sh)
    ctx.strokeStyle = 'rgba(120,90,40,.14)'
    ctx.lineWidth = u * 0.002
    ctx.strokeRect(0, 0, sw, sh)
    ctx.fillStyle = 'rgba(190,160,90,.16)'
    for (const [gx, gy, gr] of [[0.3, 0.25, 0.1], [0.68, 0.42, 0.13], [0.42, 0.7, 0.09], [0.7, 0.8, 0.07]]) {
      ctx.beginPath(); ctx.ellipse(sw * gx, sh * gy, sw * gr * 1.3, sw * gr, 0.4, 0, 7); ctx.fill()
    }
  } else {
  ctx.shadowColor = 'rgba(0,0,0,.18)'
  ctx.shadowBlur = u * 0.01
  ctx.shadowOffsetY = u * 0.004
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, sw, sh)
  ctx.shadowColor = 'transparent'
  // perforations: punch paper-coloured circles along the edges
  ctx.fillStyle = PAPER
  const hole = sw * 0.035
  for (let x = hole; x < sw; x += hole * 2.6) { ctx.beginPath(); ctx.arc(x, 0, hole, 0, 7); ctx.arc(x, sh, hole, 0, 7); ctx.fill() }
  for (let y = hole; y < sh; y += hole * 2.6) { ctx.beginPath(); ctx.arc(0, y, hole, 0, 7); ctx.arc(sw, y, hole, 0, 7); ctx.fill() }
  const ip = sw * 0.1
  ctx.fillStyle = COBALT
  ctx.fillRect(ip * 0.6, ip * 0.6, sw - ip * 1.2, sh - ip * 1.2)
  cover(ctx, stampImg, ip, ip, sw - ip * 2, sh - ip * 2.6, 0.25)
  ctx.fillStyle = SUN
  ctx.font = `700 ${sw * 0.11}px ${f.mono}`
  ctx.fillText('₹5', ip * 1.1, sh - ip * 0.75)
  ctx.textAlign = 'right'
  ctx.fillText('INDIA', sw - ip * 1.1, sh - ip * 0.75)
  ctx.textAlign = 'left'
  }
  ctx.restore()

  // Postmark: double ring with text around it, overlapping the stamp edge
  const pr = u * (portrait ? 0.085 : 0.075)
  const px = sx - pr * 0.55, py = sy + sh * 0.42
  ctx.save()
  ctx.translate(px, py)
  ctx.rotate(-0.25)
  ctx.strokeStyle = 'rgba(36,64,200,.78)'
  ctx.fillStyle = 'rgba(36,64,200,.82)'
  ctx.lineWidth = u * 0.004
  ctx.beginPath(); ctx.arc(0, 0, pr, 0, 7); ctx.stroke()
  ctx.beginPath(); ctx.arc(0, 0, pr * 0.66, 0, 7); ctx.stroke()
  ctx.font = `700 ${pr * 0.17}px ${f.mono}`
  ctx.textAlign = 'center'
  const ring = intro.postmark.ring
  const step = (Math.PI * 2) / ring.length
  for (let i = 0; i < ring.length; i++) {
    ctx.save()
    ctx.rotate(i * step)
    ctx.fillText(ring[i], 0, -pr * 0.75)
    ctx.restore()
  }
  ctx.font = `700 ${pr * 0.24}px ${f.mono}`
  ctx.fillText(intro.postmark.date, 0, -pr * 0.02)
  ctx.font = `700 ${pr * 0.2}px ${f.mono}`
  ctx.fillText(intro.postmark.year, 0, pr * 0.28)
  ctx.restore()
  // wavy cancel lines just over the stamp's left edge (clear of the face)
  ctx.strokeStyle = 'rgba(36,64,200,.55)'
  ctx.lineWidth = u * 0.004
  for (let k = 0; k < 3; k++) {
    ctx.beginPath()
    const y0 = py - pr * 0.4 + k * pr * 0.35
    for (let x = px + pr; x < sx + sw * 0.22; x += 2) ctx.lineTo(x, y0 + Math.sin((x - px) / (u * 0.02)) * u * 0.008)
    ctx.stroke()
  }

  // Address lines
  const ly0 = portrait ? right.y + sh + u * 0.1 : right.y + right.h * 0.5
  const gap = u * (portrait ? 0.085 : 0.095)
  intro.lines.forEach((t, i) => {
    const y = ly0 + i * gap
    ctx.fillStyle = INK
    ctx.font = i === 0 ? `700 ${u * 0.05}px ${f.sans}` : `500 ${u * 0.032}px ${f.sans}`
    ctx.fillText(t, right.x + u * 0.01, y)
    ctx.strokeStyle = 'rgba(13,18,48,.25)'
    ctx.lineWidth = u * 0.0025
    ctx.beginPath()
    ctx.moveTo(right.x, y + u * 0.025)
    ctx.lineTo(right.x + right.w, y + u * 0.025)
    ctx.stroke()
  })

  ctx.fillStyle = 'rgba(13,18,48,.35)'
  ctx.font = `500 ${u * 0.014}px ${f.mono}`
  ctx.textAlign = 'right'
  ctx.fillText('NO. 001 — PRINTED 2026', W - pad, H - b - t - u * 0.03)
  return c
}
