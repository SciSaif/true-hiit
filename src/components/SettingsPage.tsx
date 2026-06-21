import type { SoundSettings as SoundSettingsType, TimerSettings as TimerSettingsType } from '../types'
import { SoundSettings } from './SoundSettings'
import { TimerSettings } from './TimerSettings'
import { DataManagementPanel } from './DataManagementPanel'

interface SettingsPageProps {
  soundSettings: SoundSettingsType
  onSoundSettingsChange: (patch: Partial<SoundSettingsType>) => void
  onToggleSound: () => void
  timerSettings: TimerSettingsType
  onTimerSettingsChange: (patch: Partial<TimerSettingsType>) => void
  onExportData: () => void
  onImportData: (file: File) => Promise<boolean>
  onBack: () => void
}

export function SettingsPage({
  soundSettings,
  onSoundSettingsChange,
  onToggleSound,
  timerSettings,
  onTimerSettingsChange,
  onExportData,
  onImportData,
  onBack,
}: SettingsPageProps) {
  return (
    <div className="settings-page">
      <header className="page-header">
        <button type="button" className="text-btn" onClick={onBack}>
          ← Back
        </button>
        <h1 className="page-title">Settings</h1>
        <span className="page-header-spacer" aria-hidden="true" />
      </header>

      <section className="settings-section">
        <div className="settings-section-header">
          <h2>Sound alerts</h2>
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
        <SoundSettings settings={soundSettings} onChange={onSoundSettingsChange} embedded alwaysShow />
        {!soundSettings.enabled && (
          <p className="settings-hint">Turn on sound to get alerts during work and rest.</p>
        )}
      </section>

      <section className="settings-section">
        <h2>Transition timers</h2>
        <TimerSettings settings={timerSettings} onChange={onTimerSettingsChange} embedded />
      </section>

      <DataManagementPanel onExport={onExportData} onImport={onImportData} embedded />
    </div>
  )
}
