import type { Exercise, WorkoutPlan } from '../types'
import { SavedPlansPanel } from './SavedPlansPanel'

interface HomePageProps {
  plans: WorkoutPlan[]
  library: Exercise[]
  onCreateWorkout: () => void
  onStart: (plan: WorkoutPlan, exercises: Exercise[]) => void
  onUpdatePlan: (id: string, updates: Partial<Omit<WorkoutPlan, 'id' | 'createdAt'>>) => void
  onDeletePlan: (id: string) => void
  onOpenSettings: () => void
}

export function HomePage({
  plans,
  library,
  onCreateWorkout,
  onStart,
  onUpdatePlan,
  onDeletePlan,
  onOpenSettings,
}: HomePageProps) {
  return (
    <div className="home-page">
      <header className="app-header">
        <div className="app-header-row">
          <h1>True HIIT</h1>
          <button
            type="button"
            className="text-btn settings-link"
            onClick={onOpenSettings}
            aria-label="Open settings"
          >
            Settings
          </button>
        </div>
        <p className="tagline">Build workouts, save them, and train your way.</p>
      </header>

      <SavedPlansPanel
        plans={plans}
        library={library}
        onStart={onStart}
        onUpdate={onUpdatePlan}
        onDelete={onDeletePlan}
      />

      {plans.length === 0 && (
        <section className="panel empty-home-panel">
          <p className="empty-state">No saved workouts yet. Create your first one below.</p>
        </section>
      )}

      <button type="button" className="primary-btn create-workout-btn" onClick={onCreateWorkout}>
        Create new workout
      </button>
    </div>
  )
}
