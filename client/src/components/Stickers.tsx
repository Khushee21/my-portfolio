// Hand-drawn style stickers: thick white outline, dark ink line, flat fills.

type P = { className?: string; style?: React.CSSProperties }

export function ChaiSticker({ className, style }: P) {
  return (
    <svg viewBox="0 0 120 140" className={className} style={style} aria-hidden>
      {/* white outline */}
      <path d="M18 34h84l-10 92a10 10 0 0 1-10 9H38a10 10 0 0 1-10-9z" fill="#fff" stroke="#fff" strokeWidth="18" strokeLinejoin="round" />
      {/* glass */}
      <path d="M18 34h84l-10 92a10 10 0 0 1-10 9H38a10 10 0 0 1-10-9z" fill="#e9f1ff" stroke="#0d1230" strokeWidth="5" strokeLinejoin="round" />
      {/* chai */}
      <path d="M23 58h74l-7 66a8 8 0 0 1-8 7H38a8 8 0 0 1-8-7z" fill="#c8813f" />
      <path d="M23 58h74l-1 9H24z" fill="#e8b27a" />
      {/* glass ridges */}
      <path d="M44 70l3 58M60 70v60M76 70l-3 58" stroke="#a5652c" strokeWidth="4" strokeLinecap="round" opacity=".55" />
      {/* steam */}
      <path d="M46 24c-6-8 6-10 0-18M62 22c-6-8 6-10 0-18M78 24c-6-8 6-10 0-18" fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" />
      <path d="M46 24c-6-8 6-10 0-18M62 22c-6-8 6-10 0-18M78 24c-6-8 6-10 0-18" fill="none" stroke="#0d1230" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

export function CodeSticker({ className, style }: P) {
  return (
    <svg viewBox="0 0 150 110" className={className} style={style} aria-hidden>
      <rect x="8" y="8" width="134" height="86" rx="22" fill="#fff" stroke="#fff" strokeWidth="14" />
      <rect x="8" y="8" width="134" height="86" rx="22" fill="#ffd23f" stroke="#0d1230" strokeWidth="5" />
      <path d="M30 96l-6 12 22-12" fill="#ffd23f" stroke="#0d1230" strokeWidth="5" strokeLinejoin="round" />
      <path d="M56 34L38 51l18 17M94 34l18 17-18 17M82 28L68 74" fill="none" stroke="#2440c8" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function StarSticker({ className, style }: P) {
  const d = 'M60 6l12 36 38 2-30 23 11 37-31-22-31 22 11-37-30-23 38-2z'
  return (
    <svg viewBox="0 0 120 120" className={className} style={style} aria-hidden>
      <path d={d} fill="#fff" stroke="#fff" strokeWidth="16" strokeLinejoin="round" />
      <path d={d} fill="#ff6fb1" stroke="#0d1230" strokeWidth="5" strokeLinejoin="round" />
      <path d="M52 40l4 10" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity=".8" />
    </svg>
  )
}

export function AvatarSticker({ className, style }: P) {
  return (
    <div
      className={className}
      style={{
        borderRadius: '9999px',
        border: '6px solid #fff',
        boxShadow: '4px 6px 0 rgba(13,18,48,.28)',
        backgroundImage: 'url(/img/avtar.png)',
        backgroundSize: '150%',
        backgroundPosition: '50% 32%',
        ...style,
      }}
      aria-hidden
    />
  )
}

export function SunflowerSticker({ className, style }: P) {
  const petals = Array.from({ length: 14 }, (_, i) => i * (360 / 14))
  return (
    <svg viewBox="0 0 120 120" className={className} style={style} aria-hidden>
      {petals.map(a => (
        <ellipse key={`o${a}`} cx="60" cy="24" rx="13" ry="24" fill="#fff" transform={`rotate(${a} 60 60)`} />
      ))}
      {petals.map(a => (
        <ellipse key={a} cx="60" cy="26" rx="8.5" ry="20" fill="#ffc21a" stroke="#0d1230" strokeWidth="3" transform={`rotate(${a} 60 60)`} />
      ))}
      <circle cx="60" cy="60" r="20" fill="#6b3b12" stroke="#0d1230" strokeWidth="4" />
      <circle cx="54" cy="54" r="3" fill="#a8672a" />
      <circle cx="65" cy="58" r="2.5" fill="#a8672a" />
      <circle cx="58" cy="67" r="2.5" fill="#a8672a" />
    </svg>
  )
}

export function LaptopSticker({ className, style }: P) {
  return (
    <svg viewBox="0 0 150 110" className={className} style={style} aria-hidden>
      <path d="M26 10h98a8 8 0 0 1 8 8v58H18V18a8 8 0 0 1 8-8zM6 78h138l-8 18H14z" fill="#fff" stroke="#fff" strokeWidth="14" strokeLinejoin="round" />
      <rect x="18" y="10" width="114" height="68" rx="8" fill="#e9f1ff" stroke="#0d1230" strokeWidth="5" />
      <rect x="27" y="19" width="96" height="50" rx="4" fill="#2440c8" />
      <path d="M50 36l-9 8 9 8M100 36l9 8-9 8M80 32l-10 24" fill="none" stroke="#ffd23f" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 78h138l-8 18H14z" fill="#c9d3ea" stroke="#0d1230" strokeWidth="5" strokeLinejoin="round" />
    </svg>
  )
}

export function HeartSticker({ className, style }: P) {
  const d = 'M60 104C26 80 10 62 10 40a24 24 0 0 1 50-10 24 24 0 0 1 50 10c0 22-16 40-50 64z'
  return (
    <svg viewBox="0 0 120 112" className={className} style={style} aria-hidden>
      <path d={d} fill="#fff" stroke="#fff" strokeWidth="16" strokeLinejoin="round" />
      <path d={d} fill="#ff4d6d" stroke="#0d1230" strokeWidth="5" strokeLinejoin="round" />
      <path d="M30 36a12 12 0 0 1 12-10" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity=".8" />
    </svg>
  )
}
