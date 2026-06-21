import type { WorkoutPlan } from '../types'

const STORAGE_KEY = 'hiit-workout-plans'

export function loadWorkoutPlans(): WorkoutPlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.filter(isValidWorkoutPlan).map(normalizeWorkoutPlan)
  } catch {
    return []
  }
}

export function saveWorkoutPlans(plans: WorkoutPlan[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans))
}

function isValidWorkoutPlan(value: unknown): value is WorkoutPlan {
  if (!value || typeof value !== 'object') return false
  const plan = value as Partial<WorkoutPlan>
  return (
    typeof plan.id === 'string' &&
    typeof plan.name === 'string' &&
    Array.isArray(plan.exerciseIds) &&
    plan.exerciseIds.every((id) => typeof id === 'string') &&
    typeof plan.createdAt === 'string'
  )
}

function normalizeWorkoutPlan(plan: WorkoutPlan): WorkoutPlan {
  return {
    id: plan.id,
    name: plan.name.trim() || 'Untitled workout',
    exerciseIds: [...new Set(plan.exerciseIds)],
    createdAt: plan.createdAt,
    updatedAt: plan.updatedAt ?? plan.createdAt,
  }
}
