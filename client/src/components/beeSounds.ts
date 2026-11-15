// Tiny synthesized sound kit for the bee garden (Web Audio, no files).
// The AudioContext is created on the first click, as browsers require.

export function createBeeSounds() {
  let ctx: AudioContext | null = null
  let master: GainNode | null = null
  let hum: { gain: GainNode; osc: OscillatorNode; lfo: OscillatorNode } | null = null
  let muted = false

  const ensure = () => {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      ctx = new AC()
      master = ctx.createGain()
      master.gain.value = muted ? 0 : 0.6
      master.connect(ctx.destination)
    }
    if (ctx.state === 'suspended') ctx.resume()
    return ctx
  }

  const noiseBuffer = (c: AudioContext, secs: number) => {
    const b = c.createBuffer(1, Math.ceil(c.sampleRate * secs), c.sampleRate)
    const d = b.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
    return b
  }

  // A buzzing wing tone: sawtooth with fast vibrato through a band-pass.
  const buzz = (dur = 0.55, from = 170, to = 240, vol = 0.22) => {
    if (muted) return
    const c = ensure()
    const now = c.currentTime
    const osc = c.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(from, now)
    osc.frequency.exponentialRampToValueAtTime(to, now + dur)
    const lfo = c.createOscillator()
    lfo.frequency.value = 28
    const depth = c.createGain()
    depth.gain.value = 18
    lfo.connect(depth).connect(osc.frequency)
    const bp = c.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 420
    bp.Q.value = 1.2
    const g = c.createGain()
    g.gain.setValueAtTime(0, now)
    g.gain.linearRampToValueAtTime(vol, now + 0.05)
    g.gain.setTargetAtTime(0, now + dur * 0.7, 0.08)
    osc.connect(bp).connect(g).connect(master!)
    osc.start(now); lfo.start(now)
    osc.stop(now + dur + 0.4); lfo.stop(now + dur + 0.4)
  }

  // Electric racket zap: crackly high noise + a falling square blip.
  const zap = () => {
    if (muted) return
    const c = ensure()
    const now = c.currentTime
    const n = c.createBufferSource()
    n.buffer = noiseBuffer(c, 0.25)
    const hp = c.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 2200
    const ng = c.createGain()
    // crackle: random gain steps
    for (let k = 0; k < 10; k++) ng.gain.setValueAtTime(Math.random() * 0.5, now + k * 0.018)
    ng.gain.setTargetAtTime(0, now + 0.18, 0.03)
    n.connect(hp).connect(ng).connect(master!)
    n.start(now)

    const sq = c.createOscillator()
    sq.type = 'square'
    sq.frequency.setValueAtTime(1100, now)
    sq.frequency.exponentialRampToValueAtTime(140, now + 0.16)
    const sg = c.createGain()
    sg.gain.setValueAtTime(0.12, now)
    sg.gain.exponentialRampToValueAtTime(0.001, now + 0.18)
    sq.connect(sg).connect(master!)
    sq.start(now); sq.stop(now + 0.2)
  }

  // Little reward chime after a catch.
  const chime = () => {
    if (muted) return
    const c = ensure()
    const now = c.currentTime + 0.08
    ;[880, 1320].forEach((f, i) => {
      const o = c.createOscillator()
      o.type = 'sine'
      o.frequency.value = f
      const g = c.createGain()
      const t0 = now + i * 0.07
      g.gain.setValueAtTime(0, t0)
      g.gain.linearRampToValueAtTime(0.14, t0 + 0.01)
      g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.35)
      o.connect(g).connect(master!)
      o.start(t0); o.stop(t0 + 0.4)
    })
  }

  // Air swoosh for a missed swing.
  const swoosh = () => {
    if (muted) return
    const c = ensure()
    const now = c.currentTime
    const n = c.createBufferSource()
    n.buffer = noiseBuffer(c, 0.2)
    const bp = c.createBiquadFilter()
    bp.type = 'bandpass'
    bp.Q.value = 1.5
    bp.frequency.setValueAtTime(500, now)
    bp.frequency.exponentialRampToValueAtTime(2400, now + 0.16)
    const g = c.createGain()
    g.gain.setValueAtTime(0, now)
    g.gain.linearRampToValueAtTime(0.25, now + 0.04)
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.18)
    n.connect(bp).connect(g).connect(master!)
    n.start(now)
  }

  // UI click for the buttons.
  const click = () => {
    if (muted) return
    const c = ensure()
    const now = c.currentTime
    const o = c.createOscillator()
    o.type = 'triangle'
    o.frequency.setValueAtTime(700, now)
    o.frequency.exponentialRampToValueAtTime(420, now + 0.06)
    const g = c.createGain()
    g.gain.setValueAtTime(0.15, now)
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
    o.connect(g).connect(master!)
    o.start(now); o.stop(now + 0.1)
  }

  // Soft background hum while the pointer is over the garden; louder with more bees.
  const setHum = (on: boolean, bees: number) => {
    if (!ctx || !master) return // only after the first click
    if (!hum) {
      const osc = ctx.createOscillator()
      osc.type = 'sawtooth'
      osc.frequency.value = 150
      const lfo = ctx.createOscillator()
      lfo.frequency.value = 22
      const depth = ctx.createGain()
      depth.gain.value = 10
      lfo.connect(depth).connect(osc.frequency)
      const bp = ctx.createBiquadFilter()
      bp.type = 'bandpass'
      bp.frequency.value = 360
      bp.Q.value = 2
      const gain = ctx.createGain()
      gain.gain.value = 0
      osc.connect(bp).connect(gain).connect(master)
      osc.start(); lfo.start()
      hum = { gain, osc, lfo }
    }
    const level = on && !muted ? Math.min(0.07, bees * 0.009) : 0
    hum.gain.gain.setTargetAtTime(level, ctx.currentTime, 0.25)
  }

  const setMuted = (m: boolean) => {
    muted = m
    if (master && ctx) master.gain.setTargetAtTime(m ? 0 : 0.6, ctx.currentTime, 0.05)
  }

  const dispose = () => {
    hum?.osc.stop(); hum?.lfo.stop()
    ctx?.close()
    ctx = null
  }

  return { buzz, zap, chime, swoosh, click, setHum, setMuted, dispose }
}

export type BeeSounds = ReturnType<typeof createBeeSounds>
