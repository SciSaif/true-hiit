import { useState } from 'react'
import { EXERCISES } from './data/exercises'
import type { Exercise } from './types'
import { SessionBuilder } from './components/SessionBuilder'
import { WorkoutSession } from './components/WorkoutSession'
import { useSoundSettings } from './hooks/useSoundSettings'
import './App.css'

type AppView = 'builder' | 'session'

function App() {
  const [view, setView] = useState<AppView>('builder')
  const [sessionExercises, setSessionExercises] = useState<Exercise[]>([])
  const { settings: soundSettings, updateSettings: updateSoundSettings, toggleEnabled: toggleSound } =
    useSoundSettings()

  const handleStart = (exercises: Exercise[]) => {
    setSessionExercises(exercises)
    setView('session')
  }

  const handleExit = () => {
    setView('builder')
    setSessionExercises([])
  }

  return (
    <div className="app">
      {view === 'builder' ? (
        <SessionBuilder
          library={EXERCISES}
          soundSettings={soundSettings}
          onSoundSettingsChange={updateSoundSettings}
          onToggleSound={toggleSound}
          onStart={handleStart}
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
