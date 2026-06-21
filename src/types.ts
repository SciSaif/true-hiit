export interface Exercise {
  id: string
  name: string
  description: string
  gifUrl: string
}

export type Phase = 'work' | 'rest'

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
