import { DEFAULT_WORKOUT_PLANS } from '../data/defaultWorkoutPlans'
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
  normalizePlanSoundSettings,
  normalizePlanTimerSettings,
} from './selfPacedSettings'
import { DEFAULT_SOUND_SETTINGS } from './soundSettings'
import { DEFAULT_TIMER_SETTINGS } from './timerSettings'

const STORAGE_KEY = 'hiit-workout-plans'

export function loadWorkoutPlans(): WorkoutPlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        const plans = parsed.filter(isValidWorkoutPlan).map(normalizeWorkoutPlan)
        if (plans.length > 0) return plans
      }
    }

    saveWorkoutPlans(DEFAULT_WORKOUT_PLANS)
    return DEFAULT_WORKOUT_PLANS
  } catch {
    return DEFAULT_WORKOUT_PLANS
  }
}

export function saveWorkoutPlans(plans: WorkoutPlan[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans))
}

export function isValidWorkoutPlan(value: unknown): value is WorkoutPlan {
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

export function normalizeWorkoutPlan(
  plan: Omit<WorkoutPlan, 'soundSettings' | 'timerSettings'> & {
    soundSettings?: Partial<SoundSettings>
    timerSettings?: Partial<TimerSettings>
  },
): WorkoutPlan {
  const isSelfPaced = plan.mode !== 'interval'
  const soundDefaults = isSelfPaced ? DEFAULT_SELF_PACED_SOUND_SETTINGS : DEFAULT_SOUND_SETTINGS
  const timerDefaults = isSelfPaced ? DEFAULT_SELF_PACED_TIMER_SETTINGS : DEFAULT_TIMER_SETTINGS

  return {
    id: plan.id,
    name: plan.name.trim() || 'Untitled workout',
    exerciseIds: [...new Set(plan.exerciseIds)],
    mode: plan.mode === 'interval' ? 'interval' : 'self-paced',
    workSec: clampIntervalSec(plan.workSec, DEFAULT_INTERVAL_WORK_SEC),
    restSec: clampIntervalSec(plan.restSec, DEFAULT_INTERVAL_REST_SEC),
    soundSettings: normalizePlanSoundSettings(plan.soundSettings, soundDefaults),
    timerSettings: normalizePlanTimerSettings(plan.timerSettings, timerDefaults),
    createdAt: plan.createdAt,
    updatedAt: plan.updatedAt ?? plan.createdAt,
  }
}

function clampIntervalSec(value: unknown, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 1) return fallback
  return Math.min(Math.round(value), 3600)
}

export function workoutModeLabel(mode: WorkoutMode): string {
  return mode === 'interval' ? 'Interval' : 'Self-paced'
}
