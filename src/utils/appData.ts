import type { AppDataExport, SoundSettings, WorkoutPlan } from '../types'
import { DEFAULT_SOUND_SETTINGS, saveSoundSettings } from './soundSettings'
import { saveWorkoutPlans } from './workoutPlans'

export const APP_DATA_VERSION = 1 as const

export function buildAppExport(
  workoutPlans: WorkoutPlan[],
  soundSettings: SoundSettings,
): AppDataExport {
  return {
    version: APP_DATA_VERSION,
    exportedAt: new Date().toISOString(),
    workoutPlans,
    soundSettings,
  }
}

export function parseAppImport(raw: string): AppDataExport | null {
  try {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null

    const data = parsed as Partial<AppDataExport>
    if (data.version !== APP_DATA_VERSION) return null
    if (!Array.isArray(data.workoutPlans)) return null
    if (!isValidSoundSettings(data.soundSettings)) return null

    const workoutPlans = data.workoutPlans.filter(isValidWorkoutPlan).map(normalizeWorkoutPlan)
    if (workoutPlans.length === 0 && data.workoutPlans.length > 0) return null

    return {
      version: APP_DATA_VERSION,
      exportedAt: typeof data.exportedAt === 'string' ? data.exportedAt : new Date().toISOString(),
      workoutPlans,
      soundSettings: normalizeSoundSettings(data.soundSettings),
    }
  } catch {
    return null
  }
}

export function applyAppImport(data: AppDataExport) {
  saveWorkoutPlans(data.workoutPlans)
  saveSoundSettings(data.soundSettings)
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

function isValidSoundSettings(value: unknown): value is SoundSettings {
  if (!value || typeof value !== 'object') return false
  const settings = value as Partial<SoundSettings>
  return (
    typeof settings.enabled === 'boolean' &&
    typeof settings.workAlertSec === 'number' &&
    typeof settings.restAlertSec === 'number'
  )
}

function normalizeSoundSettings(settings: SoundSettings): SoundSettings {
  return {
    enabled: settings.enabled,
    workAlertSec: clampAlertSec(settings.workAlertSec),
    restAlertSec: clampAlertSec(settings.restAlertSec),
  }
}

function clampAlertSec(value: number): number {
  if (!Number.isFinite(value) || value < 0) return DEFAULT_SOUND_SETTINGS.workAlertSec
  return Math.min(Math.round(value), 5999)
}

export function downloadAppExport(data: AppDataExport) {
  const date = new Date().toISOString().slice(0, 10)
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `hiit-backup-${date}.json`
  link.click()
  URL.revokeObjectURL(url)
}
