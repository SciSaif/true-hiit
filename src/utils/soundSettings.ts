import type { SoundSettings } from '../types'

const STORAGE_KEY = 'hiit-sound-settings'

export const DEFAULT_SOUND_SETTINGS: SoundSettings = {
  enabled: false,
  workAlertSec: 30,
  restAlertSec: 30,
}

export function loadSoundSettings(): SoundSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SOUND_SETTINGS

    const parsed = JSON.parse(raw) as Partial<SoundSettings>
    return {
      enabled: parsed.enabled ?? DEFAULT_SOUND_SETTINGS.enabled,
      workAlertSec: clampAlertSec(parsed.workAlertSec ?? DEFAULT_SOUND_SETTINGS.workAlertSec),
      restAlertSec: clampAlertSec(parsed.restAlertSec ?? DEFAULT_SOUND_SETTINGS.restAlertSec),
    }
  } catch {
    return DEFAULT_SOUND_SETTINGS
  }
}

export function saveSoundSettings(settings: SoundSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

function clampAlertSec(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0
  return Math.min(Math.round(value), 5999)
}
