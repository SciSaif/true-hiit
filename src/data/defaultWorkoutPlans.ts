import { DEFAULT_INTERVAL_REST_SEC, DEFAULT_INTERVAL_WORK_SEC, type WorkoutPlan } from '../types'
import {
  DEFAULT_SELF_PACED_SOUND_SETTINGS,
  DEFAULT_SELF_PACED_TIMER_SETTINGS,
} from '../utils/selfPacedSettings'

const SEEDED_AT = '2024-01-01T00:00:00.000Z'

export const DEFAULT_WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: 'default-leg-core-alternator',
    name: 'Leg & Core Alternator',
    exerciseIds: [
      'high-knees',
      'bicycle-crunches',
      'squat-jumps',
      'push-ups',
      'lunges',
      'mountain-climbers',
      'skaters',
      'plank-jacks',
    ],
    mode: 'self-paced',
    workSec: DEFAULT_INTERVAL_WORK_SEC,
    restSec: DEFAULT_INTERVAL_REST_SEC,
    soundSettings: { ...DEFAULT_SELF_PACED_SOUND_SETTINGS },
    timerSettings: { ...DEFAULT_SELF_PACED_TIMER_SETTINGS },
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT,
  },
  {
    id: 'default-45-15-circuit',
    name: '45/15 Circuit',
    exerciseIds: [
      'butt-kicks',
      'squat-taps',
      'high-knee-taps',
      'switching-lunges',
      'burpees',
      'mountain-climbers',
      'high-plank-jacks',
      'bicycles',
      'seated-in-and-outs',
      'jumping-jacks',
    ],
    mode: 'interval',
    workSec: 45,
    restSec: 15,
    soundSettings: { ...DEFAULT_SELF_PACED_SOUND_SETTINGS },
    timerSettings: { ...DEFAULT_SELF_PACED_TIMER_SETTINGS },
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT,
  },
]
