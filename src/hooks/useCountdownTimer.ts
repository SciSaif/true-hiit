import { useEffect, useState } from 'react'

export function useCountdownTimer(active: boolean, resetToken: number) {
  const [elapsedMs, setElapsedMs] = useState(0)

  useEffect(() => {
    if (!active) {
      setElapsedMs(0)
      return
    }

    const start = performance.now()
    setElapsedMs(0)

    const intervalId = window.setInterval(() => {
      setElapsedMs(performance.now() - start)
    }, 50)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [active, resetToken])

  return elapsedMs
}
