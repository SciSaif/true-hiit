import { useCallback, useState } from 'react'
import { EXERCISES } from './data/exercises'
import type { Exercise, SessionConfig, SoundSettings, TimerSettings, WorkoutMode, WorkoutPlan } from './types'
import { HomePage } from './components/HomePage'
import { WorkoutCreationPage } from './components/WorkoutCreationPage'
import { WorkoutSession } from './components/WorkoutSession'
import { SettingsPage } from './components/SettingsPage'
import { useWorkoutPlans } from './hooks/useWorkoutPlans'
import { applyAppImport, buildAppExport, downloadAppExport, parseAppImport } from './utils/appData'
import './App.css'

type AppView = 'home' | 'create' | 'session' | 'settings'

function App() {
  const [view, setView] = useState<AppView>('home')
  const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null)
  const { plans, savePlan, updatePlan, deletePlan, replacePlans } = useWorkoutPlans()

  const handleStart = useCallback(
    (
      exercises: Exercise[],
      mode: WorkoutMode,
      workSec: number,
      restSec: number,
      soundSettings: SoundSettings,
      timerSettings: TimerSettings,
    ) => {
      setSessionConfig({
        exercises,
        mode,
        workSec,
        restSec,
        soundSettings: { ...soundSettings },
        timerSettings: { ...timerSettings },
      })
      setView('session')
    },
    [],
  )

  const handleStartPlan = useCallback((plan: WorkoutPlan, exercises: Exercise[]) => {
    setSessionConfig({
      exercises,
      mode: plan.mode,
      workSec: plan.workSec,
      restSec: plan.restSec,
      soundSettings: { ...plan.soundSettings },
      timerSettings: { ...plan.timerSettings },
    })
    setView('session')
  }, [])

  const handleExit = () => {
    setView('home')
    setSessionConfig(null)
  }

  const handleSavePlan = useCallback(
    (
      name: string,
      exerciseIds: string[],
      mode: WorkoutMode,
      workSec: number,
      restSec: number,
      soundSettings: SoundSettings,
      timerSettings: TimerSettings,
    ) => {
      savePlan(name, exerciseIds, mode, workSec, restSec, soundSettings, timerSettings)
    },
    [savePlan],
  )

  const handleExportData = useCallback(() => {
    const data = buildAppExport(plans)
    downloadAppExport(data)
  }, [plans])

  const handleImportData = useCallback(
    async (file: File): Promise<boolean> => {
      try {
        const raw = await file.text()
        const data = parseAppImport(raw)
        if (!data) return false

        applyAppImport(data)
        replacePlans(data.workoutPlans)
        return true
      } catch {
        return false
      }
    },
    [replacePlans],
  )

  return (
    <div className="app">
      {view === 'home' && (
        <HomePage
          plans={plans}
          library={EXERCISES}
          onCreateWorkout={() => setView('create')}
          onStart={handleStartPlan}
          onUpdatePlan={updatePlan}
          onDeletePlan={deletePlan}
          onOpenSettings={() => setView('settings')}
        />
      )}

      {view === 'create' && (
        <WorkoutCreationPage
          library={EXERCISES}
          onBack={() => setView('home')}
          onSavePlan={handleSavePlan}
          onStart={handleStart}
        />
      )}

      {view === 'settings' && (
        <SettingsPage
          onExportData={handleExportData}
          onImportData={handleImportData}
          onBack={() => setView('home')}
        />
      )}

      {view === 'session' && sessionConfig && (
        <WorkoutSession
          exercises={sessionConfig.exercises}
          mode={sessionConfig.mode}
          workSec={sessionConfig.workSec}
          restSec={sessionConfig.restSec}
          soundSettings={sessionConfig.soundSettings}
          timerSettings={sessionConfig.timerSettings}
          onExit={handleExit}
        />
      )}
    </div>
  )
}

export default App
