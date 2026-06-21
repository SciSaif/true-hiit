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

export interface WorkoutPlan {
  id: string
  name: string
  exerciseIds: string[]
  createdAt: string
  updatedAt: string
}

export interface AppDataExport {
  version: 1
  exportedAt: string
  workoutPlans: WorkoutPlan[]
  soundSettings: SoundSettings
  timerSettings?: TimerSettings
}
