import type { TimerSettings as TimerSettingsType } from '../types'

interface TimerSettingsProps {
  settings: TimerSettingsType
  onChange: (patch: Partial<TimerSettingsType>) => void
  compact?: boolean
  embedded?: boolean
}

export function TimerSettings({ settings, onChange, compact = false, embedded = false }: TimerSettingsProps) {
  return (
    <div
      className={`timer-settings${compact ? ' timer-settings-compact' : ''}${embedded ? ' timer-settings-embedded' : ''}`}
    >
      <div className="timer-settings-fields">
        <label className="timer-field">
          <span>Countdown before next exercise</span>
          <div className="timer-input-wrap">
            <input
              type="number"
              min={0}
              max={60}
              step={1}
              value={settings.countdownSec}
              onChange={(event) => onChange({ countdownSec: parseTimerSec(event.target.value) })}
              aria-label="Countdown before next exercise in seconds"
            />
            <span className="timer-input-suffix">sec</span>
          </div>
        </label>
        <label className="timer-field">
          <span>Subtract when ending work</span>
          <div className="timer-input-wrap">
            <input
              type="number"
              min={0}
              max={60}
              step={1}
              value={settings.workEndPenaltySec}
              onChange={(event) => onChange({ workEndPenaltySec: parseTimerSec(event.target.value) })}
              aria-label="Seconds subtracted when ending work"
            />
            <span className="timer-input-suffix">sec</span>
          </div>
        </label>
      </div>
      <p className="timer-settings-hint">
        Countdown gives you time to get into position. Work penalty accounts for time to press Space
        and get out of position. Set either to 0 to disable.
      </p>
    </div>
  )
}

function parseTimerSec(value: string): number {
  const parsed = parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed < 0) return 0
  return Math.min(parsed, 60)
}
