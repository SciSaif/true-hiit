import { DataManagementPanel } from './DataManagementPanel'

interface SettingsPageProps {
  onExportData: () => void
  onImportData: (file: File) => Promise<boolean>
  onBack: () => void
}

export function SettingsPage({ onExportData, onImportData, onBack }: SettingsPageProps) {
  return (
    <div className="settings-page">
      <header className="page-header">
        <button type="button" className="text-btn" onClick={onBack}>
          ← Back
        </button>
        <h1 className="page-title">Settings</h1>
        <span className="page-header-spacer" aria-hidden="true" />
      </header>

      <DataManagementPanel onExport={onExportData} onImport={onImportData} embedded />
    </div>
  )
}
