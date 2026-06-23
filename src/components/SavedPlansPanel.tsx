import { useState } from 'react'
import type { Exercise, SoundSettings, TimerSettings, WorkoutPlan } from '../types'
import { resolveExerciseIds } from '../utils/exercises'
import { formatSelfPacedSettingsBrief } from '../utils/selfPacedSettings'
import { workoutModeLabel } from '../utils/workoutPlans'
import { ExerciseGif } from './ExerciseGif'
import { SelfPacedSettingsEditor } from './SelfPacedSettingsEditor'
import { WorkoutPreviewModal } from './WorkoutPreviewModal'

interface SavedPlansPanelProps {
  plans: WorkoutPlan[]
  library: Exercise[]
  onStart: (plan: WorkoutPlan, exercises: Exercise[]) => void
  onUpdate: (id: string, updates: Partial<Omit<WorkoutPlan, 'id' | 'createdAt'>>) => void
  onDelete: (id: string) => void
}

export function SavedPlansPanel({ plans, library, onStart, onUpdate, onDelete }: SavedPlansPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingSettingsId, setEditingSettingsId] = useState<string | null>(null)
  const [previewPlan, setPreviewPlan] = useState<WorkoutPlan | null>(null)
  const [draftTimings, setDraftTimings] = useState<Record<string, { workSec: number; restSec: number }>>({})

  if (plans.length === 0) return null

  const previewExercises = previewPlan ? resolveExerciseIds(previewPlan.exerciseIds, library) : []
  const previewHasMissing =
    previewPlan !== null && previewExercises.length !== previewPlan.exerciseIds.length

  const handleStartPreview = () => {
    if (!previewPlan || previewExercises.length === 0) return
    const draft = getDraftTiming(previewPlan)
    const planWithTimings = { ...previewPlan, workSec: draft.workSec, restSec: draft.restSec }
    if (draft.workSec !== previewPlan.workSec || draft.restSec !== previewPlan.restSec) {
      onUpdate(previewPlan.id, { workSec: draft.workSec, restSec: draft.restSec })
    }
    onStart(planWithTimings, previewExercises)
    setPreviewPlan(null)
  }

  const toggleExpanded = (planId: string) => {
    setExpandedId((current) => (current === planId ? null : planId))
  }

  const getDraftTiming = (plan: WorkoutPlan) => {
    return draftTimings[plan.id] ?? { workSec: plan.workSec, restSec: plan.restSec }
  }

  const updateDraftTiming = (planId: string, field: 'workSec' | 'restSec', value: number) => {
    setDraftTimings((current) => {
      const existing = current[planId]
      const plan = plans.find((item) => item.id === planId)
      const base = existing ?? { workSec: plan?.workSec ?? 40, restSec: plan?.restSec ?? 20 }
      const clamped = Number.isFinite(value) && value >= 1 ? Math.min(Math.round(value), 3600) : base[field]
      return { ...current, [planId]: { ...base, [field]: clamped } }
    })
  }

  const commitTimings = (plan: WorkoutPlan) => {
    const draft = getDraftTiming(plan)
    if (draft.workSec !== plan.workSec || draft.restSec !== plan.restSec) {
      onUpdate(plan.id, { workSec: draft.workSec, restSec: draft.restSec })
    }
  }

  const updateSoundSettings = (planId: string, patch: Partial<SoundSettings>) => {
    const plan = plans.find((item) => item.id === planId)
    if (!plan) return
    onUpdate(planId, { soundSettings: { ...plan.soundSettings, ...patch } })
  }

  const updateTimerSettings = (planId: string, patch: Partial<TimerSettings>) => {
    const plan = plans.find((item) => item.id === planId)
    if (!plan) return
    onUpdate(planId, { timerSettings: { ...plan.timerSettings, ...patch } })
  }

  const togglePlanSound = (planId: string) => {
    const plan = plans.find((item) => item.id === planId)
    if (!plan) return
    onUpdate(planId, { soundSettings: { ...plan.soundSettings, enabled: !plan.soundSettings.enabled } })
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
            const isExpanded = expandedId === plan.id
            const isEditingSettings = editingSettingsId === plan.id
            const draft = getDraftTiming(plan)

            return (
              <li key={plan.id} className={`saved-plan-item${isExpanded ? ' saved-plan-item-expanded' : ''}`}>
                <button
                  type="button"
                  className="saved-plan-header"
                  onClick={() => toggleExpanded(plan.id)}
                  aria-expanded={isExpanded}
                >
                  <div className="saved-plan-info">
                    <div className="saved-plan-title-row">
                      <strong>{plan.name}</strong>
                      <span className={`mode-pill mode-pill-${plan.mode}`}>
                        {workoutModeLabel(plan.mode)}
                      </span>
                    </div>
                    <p>
                      {exercises.length} exercise{exercises.length === 1 ? '' : 's'}
                      {plan.mode === 'interval' && ` · ${plan.workSec}s work · ${plan.restSec}s break`}
                      {hasMissingExercises && ' · some exercises unavailable'}
                    </p>
                    {plan.mode === 'self-paced' && (
                      <div
                        className="saved-plan-settings-row"
                        onClick={(event) => event.stopPropagation()}
                        onKeyDown={(event) => event.stopPropagation()}
                      >
                        <p className="saved-plan-settings-brief">
                          {formatSelfPacedSettingsBrief(plan.soundSettings, plan.timerSettings)}
                        </p>
                        <button
                          type="button"
                          className="text-btn saved-plan-settings-edit"
                          onClick={() =>
                            setEditingSettingsId((current) => (current === plan.id ? null : plan.id))
                          }
                        >
                          {isEditingSettings ? 'Done' : 'Change'}
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="expand-chevron" aria-hidden="true">
                    {isExpanded ? '▾' : '▸'}
                  </span>
                </button>

                {plan.mode === 'self-paced' && isEditingSettings && (
                  <div
                    className="saved-plan-settings-editor-wrap"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <SelfPacedSettingsEditor
                      soundSettings={plan.soundSettings}
                      timerSettings={plan.timerSettings}
                      onSoundChange={(patch) => updateSoundSettings(plan.id, patch)}
                      onTimerChange={(patch) => updateTimerSettings(plan.id, patch)}
                      onToggleSound={() => togglePlanSound(plan.id)}
                    />
                  </div>
                )}

                {isExpanded && (
                  <div className="saved-plan-details">
                    {plan.mode === 'interval' && (
                      <div className="saved-plan-timings">
                        <label className="interval-field">
                          <span>Work time</span>
                          <div className="timer-input-wrap">
                            <input
                              type="number"
                              min={1}
                              max={3600}
                              value={draft.workSec}
                              onChange={(event) =>
                                updateDraftTiming(plan.id, 'workSec', Number(event.target.value))
                              }
                              onBlur={() => commitTimings(plan)}
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
                              value={draft.restSec}
                              onChange={(event) =>
                                updateDraftTiming(plan.id, 'restSec', Number(event.target.value))
                              }
                              onBlur={() => commitTimings(plan)}
                            />
                            <span className="timer-input-suffix">sec</span>
                          </div>
                        </label>
                      </div>
                    )}

                    <ol className="saved-plan-exercises">
                      {exercises.map((exercise, index) => (
                        <li key={exercise.id} className="saved-plan-exercise">
                          <span className="exercise-order">{index + 1}</span>
                          <ExerciseGif src={exercise.gifUrl} alt={exercise.name} size="thumb" />
                          <div className="exercise-info">
                            <strong>{exercise.name}</strong>
                            <p>{exercise.description}</p>
                          </div>
                        </li>
                      ))}
                    </ol>

                    <div className="saved-plan-actions">
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
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </section>

      {previewPlan && (
        <WorkoutPreviewModal
          planName={previewPlan.name}
          exercises={previewExercises}
          mode={previewPlan.mode}
          workSec={getDraftTiming(previewPlan).workSec}
          restSec={getDraftTiming(previewPlan).restSec}
          hasMissingExercises={previewHasMissing}
          onStart={handleStartPreview}
          onClose={() => setPreviewPlan(null)}
        />
      )}
    </>
  )
}
