// Shared state for the stamp that peels off the intro postcard and lands as
// the first Work card. IntroCard writes where the stamp sits on the card,
// StampFlight drives `t` from the scroll position, and Work/WorkCanvas read
// `t` to hide the real first card until the stamp has landed on it.

export type StampRect = { x: number; y: number; w: number; h: number; rot: number } // centre px, rad

export const flight: {
  t: number               // 0 = on the postcard, 1 = landed on the Work card
  start: StampRect | null // live position of the stamp on the postcard
} = { t: 0, start: null }

// Size of the centred Work card for a stage of W×H (kept in sync with WorkCanvas).
export function workCardSize(W: number, H: number) {
  const w = Math.min(W * 0.86, 900)
  return { w, h: Math.min(w * 0.58, H * 0.56) }
}

// True while the stamp is in the air (the real first card should be hidden).
export const inFlight = () => flight.t > 0 && flight.t < 1
