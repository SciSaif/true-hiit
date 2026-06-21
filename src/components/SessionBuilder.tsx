import { useRef, useState } from 'react'
import type { Exercise, SoundSettings as SoundSettingsType } from '../types'
import { ExerciseGif } from './ExerciseGif'
import { SoundSettings } from './SoundSettings'

interface SessionBuilderProps {
  library: Exercise[]
  soundSettings: SoundSettingsType
  onSoundSettingsChange: (patch: Partial<SoundSettingsType>) => void
  onToggleSound: () => void
  onStart: (exercises: Exercise[]) => void
}

export function SessionBuilder({
  library,
  soundSettings,
  onSoundSettingsChange,
  onToggleSound,
  onStart,
}: SessionBuilderProps) {
  const [sessionExercises, setSessionExercises] = useState<Exercise[]>([
    library[0],
    library[1],
    library[2],
  ])
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

  return (
    <div className="session-builder">
      <header className="app-header">
        <h1>True HIIT</h1>
        <p className="tagline">
          Work until you hit your limit. Rest until you&apos;re ready. No fixed intervals.
        </p>
      </header>

      <section className="panel">
        <div className="panel-header">
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
        <SoundSettings settings={soundSettings} onChange={onSoundSettingsChange} />
        {!soundSettings.enabled && (
          <p className="sound-off-hint">Enable sound to get alerts during work and rest periods.</p>
        )}
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Your session</h2>
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

        <button
          type="button"
          className="primary-btn start-btn"
          disabled={sessionExercises.length === 0}
          onClick={() => onStart(sessionExercises)}
        >
          Start session
        </button>
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
    </div>
  )
}
