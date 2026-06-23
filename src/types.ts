export interface Exercise {
  id: string
  name: string
  description: string
  gifUrl: string
}

export type Phase = 'work' | 'rest' | 'countdown'

export interface SessionRecord {
  exerciseId: string
  exerciseName: string
  workMs: number
  restMs: number
}

export interface SoundSettings {
  enabled: boolean
  workAlertSec: number
  restAlertSec: number
}

export interface TimerSettings {
  countdownSec: number
  workEndPenaltySec: number
}

export type WorkoutMode = 'self-paced' | 'interval'

export const DEFAULT_INTERVAL_WORK_SEC = 40
export const DEFAULT_INTERVAL_REST_SEC = 20

export interface WorkoutPlan {
  id: string
  name: string
  exerciseIds: string[]
  mode: WorkoutMode
  workSec: number
  restSec: number
  soundSettings: SoundSettings
  timerSettings: TimerSettings
  createdAt: string
  updatedAt: string
}

export interface SessionConfig {
  exercises: Exercise[]
  mode: WorkoutMode
  workSec: number
  restSec: number
  soundSettings: SoundSettings
  timerSettings: TimerSettings
}

export interface AppDataExport {
  version: 1
  exportedAt: string
  workoutPlans: WorkoutPlan[]
  /** @deprecated Legacy global settings — merged into self-paced plans on import */
  soundSettings?: SoundSettings
  /** @deprecated Legacy global settings — merged into self-paced plans on import */
  timerSettings?: TimerSettings
}
