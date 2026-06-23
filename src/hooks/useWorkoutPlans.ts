import { useCallback, useState } from 'react'
import {
  DEFAULT_INTERVAL_REST_SEC,
  DEFAULT_INTERVAL_WORK_SEC,
  type SoundSettings,
  type TimerSettings,
  type WorkoutMode,
  type WorkoutPlan,
} from '../types'
import {
  DEFAULT_SELF_PACED_SOUND_SETTINGS,
  DEFAULT_SELF_PACED_TIMER_SETTINGS,
} from '../utils/selfPacedSettings'
import { loadWorkoutPlans, normalizeWorkoutPlan, saveWorkoutPlans } from '../utils/workoutPlans'

export function useWorkoutPlans() {
  const [plans, setPlans] = useState<WorkoutPlan[]>(loadWorkoutPlans)

  const savePlan = useCallback(
    (
      name: string,
      exerciseIds: string[],
      mode: WorkoutMode,
      workSec = DEFAULT_INTERVAL_WORK_SEC,
      restSec = DEFAULT_INTERVAL_REST_SEC,
      soundSettings: SoundSettings = { ...DEFAULT_SELF_PACED_SOUND_SETTINGS },
      timerSettings: TimerSettings = { ...DEFAULT_SELF_PACED_TIMER_SETTINGS },
    ) => {
      const trimmedName = name.trim()
      if (!trimmedName || exerciseIds.length === 0) return null

      const now = new Date().toISOString()
      const plan: WorkoutPlan = normalizeWorkoutPlan({
        id: crypto.randomUUID(),
        name: trimmedName,
        exerciseIds: [...new Set(exerciseIds)],
        mode,
        workSec,
        restSec,
        soundSettings,
        timerSettings,
        createdAt: now,
        updatedAt: now,
      })

      setPlans((current) => {
        const next = [...current, plan]
        saveWorkoutPlans(next)
        return next
      })

      return plan
    },
    [],
  )

  const updatePlan = useCallback((id: string, updates: Partial<Omit<WorkoutPlan, 'id' | 'createdAt'>>) => {
    setPlans((current) => {
      const next = current.map((plan) => {
        if (plan.id !== id) return plan
        return normalizeWorkoutPlan({
          ...plan,
          ...updates,
          updatedAt: new Date().toISOString(),
        })
      })
      saveWorkoutPlans(next)
      return next
    })
  }, [])

  const deletePlan = useCallback((id: string) => {
    setPlans((current) => {
      const next = current.filter((plan) => plan.id !== id)
      saveWorkoutPlans(next)
      return next
    })
  }, [])

  const replacePlans = useCallback((nextPlans: WorkoutPlan[]) => {
    const normalized = nextPlans.map(normalizeWorkoutPlan)
    saveWorkoutPlans(normalized)
    setPlans(normalized)
  }, [])

  return { plans, savePlan, updatePlan, deletePlan, replacePlans }
}
