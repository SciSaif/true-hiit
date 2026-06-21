import { useState } from 'react'

interface ExerciseGifProps {
  src: string
  alt: string
  size?: 'thumb' | 'session'
  className?: string
}

export function ExerciseGif({ src, alt, size = 'session', className = '' }: ExerciseGifProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className={`exercise-gif-fallback exercise-gif-${size} ${className}`} aria-hidden="true">
        <span>{alt.charAt(0)}</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={`${alt} demonstration`}
      className={`exercise-gif exercise-gif-${size} ${className}`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}
