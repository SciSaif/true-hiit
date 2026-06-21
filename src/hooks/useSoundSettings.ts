import { useCallback, useState } from 'react'
import type { SoundSettings } from '../types'
import { loadSoundSettings, saveSoundSettings } from '../utils/soundSettings'

export function useSoundSettings() {
  const [settings, setSettings] = useState<SoundSettings>(loadSoundSettings)

  const updateSettings = useCallback((patch: Partial<SoundSettings>) => {
    setSettings((current) => {
      const next = { ...current, ...patch }
      saveSoundSettings(next)
      return next
    })
  }, [])

  const toggleEnabled = useCallback(() => {
    setSettings((current) => {
      const next = { ...current, enabled: !current.enabled }
      saveSoundSettings(next)
      return next
    })
  }, [])

  return { settings, updateSettings, toggleEnabled }
}
