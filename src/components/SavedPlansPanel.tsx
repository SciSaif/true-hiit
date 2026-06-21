import { useState } from 'react'
import type { Exercise, WorkoutPlan } from '../types'
import { resolveExerciseIds } from '../utils/exercises'
import { WorkoutPreviewModal } from './WorkoutPreviewModal'

interface SavedPlansPanelProps {
  plans: WorkoutPlan[]
  library: Exercise[]
  onLoad: (exercises: Exercise[]) => void
  onStart: (exercises: Exercise[]) => void
  onDelete: (id: string) => void
}

export function SavedPlansPanel({
  plans,
  library,
  onLoad,
  onStart,
  onDelete,
}: SavedPlansPanelProps) {
  const [previewPlan, setPreviewPlan] = useState<WorkoutPlan | null>(null)

  if (plans.length === 0) return null

  const previewExercises = previewPlan ? resolveExerciseIds(previewPlan.exerciseIds, library) : []
  const previewHasMissing =
    previewPlan !== null && previewExercises.length !== previewPlan.exerciseIds.length

  const handleStartPreview = () => {
    if (previewExercises.length === 0) return
    onStart(previewExercises)
    setPreviewPlan(null)
  }

  return (
    <>
      <section className="panel">
        <div className="panel-header">
          <h2>Saved workouts</h2>
          <span className="badge">{plans.length}</span>
        </div>

        <ul className="saved-plans-list">
          {plans.map((plan) => {
            const exercises = resolveExerciseIds(plan.exerciseIds, library)
            const hasMissingExercises = exercises.length !== plan.exerciseIds.length

            return (
              <li key={plan.id} className="saved-plan-item">
                <div className="saved-plan-info">
                  <strong>{plan.name}</strong>
                  <p>
                    {exercises.length} exercise{exercises.length === 1 ? '' : 's'}
                    {hasMissingExercises && ' · some exercises unavailable'}
                  </p>
                </div>
                <div className="saved-plan-actions">
                  <button
                    type="button"
                    className="secondary-btn"
                    disabled={exercises.length === 0}
                    onClick={() => onLoad(exercises)}
                  >
                    Load
                  </button>
                  <button
                    type="button"
                    className="primary-btn compact-btn"
                    disabled={exercises.length === 0}
                    onClick={() => setPreviewPlan(plan)}
                  >
                    Start
                  </button>
                  <button
                    type="button"
                    className="icon-btn danger"
                    onClick={() => onDelete(plan.id)}
                    aria-label={`Delete ${plan.name}`}
                  >
                    ×
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      {previewPlan && (
        <WorkoutPreviewModal
          planName={previewPlan.name}
          exercises={previewExercises}
          hasMissingExercises={previewHasMissing}
          onStart={handleStartPreview}
          onClose={() => setPreviewPlan(null)}
        />
      )}
    </>
  )
}
