import type { SoundSettings, TimerSettings } from '../types'
import { DEFAULT_SOUND_SETTINGS } from './soundSettings'
import { DEFAULT_TIMER_SETTINGS } from './timerSettings'

export const DEFAULT_SELF_PACED_SOUND_SETTINGS: SoundSettings = {
  enabled: true,
  workAlertSec: 30,
  restAlertSec: 30,
}

export const DEFAULT_SELF_PACED_TIMER_SETTINGS: TimerSettings = {
  countdownSec: 5,
  workEndPenaltySec: 5,
}

export function normalizePlanSoundSettings(
  settings: Partial<SoundSettings> | undefined,
  defaults: SoundSettings = DEFAULT_SOUND_SETTINGS,
): SoundSettings {
  if (!settings) return { ...defaults }
  return {
    enabled: settings.enabled ?? defaults.enabled,
    workAlertSec: clampAlertSec(settings.workAlertSec ?? defaults.workAlertSec),
    restAlertSec: clampAlertSec(settings.restAlertSec ?? defaults.restAlertSec),
  }
}

export function normalizePlanTimerSettings(
  settings: Partial<TimerSettings> | undefined,
  defaults: TimerSettings = DEFAULT_TIMER_SETTINGS,
): TimerSettings {
  if (!settings) return { ...defaults }
  return {
    countdownSec: clampTimerSec(settings.countdownSec ?? defaults.countdownSec),
    workEndPenaltySec: clampTimerSec(settings.workEndPenaltySec ?? defaults.workEndPenaltySec),
  }
}

export function formatSelfPacedSettingsBrief(
  soundSettings: SoundSettings,
  timerSettings: TimerSettings,
): string {
  const alerts = soundSettings.enabled
    ? `Alerts ${soundSettings.workAlertSec}/${soundSettings.restAlertSec}s`
    : 'Sound off'
  const countdown =
    timerSettings.countdownSec > 0 ? `${timerSettings.countdownSec}s countdown` : 'No countdown'
  const penalty =
    timerSettings.workEndPenaltySec > 0
      ? `${timerSettings.workEndPenaltySec}s penalty`
      : 'No penalty'
  return `${alerts} · ${countdown} · ${penalty}`
}

function clampAlertSec(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0
  return Math.min(Math.round(value), 5999)
}

function clampTimerSec(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0
  return Math.min(Math.round(value), 60)
}
