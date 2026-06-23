import type { Exercise, WorkoutMode } from '../types'
import { workoutModeLabel } from '../utils/workoutPlans'
import { ExerciseGif } from './ExerciseGif'

interface WorkoutPreviewModalProps {
  planName: string
  exercises: Exercise[]
  mode: WorkoutMode
  workSec: number
  restSec: number
  hasMissingExercises: boolean
  onStart: () => void
  onClose: () => void
}

export function WorkoutPreviewModal({
  planName,
  exercises,
  mode,
  workSec,
  restSec,
  hasMissingExercises,
  onStart,
  onClose,
}: WorkoutPreviewModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="workout-preview-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="workout-preview-title">{planName}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close preview">
            ×
          </button>
        </div>

        <p className="modal-subtitle">
          {exercises.length} exercise{exercises.length === 1 ? '' : 's'} · {workoutModeLabel(mode)}
          {mode === 'interval' && ` · ${workSec}s work · ${restSec}s break`}
        </p>

        {hasMissingExercises && (
          <p className="modal-warning">Some exercises in this plan are no longer available.</p>
        )}

        <ol className="preview-exercise-list">
          {exercises.map((exercise, index) => (
            <li key={exercise.id} className="preview-exercise-item">
              <span className="exercise-order">{index + 1}</span>
              <ExerciseGif src={exercise.gifUrl} alt={exercise.name} size="thumb" />
              <div className="exercise-info">
                <strong>{exercise.name}</strong>
                <p>{exercise.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="modal-actions">
          <button type="button" className="secondary-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="primary-btn compact-btn" onClick={onStart}>
            Start workout
          </button>
        </div>
      </div>
    </div>
  )
}
