import type { TimerSettings } from '../types'

const STORAGE_KEY = 'hiit-timer-settings'

export const DEFAULT_TIMER_SETTINGS: TimerSettings = {
  countdownSec: 5,
  workEndPenaltySec: 5,
}

export function loadTimerSettings(): TimerSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_TIMER_SETTINGS

    const parsed = JSON.parse(raw) as Partial<TimerSettings>
    return {
      countdownSec: clampTimerSec(parsed.countdownSec ?? DEFAULT_TIMER_SETTINGS.countdownSec),
      workEndPenaltySec: clampTimerSec(
        parsed.workEndPenaltySec ?? DEFAULT_TIMER_SETTINGS.workEndPenaltySec,
      ),
    }
  } catch {
    return DEFAULT_TIMER_SETTINGS
  }
}

export function saveTimerSettings(settings: TimerSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

function clampTimerSec(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0
  return Math.min(Math.round(value), 60)
}
