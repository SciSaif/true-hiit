import type { WorkoutMode } from '../types'

interface ModeSelectionProps {
  onSelect: (mode: WorkoutMode) => void
}

export function ModeSelection({ onSelect }: ModeSelectionProps) {
  return (
    <div className="mode-selection">
      <h2 className="mode-selection-title">Choose a workout mode</h2>
      <p className="mode-selection-subtitle">
        Pick how you want to time your session. You can always change this when creating a new workout.
      </p>

      <div className="mode-options">
        <button type="button" className="mode-card" onClick={() => onSelect('self-paced')}>
          <span className="mode-card-badge mode-card-badge-self">Self-paced</span>
          <h3>Hit your limit</h3>
          <p>
            Push as hard as you can on each exercise, then stop the timer yourself when you reach your
            limit. Rest for as long as you need before moving on — you control the pace.
          </p>
          <ul className="mode-card-features">
            <li>You decide when work ends</li>
            <li>Rest until you feel ready</li>
            <li>Best for max-effort training</li>
          </ul>
        </button>

        <button type="button" className="mode-card" onClick={() => onSelect('interval')}>
          <span className="mode-card-badge mode-card-badge-interval">Interval</span>
          <h3>Fixed timings</h3>
          <p>
            Set a work duration and a break duration for each exercise. The timer advances automatically
            when time is up — no need to stop it yourself.
          </p>
          <ul className="mode-card-features">
            <li>Automatic work and rest periods</li>
            <li>Consistent round lengths</li>
            <li>Best for structured HIIT circuits</li>
          </ul>
        </button>
      </div>
    </div>
  )
}
