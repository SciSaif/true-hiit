import { useCallback, useState } from 'react'
import type { TimerSettings } from '../types'
import { loadTimerSettings, saveTimerSettings } from '../utils/timerSettings'

export function useTimerSettings() {
  const [settings, setSettings] = useState<TimerSettings>(loadTimerSettings)

  const updateSettings = useCallback((patch: Partial<TimerSettings>) => {
    setSettings((current) => {
      const next = { ...current, ...patch }
      saveTimerSettings(next)
      return next
    })
  }, [])

  const replaceSettings = useCallback((next: TimerSettings) => {
    saveTimerSettings(next)
    setSettings(next)
  }, [])

  return { settings, updateSettings, replaceSettings }
}
