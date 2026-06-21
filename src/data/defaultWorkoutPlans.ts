import type { WorkoutPlan } from '../types'

const SEEDED_AT = '2024-01-01T00:00:00.000Z'

export const DEFAULT_WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: 'default-beginner-starter',
    name: 'Beginner Starter',
    exerciseIds: ['jumping-jacks', 'high-knees', 'squat-jumps', 'lunges', 'push-ups'],
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT,
  },
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
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT,
  },
  {
    id: 'default-cardio-blast',
    name: 'Cardio Blast',
    exerciseIds: ['jumping-jacks', 'burpees', 'mountain-climbers', 'squat-jumps', 'skaters'],
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT,
  },
]
