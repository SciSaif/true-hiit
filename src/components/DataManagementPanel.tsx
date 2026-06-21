import { useRef, useState } from 'react'

interface DataManagementPanelProps {
  onExport: () => void
  onImport: (file: File) => Promise<boolean>
  embedded?: boolean
}

export function DataManagementPanel({ onExport, onImport, embedded = false }: DataManagementPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)

  const handleImportClick = () => {
    setImportError(null)
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const confirmed = window.confirm(
      'Importing will replace all saved workouts and settings. Continue?',
    )
    if (!confirmed) return

    setImporting(true)
    setImportError(null)

    const success = await onImport(file)
    if (!success) {
      setImportError('Invalid backup file. Please choose a valid HIIT export.')
    }

    setImporting(false)
  }

  return (
    <section className={embedded ? 'settings-section' : 'panel'}>
      <div className={embedded ? 'settings-section-header' : 'panel-header'}>
        <h2>Backup &amp; restore</h2>
      </div>
      <p className="panel-description">
        Export saved workouts and settings, or import a backup to restore them.
      </p>
      <div className="data-actions">
        <button type="button" className="secondary-btn" onClick={onExport}>
          Export all data
        </button>
        <button
          type="button"
          className="secondary-btn"
          onClick={handleImportClick}
          disabled={importing}
        >
          {importing ? 'Importing…' : 'Import data'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={handleFileChange}
        />
      </div>
      {importError && <p className="import-error">{importError}</p>}
    </section>
  )
}
