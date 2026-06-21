let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  return audioContext
}

export function playBeep() {
  const ctx = getAudioContext()
  if (ctx.state === 'suspended') {
    void ctx.resume()
  }

  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()

  oscillator.connect(gain)
  gain.connect(ctx.destination)

  oscillator.frequency.value = 880
  oscillator.type = 'sine'

  const durationSec = 2
  const now = ctx.currentTime
  gain.gain.setValueAtTime(0.3, now)
  gain.gain.setValueAtTime(0.3, now + durationSec - 0.15)
  gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec)

  oscillator.start(now)
  oscillator.stop(now + durationSec)
}
