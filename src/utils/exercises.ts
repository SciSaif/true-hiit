import type { Exercise } from '../types'

export function resolveExerciseIds(ids: string[], library: Exercise[]): Exercise[] {
  return ids
    .map((id) => library.find((exercise) => exercise.id === id))
    .filter((exercise): exercise is Exercise => exercise !== undefined)
}
