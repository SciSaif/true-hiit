import { useCallback, useState } from 'react'
import { EXERCISES } from './data/exercises'
import type { Exercise } from './types'
import { SessionBuilder } from './components/SessionBuilder'
import { WorkoutSession } from './components/WorkoutSession'
import { useSoundSettings } from './hooks/useSoundSettings'
import { useWorkoutPlans } from './hooks/useWorkoutPlans'
import { applyAppImport, buildAppExport, downloadAppExport, parseAppImport } from './utils/appData'
import './App.css'

type AppView = 'builder' | 'session'

function App() {
  const [view, setView] = useState<AppView>('builder')
  const [sessionExercises, setSessionExercises] = useState<Exercise[]>([])
  const {
    settings: soundSettings,
    updateSettings: updateSoundSettings,
    toggleEnabled: toggleSound,
    replaceSettings,
  } = useSoundSettings()
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
    const data = buildAppExport(plans, soundSettings)
    downloadAppExport(data)
  }, [plans, soundSettings])

  const handleImportData = useCallback(
    async (file: File): Promise<boolean> => {
      try {
        const raw = await file.text()
        const data = parseAppImport(raw)
        if (!data) return false

        applyAppImport(data)
        replacePlans(data.workoutPlans)
        replaceSettings(data.soundSettings)
        return true
      } catch {
        return false
      }
    },
    [replacePlans, replaceSettings],
  )

  return (
    <div className="app">
      {view === 'builder' ? (
        <SessionBuilder
          library={EXERCISES}
          plans={plans}
          soundSettings={soundSettings}
          onSoundSettingsChange={updateSoundSettings}
          onToggleSound={toggleSound}
          onStart={handleStart}
          onSavePlan={handleSavePlan}
          onDeletePlan={deletePlan}
          onExportData={handleExportData}
          onImportData={handleImportData}
        />
      ) : (
        <WorkoutSession
          exercises={sessionExercises}
          soundSettings={soundSettings}
          onSoundSettingsChange={updateSoundSettings}
          onToggleSound={toggleSound}
          onExit={handleExit}
        />
      )}
    </div>
  )
}

export default App
