import type { Exercise } from '../types'

const EXERCISEDB = 'https://static.exercisedb.dev/media'
const LOADMUSCLE = 'https://pub-7c14918da31d450e8d6787a3c225c277.r2.dev/gifs/720'

export const EXERCISES: Exercise[] = [
  {
    id: 'butt-kicks',
    name: 'Butt Kicks',
    description: 'Jog in place, kicking your heels back toward your glutes.',
    gifUrl: `${LOADMUSCLE}/3037.webp`,
  },
  {
    id: 'squat-taps',
    name: 'Squat Taps',
    description: 'Squat down and tap the floor between your feet, then stand back up.',
    gifUrl: `${LOADMUSCLE}/4417.webp`,
  },
  {
    id: 'high-knee-taps',
    name: 'High Knee Taps',
    description: 'Drive each knee up and tap it with the opposite hand.',
    gifUrl: `${LOADMUSCLE}/5537.webp`,
  },
  {
    id: 'switching-lunges',
    name: 'Switching Lunges',
    description: 'Alternate legs with an explosive switch in the air.',
    gifUrl: `${EXERCISEDB}/PM1PZjg.gif`,
  },
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
    gifUrl: `${LOADMUSCLE}/3094.webp`,
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
    id: 'bicycles',
    name: 'Bicycles',
    description: 'Alternate elbow to opposite knee in a cycling motion.',
    gifUrl: `${EXERCISEDB}/1ZFqTDN.gif`,
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
    gifUrl: `${LOADMUSCLE}/3930.webp`,
  },
  {
    id: 'high-plank-jacks',
    name: 'High Plank Jacks',
    description: 'High plank hold while jumping feet in and out.',
    gifUrl: `${LOADMUSCLE}/3930.webp`,
  },
  {
    id: 'seated-in-and-outs',
    name: 'Seated In and Outs',
    description: 'Seated on the floor, draw knees in and extend legs out.',
    gifUrl: `${EXERCISEDB}/v7p5bYl.gif`,
  },
  {
    id: 'skaters',
    name: 'Skaters',
    description: 'Leap side to side, landing on one foot each time.',
    gifUrl: `${EXERCISEDB}/zfNHMN9.gif`,
  },
]
