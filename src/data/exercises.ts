import type { Exercise } from '../types'

const EXERCISEDB = 'https://static.exercisedb.dev/media'

export const EXERCISES: Exercise[] = [
  {
    id: 'burpees',
    name: 'Burpees',
    description: 'Full-body explosive movement — squat, plank, push-up, jump.',
    gifUrl: `${EXERCISEDB}/dK9394r.gif`,
  },
  {
    id: 'high-knees',
    name: 'High Knees',
    description: 'Drive knees up rapidly while pumping arms.',
    gifUrl: `${EXERCISEDB}/CcWEoWV.gif`,
  },
  {
    id: 'jumping-jacks',
    name: 'Jumping Jacks',
    description: 'Jump feet wide while raising arms overhead.',
    gifUrl: `${EXERCISEDB}/HtfCpfi.gif`,
  },
  {
    id: 'mountain-climbers',
    name: 'Mountain Climbers',
    description: 'Plank position, alternate knees to chest fast.',
    gifUrl: `${EXERCISEDB}/RJgzwny.gif`,
  },
  {
    id: 'squat-jumps',
    name: 'Squat Jumps',
    description: 'Deep squat then explode upward into a jump.',
    gifUrl: `${EXERCISEDB}/LIlE5Tn.gif`,
  },
  {
    id: 'push-ups',
    name: 'Push-ups',
    description: 'Chest to floor, full extension — as fast as form allows.',
    gifUrl: `${EXERCISEDB}/I4hDWkc.gif`,
  },
  {
    id: 'bicycle-crunches',
    name: 'Bicycle Crunches',
    description: 'Alternate elbow to opposite knee in a cycling motion.',
    gifUrl: `${EXERCISEDB}/tZkGYZ9.gif`,
  },
  {
    id: 'lunges',
    name: 'Jump Lunges',
    description: 'Alternate legs with an explosive switch in the air.',
    gifUrl: `${EXERCISEDB}/PM1PZjg.gif`,
  },
  {
    id: 'plank-jacks',
    name: 'Plank Jacks',
    description: 'Plank hold while jumping feet in and out.',
    gifUrl: 'https://media.giphy.com/media/2UqZvQq4p9DjTBDVRc/giphy.gif',
  },
  {
    id: 'skaters',
    name: 'Skaters',
    description: 'Leap side to side, landing on one foot each time.',
    gifUrl: `${EXERCISEDB}/zfNHMN9.gif`,
  },
]
