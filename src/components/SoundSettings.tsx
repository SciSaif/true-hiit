import type { SoundSettings as SoundSettingsType } from '../types'

interface SoundSettingsProps {
  settings: SoundSettingsType
  onChange: (patch: Partial<SoundSettingsType>) => void
  compact?: boolean
}

export function SoundSettings({ settings, onChange, compact = false }: SoundSettingsProps) {
  if (!settings.enabled) return null

  return (
    <div className={`sound-settings${compact ? ' sound-settings-compact' : ''}`}>
      <p className="sound-settings-label">Alert after</p>
      <div className="sound-settings-fields">
        <label className="sound-field">
          <span>Work</span>
          <div className="sound-input-wrap">
            <input
              type="number"
              min={0}
              max={5999}
              step={1}
              value={settings.workAlertSec}
              onChange={(event) => onChange({ workAlertSec: parseAlertSec(event.target.value) })}
              aria-label="Work alert after seconds"
            />
            <span className="sound-input-suffix">sec</span>
          </div>
        </label>
        <label className="sound-field">
          <span>Rest</span>
          <div className="sound-input-wrap">
            <input
              type="number"
              min={0}
              max={5999}
              step={1}
              value={settings.restAlertSec}
              onChange={(event) => onChange({ restAlertSec: parseAlertSec(event.target.value) })}
              aria-label="Rest alert after seconds"
            />
            <span className="sound-input-suffix">sec</span>
          </div>
        </label>
      </div>
      <p className="sound-settings-hint">Set to 0 to disable alerts for that phase.</p>
    </div>
  )
}

function parseAlertSec(value: string): number {
  const parsed = parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed < 0) return 0
  return Math.min(parsed, 5999)
}
