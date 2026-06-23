import type { AppDataExport, SoundSettings, TimerSettings, WorkoutPlan } from '../types'
import {
  normalizePlanSoundSettings,
  normalizePlanTimerSettings,
} from './selfPacedSettings'
import { isValidWorkoutPlan, normalizeWorkoutPlan, saveWorkoutPlans } from './workoutPlans'

export const APP_DATA_VERSION = 1 as const

export function buildAppExport(workoutPlans: WorkoutPlan[]): AppDataExport {
  return {
    version: APP_DATA_VERSION,
    exportedAt: new Date().toISOString(),
    workoutPlans,
  }
}

export function parseAppImport(raw: string): AppDataExport | null {
  try {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null

    const data = parsed as Partial<AppDataExport>
    if (data.version !== APP_DATA_VERSION) return null
    if (!Array.isArray(data.workoutPlans)) return null

    const legacySound = isValidSoundSettings(data.soundSettings)
      ? normalizeLegacySoundSettings(data.soundSettings)
      : undefined
    const legacyTimer = normalizeLegacyTimerSettings(data.timerSettings)

    const workoutPlans = data.workoutPlans
      .filter(isValidWorkoutPlan)
      .map((plan) => migrateImportedPlan(plan, legacySound, legacyTimer))

    if (workoutPlans.length === 0 && data.workoutPlans.length > 0) return null

    return {
      version: APP_DATA_VERSION,
      exportedAt: typeof data.exportedAt === 'string' ? data.exportedAt : new Date().toISOString(),
      workoutPlans,
    }
  } catch {
    return null
  }
}

export function applyAppImport(data: AppDataExport) {
  saveWorkoutPlans(data.workoutPlans)
}

function migrateImportedPlan(
  plan: WorkoutPlan,
  legacySound?: SoundSettings,
  legacyTimer?: TimerSettings,
): WorkoutPlan {
  const raw = plan as WorkoutPlan & {
    soundSettings?: Partial<SoundSettings>
    timerSettings?: Partial<TimerSettings>
  }

  if (raw.mode === 'self-paced') {
    return normalizeWorkoutPlan({
      ...raw,
      soundSettings: normalizePlanSoundSettings(raw.soundSettings ?? legacySound),
      timerSettings: normalizePlanTimerSettings(raw.timerSettings ?? legacyTimer),
    })
  }

  return normalizeWorkoutPlan(raw)
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

function normalizeLegacySoundSettings(settings: SoundSettings): SoundSettings {
  return normalizePlanSoundSettings(settings)
}

function normalizeLegacyTimerSettings(settings: TimerSettings | undefined): TimerSettings | undefined {
  if (!settings) return undefined
  return normalizePlanTimerSettings(settings)
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
