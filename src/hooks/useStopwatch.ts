import { useEffect, useRef, useState } from 'react'

export function useStopwatch(running: boolean, resetToken: number) {
  const [elapsedMs, setElapsedMs] = useState(0)
  const startTimeRef = useRef<number | null>(null)
  const accumulatedRef = useRef(0)

  useEffect(() => {
    accumulatedRef.current = 0
    startTimeRef.current = running ? performance.now() : null
    setElapsedMs(0)
  }, [resetToken])

  useEffect(() => {
    if (!running) {
      if (startTimeRef.current !== null) {
        accumulatedRef.current += performance.now() - startTimeRef.current
        startTimeRef.current = null
      }
      return
    }

    startTimeRef.current = performance.now()
    const intervalId = window.setInterval(() => {
      if (startTimeRef.current !== null) {
        setElapsedMs(accumulatedRef.current + performance.now() - startTimeRef.current)
      }
    }, 50)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [running])

  return elapsedMs
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const centiseconds = Math.floor((ms % 1000) / 10)

  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`
  }

  return `${seconds}.${centiseconds.toString().padStart(2, '0')}`
}
