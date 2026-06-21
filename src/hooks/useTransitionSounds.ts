import { useEffect, useRef } from 'react'
import type { Phase } from '../types'
import { playCountdownTick, playStartSound } from '../utils/playBeep'

interface UseTransitionSoundsOptions {
  enabled: boolean
  phase: Phase
  exerciseIndex: number
  countdownRemainingSec: number
}

export function useTransitionSounds({
  enabled,
  phase,
  exerciseIndex,
  countdownRemainingSec,
}: UseTransitionSoundsOptions) {
  const prevPhaseRef = useRef<Phase>(phase)

  useEffect(() => {
    if (!enabled || phase !== 'countdown') return
    if (countdownRemainingSec <= 0) return
    playCountdownTick()
  }, [enabled, phase, countdownRemainingSec])

  useEffect(() => {
    const previousPhase = prevPhaseRef.current

    if (enabled && phase === 'work') {
      const fromCountdown = previousPhase === 'countdown'
      const fromRestToNext = previousPhase === 'rest' && exerciseIndex > 0
      if (fromCountdown || fromRestToNext) {
        playStartSound()
      }
    }

    prevPhaseRef.current = phase
  }, [enabled, phase, exerciseIndex])
}
