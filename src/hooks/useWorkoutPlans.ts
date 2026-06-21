import { useCallback, useState } from 'react'
import type { WorkoutPlan } from '../types'
import { loadWorkoutPlans, saveWorkoutPlans } from '../utils/workoutPlans'

export function useWorkoutPlans() {
  const [plans, setPlans] = useState<WorkoutPlan[]>(loadWorkoutPlans)

  const savePlan = useCallback((name: string, exerciseIds: string[]) => {
    const trimmedName = name.trim()
    if (!trimmedName || exerciseIds.length === 0) return null

    const now = new Date().toISOString()
    const plan: WorkoutPlan = {
      id: crypto.randomUUID(),
      name: trimmedName,
      exerciseIds: [...new Set(exerciseIds)],
      createdAt: now,
      updatedAt: now,
    }

    setPlans((current) => {
      const next = [...current, plan]
      saveWorkoutPlans(next)
      return next
    })

    return plan
  }, [])

  const deletePlan = useCallback((id: string) => {
    setPlans((current) => {
      const next = current.filter((plan) => plan.id !== id)
      saveWorkoutPlans(next)
      return next
    })
  }, [])

  const replacePlans = useCallback((nextPlans: WorkoutPlan[]) => {
    saveWorkoutPlans(nextPlans)
    setPlans(nextPlans)
  }, [])

  return { plans, savePlan, deletePlan, replacePlans }
}
