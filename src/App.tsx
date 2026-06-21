import { useCallback, useState } from 'react'
import { EXERCISES } from './data/exercises'
import type { Exercise } from './types'
import { SessionBuilder } from './components/SessionBuilder'
import { WorkoutSession } from './components/WorkoutSession'
import { SettingsPage } from './components/SettingsPage'
import { useSoundSettings } from './hooks/useSoundSettings'
import { useTimerSettings } from './hooks/useTimerSettings'
import { useWorkoutPlans } from './hooks/useWorkoutPlans'
import { DEFAULT_TIMER_SETTINGS } from './utils/timerSettings'
import { applyAppImport, buildAppExport, downloadAppExport, parseAppImport } from './utils/appData'
import './App.css'

type AppView = 'builder' | 'session' | 'settings'

function App() {
  const [view, setView] = useState<AppView>('builder')
  const [sessionExercises, setSessionExercises] = useState<Exercise[]>([])
  const {
    settings: soundSettings,
    updateSettings: updateSoundSettings,
    toggleEnabled: toggleSound,
    replaceSettings,
  } = useSoundSettings()
  const {
    settings: timerSettings,
    updateSettings: updateTimerSettings,
    replaceSettings: replaceTimerSettings,
  } = useTimerSettings()
  const { plans, savePlan, deletePlan, replacePlans } = useWorkoutPlans()

  const handleStart = (exercises: Exercise[]) => {
    setSessionExercises(exercises)
    setView('session')
  }

  const handleExit = () => {
    setView('builder')
    setSessionExercises([])
  }

  const handleSavePlan = useCallback(
    (name: string, exerciseIds: string[]) => {
      savePlan(name, exerciseIds)
    },
    [savePlan],
  )

  const handleExportData = useCallback(() => {
    const data = buildAppExport(plans, soundSettings, timerSettings)
    downloadAppExport(data)
  }, [plans, soundSettings, timerSettings])

  const handleImportData = useCallback(
    async (file: File): Promise<boolean> => {
      try {
        const raw = await file.text()
        const data = parseAppImport(raw)
        if (!data) return false

        applyAppImport(data)
        replacePlans(data.workoutPlans)
        replaceSettings(data.soundSettings)
        replaceTimerSettings(data.timerSettings ?? DEFAULT_TIMER_SETTINGS)
        return true
      } catch {
        return false
      }
    },
    [replacePlans, replaceSettings, replaceTimerSettings],
  )

  return (
    <div className="app">
      {view === 'builder' && (
        <SessionBuilder
          library={EXERCISES}
          plans={plans}
          onStart={handleStart}
          onSavePlan={handleSavePlan}
          onDeletePlan={deletePlan}
          onOpenSettings={() => setView('settings')}
        />
      )}

      {view === 'settings' && (
        <SettingsPage
          soundSettings={soundSettings}
          onSoundSettingsChange={updateSoundSettings}
          onToggleSound={toggleSound}
          timerSettings={timerSettings}
          onTimerSettingsChange={updateTimerSettings}
          onExportData={handleExportData}
          onImportData={handleImportData}
          onBack={() => setView('builder')}
        />
      )}

      {view === 'session' && (
        <WorkoutSession
          exercises={sessionExercises}
          soundSettings={soundSettings}
          onToggleSound={toggleSound}
          timerSettings={timerSettings}
          onExit={handleExit}
        />
      )}
    </div>
  )
}

export default App
