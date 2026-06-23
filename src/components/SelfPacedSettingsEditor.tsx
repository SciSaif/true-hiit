import type { SoundSettings, TimerSettings } from '../types'
import { SoundSettings as SoundSettingsFields } from './SoundSettings'
import { TimerSettings as TimerSettingsFields } from './TimerSettings'

interface SelfPacedSettingsEditorProps {
  soundSettings: SoundSettings
  timerSettings: TimerSettings
  onSoundChange: (patch: Partial<SoundSettings>) => void
  onTimerChange: (patch: Partial<TimerSettings>) => void
  onToggleSound: () => void
}

export function SelfPacedSettingsEditor({
  soundSettings,
  timerSettings,
  onSoundChange,
  onTimerChange,
  onToggleSound,
}: SelfPacedSettingsEditorProps) {
  return (
    <div className="self-paced-settings-editor">
      <div className="self-paced-settings-editor-header">
        <span className="self-paced-settings-editor-label">Session settings</span>
        <button
          type="button"
          className={`icon-btn sound-toggle${soundSettings.enabled ? ' sound-toggle-on' : ''}`}
          onClick={onToggleSound}
          aria-label={soundSettings.enabled ? 'Turn sound off' : 'Turn sound on'}
          aria-pressed={soundSettings.enabled}
        >
          {soundSettings.enabled ? '🔊' : '🔇'}
        </button>
      </div>
      <SoundSettingsFields
        settings={soundSettings}
        onChange={onSoundChange}
        embedded
        compact
        alwaysShow
      />
      <TimerSettingsFields settings={timerSettings} onChange={onTimerChange} embedded compact />
    </div>
  )
}
