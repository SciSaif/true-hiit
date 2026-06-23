import { useEffect, useRef, type MutableRefObject } from 'react'
import type { Phase } from '../types'
import { playBeep, playCountdownTick } from '../utils/playBeep'

interface UseTransitionSoundsOptions {
  enabled: boolean
  phase: Phase
  exerciseIndex: number
  countdownRemainingSec: number
  completed: boolean
  suppressNextRef: MutableRefObject<boolean>
}

function isBackwardTransition(
  previousPhase: Phase,
  phase: Phase,
  exerciseIndex: number,
  previousIndex: number,
  wasCompleted: boolean,
  completed: boolean,
): boolean {
  return (
    (previousPhase === 'rest' && phase === 'work' && exerciseIndex === previousIndex) ||
    (previousPhase === 'countdown' && phase === 'rest') ||
    (previousPhase === 'work' && phase === 'rest' && exerciseIndex < previousIndex) ||
    (wasCompleted && !completed)
  )
}

export function useTransitionSounds({
  enabled,
  phase,
  exerciseIndex,
  countdownRemainingSec,
  completed,
  suppressNextRef,
}: UseTransitionSoundsOptions) {
  const prevPhaseRef = useRef<Phase | null>(null)
  const prevExerciseIndexRef = useRef(exerciseIndex)
  const prevCompletedRef = useRef(completed)

  useEffect(() => {
    if (!enabled || phase !== 'countdown') return
    if (countdownRemainingSec <= 0) return
    playCountdownTick()
  }, [enabled, phase, countdownRemainingSec])

  useEffect(() => {
    if (!enabled) {
      prevPhaseRef.current = phase
      prevExerciseIndexRef.current = exerciseIndex
      prevCompletedRef.current = completed
      return
    }

    const suppressed = suppressNextRef.current
    suppressNextRef.current = false

    const previousPhase = prevPhaseRef.current
    const previousIndex = prevExerciseIndexRef.current
    const wasCompleted = prevCompletedRef.current

    if (!suppressed) {
      if (previousPhase !== null && previousPhase !== phase) {
        const backward = isBackwardTransition(
          previousPhase,
          phase,
          exerciseIndex,
          previousIndex,
          wasCompleted,
          completed,
        )
        if (!backward) {
          playBeep()
        }
      }

      if (!wasCompleted && completed) {
        playBeep()
      }
    }

    prevPhaseRef.current = phase
    prevExerciseIndexRef.current = exerciseIndex
    prevCompletedRef.current = completed
  }, [enabled, phase, exerciseIndex, completed, suppressNextRef])
}
