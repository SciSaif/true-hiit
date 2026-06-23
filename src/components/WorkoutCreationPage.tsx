import { useRef, useState } from 'react'
import type { Exercise, SoundSettings, TimerSettings, WorkoutMode } from '../types'
import {
  DEFAULT_INTERVAL_REST_SEC,
  DEFAULT_INTERVAL_WORK_SEC,
} from '../types'
import {
  DEFAULT_SELF_PACED_SOUND_SETTINGS,
  DEFAULT_SELF_PACED_TIMER_SETTINGS,
} from '../utils/selfPacedSettings'
import { workoutModeLabel } from '../utils/workoutPlans'
import { ExerciseGif } from './ExerciseGif'
import { ModeSelection } from './ModeSelection'
import { SelfPacedSettingsEditor } from './SelfPacedSettingsEditor'

interface WorkoutCreationPageProps {
  library: Exercise[]
  onBack: () => void
  onSavePlan: (
    name: string,
    exerciseIds: string[],
    mode: WorkoutMode,
    workSec: number,
    restSec: number,
    soundSettings: SoundSettings,
    timerSettings: TimerSettings,
  ) => void
  onStart: (
    exercises: Exercise[],
    mode: WorkoutMode,
    workSec: number,
    restSec: number,
    soundSettings: SoundSettings,
    timerSettings: TimerSettings,
  ) => void
}

export function WorkoutCreationPage({
  library,
  onBack,
  onSavePlan,
  onStart,
}: WorkoutCreationPageProps) {
  const [mode, setMode] = useState<WorkoutMode | null>(null)
  const [sessionExercises, setSessionExercises] = useState<Exercise[]>([])
  const [workSec, setWorkSec] = useState(DEFAULT_INTERVAL_WORK_SEC)
  const [restSec, setRestSec] = useState(DEFAULT_INTERVAL_REST_SEC)
  const [soundSettings, setSoundSettings] = useState<SoundSettings>({
    ...DEFAULT_SELF_PACED_SOUND_SETTINGS,
  })
  const [timerSettings, setTimerSettings] = useState<TimerSettings>({
    ...DEFAULT_SELF_PACED_TIMER_SETTINGS,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [planName, setPlanName] = useState('')
  const dragIndexRef = useRef<number | null>(null)

  const availableExercises = library.filter(
    (exercise) => !sessionExercises.some((item) => item.id === exercise.id),
  )

  const addExercise = (exercise: Exercise) => {
    setSessionExercises((current) => [...current, exercise])
  }

  const removeExercise = (id: string) => {
    setSessionExercises((current) => current.filter((item) => item.id !== id))
  }

  const moveExercise = (fromIndex: number, toIndex: number) => {
    setSessionExercises((current) => {
      if (toIndex < 0 || toIndex >= current.length) return current
      const next = [...current]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
  }

  const handleModeSelect = (selectedMode: WorkoutMode) => {
    setMode(selectedMode)
    if (sessionExercises.length === 0) {
      setSessionExercises([library[0], library[1], library[2]].filter(Boolean))
    }
  }

  const handleSavePlan = () => {
    const trimmedName = planName.trim()
    if (!trimmedName || sessionExercises.length === 0 || !mode) return

    onSavePlan(
      trimmedName,
      sessionExercises.map((exercise) => exercise.id),
      mode,
      workSec,
      restSec,
      soundSettings,
      timerSettings,
    )
    setPlanName('')
    setIsSaving(false)
    onBack()
  }

  const handleStart = () => {
    if (!mode || sessionExercises.length === 0) return
    onStart(sessionExercises, mode, workSec, restSec, soundSettings, timerSettings)
  }

  const handleDragStart = (index: number) => {
    dragIndexRef.current = index
  }

  const handleDragOver = (event: React.DragEvent, index: number) => {
    event.preventDefault()
    const fromIndex = dragIndexRef.current
    if (fromIndex === null || fromIndex === index) return
    moveExercise(fromIndex, index)
    dragIndexRef.current = index
  }

  const handleDragEnd = () => {
    dragIndexRef.current = null
  }

  const clampIntervalInput = (value: number, fallback: number) => {
    if (!Number.isFinite(value) || value < 1) return fallback
    return Math.min(Math.round(value), 3600)
  }

  return (
    <div className="workout-creation-page">
      <header className="page-header">
        <button type="button" className="text-btn" onClick={onBack}>
          ← Back
        </button>
        <h1 className="page-title">New workout</h1>
        <span className="page-header-spacer" aria-hidden="true" />
      </header>

      {mode === null ? (
        <ModeSelection onSelect={handleModeSelect} />
      ) : (
        <>
          <section className="panel mode-summary-panel">
            <div className="mode-summary">
              <span className={`mode-pill mode-pill-${mode}`}>{workoutModeLabel(mode)}</span>
              <p className="mode-summary-text">
                {mode === 'self-paced'
                  ? 'You stop the timer when you hit your limit. Rest as long as you need.'
                  : 'Fixed work and rest periods that advance automatically.'}
              </p>
              <button type="button" className="text-btn" onClick={() => setMode(null)}>
                Change mode
              </button>
            </div>

            {mode === 'interval' && (
              <div className="interval-timing-fields">
                <label className="interval-field">
                  <span>Work time</span>
                  <div className="timer-input-wrap">
                    <input
                      type="number"
                      min={1}
                      max={3600}
                      value={workSec}
                      onChange={(event) =>
                        setWorkSec(clampIntervalInput(Number(event.target.value), workSec))
                      }
                    />
                    <span className="timer-input-suffix">sec</span>
                  </div>
                </label>
                <label className="interval-field">
                  <span>Break time</span>
                  <div className="timer-input-wrap">
                    <input
                      type="number"
                      min={1}
                      max={3600}
                      value={restSec}
                      onChange={(event) =>
                        setRestSec(clampIntervalInput(Number(event.target.value), restSec))
                      }
                    />
                    <span className="timer-input-suffix">sec</span>
                  </div>
                </label>
              </div>
            )}

            {mode === 'self-paced' && (
              <SelfPacedSettingsEditor
                soundSettings={soundSettings}
                timerSettings={timerSettings}
                onSoundChange={(patch) => setSoundSettings((current) => ({ ...current, ...patch }))}
                onTimerChange={(patch) => setTimerSettings((current) => ({ ...current, ...patch }))}
                onToggleSound={() =>
                  setSoundSettings((current) => ({ ...current, enabled: !current.enabled }))
                }
              />
            )}
          </section>

          <section className="panel">
            <div className="panel-header">
              <h2>Exercises</h2>
              <span className="badge">{sessionExercises.length} exercises</span>
            </div>

            {sessionExercises.length === 0 ? (
              <p className="empty-state">Add exercises from the library below to build your workout.</p>
            ) : (
              <ol className="exercise-list">
                {sessionExercises.map((exercise, index) => (
                  <li
                    key={exercise.id}
                    className="exercise-item"
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(event) => handleDragOver(event, index)}
                    onDragEnd={handleDragEnd}
                  >
                    <span className="drag-handle" aria-hidden="true">
                      ⠿
                    </span>
                    <ExerciseGif src={exercise.gifUrl} alt={exercise.name} size="thumb" />
                    <div className="exercise-info">
                      <span className="exercise-order">{index + 1}</span>
                      <div>
                        <strong>{exercise.name}</strong>
                        <p>{exercise.description}</p>
                      </div>
                    </div>
                    <div className="exercise-actions">
                      <button
                        type="button"
                        className="icon-btn"
                        onClick={() => moveExercise(index, index - 1)}
                        disabled={index === 0}
                        aria-label={`Move ${exercise.name} up`}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="icon-btn"
                        disabled={index === sessionExercises.length - 1}
                        onClick={() => moveExercise(index, index + 1)}
                        aria-label={`Move ${exercise.name} down`}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        className="icon-btn danger"
                        onClick={() => removeExercise(exercise.id)}
                        aria-label={`Remove ${exercise.name}`}
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ol>
            )}

            <div className="session-actions">
              {isSaving ? (
                <div className="save-plan-form">
                  <input
                    type="text"
                    className="plan-name-input"
                    placeholder="Workout name"
                    value={planName}
                    onChange={(event) => setPlanName(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') handleSavePlan()
                      if (event.key === 'Escape') {
                        setIsSaving(false)
                        setPlanName('')
                      }
                    }}
                    autoFocus
                    maxLength={80}
                  />
                  <button
                    type="button"
                    className="secondary-btn"
                    disabled={!planName.trim()}
                    onClick={handleSavePlan}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="text-btn"
                    onClick={() => {
                      setIsSaving(false)
                      setPlanName('')
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="secondary-btn save-plan-btn"
                  disabled={sessionExercises.length === 0}
                  onClick={() => setIsSaving(true)}
                >
                  Save workout
                </button>
              )}

              <button
                type="button"
                className="primary-btn start-btn"
                disabled={sessionExercises.length === 0}
                onClick={handleStart}
              >
                Start workout
              </button>
            </div>
          </section>

          {availableExercises.length > 0 && (
            <section className="panel">
              <div className="panel-header">
                <h2>Add exercises</h2>
              </div>
              <ul className="library-list">
                {availableExercises.map((exercise) => (
                  <li key={exercise.id} className="library-item">
                    <ExerciseGif src={exercise.gifUrl} alt={exercise.name} size="thumb" />
                    <div>
                      <strong>{exercise.name}</strong>
                      <p>{exercise.description}</p>
                    </div>
                    <button type="button" className="secondary-btn" onClick={() => addExercise(exercise)}>
                      Add
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  )
}
