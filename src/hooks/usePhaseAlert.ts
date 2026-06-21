import { useEffect, useRef } from 'react'
import type { Phase } from '../types'
import { playBeep } from '../utils/playBeep'

interface UsePhaseAlertOptions {
  enabled: boolean
  phase: Phase
  elapsedMs: number
  resetToken: number
  workAlertSec: number
  restAlertSec: number
  active: boolean
}

export function usePhaseAlert({
  enabled,
  phase,
  elapsedMs,
  resetToken,
  workAlertSec,
  restAlertSec,
  active,
}: UsePhaseAlertOptions) {
  const firedRef = useRef(false)

  useEffect(() => {
    firedRef.current = false
  }, [resetToken])

  useEffect(() => {
    if (!enabled || !active) return

    const alertSec = phase === 'work' ? workAlertSec : restAlertSec
    if (alertSec <= 0) return

    const alertMs = alertSec * 1000
    if (!firedRef.current && elapsedMs >= alertMs) {
      firedRef.current = true
      playBeep()
    }
  }, [enabled, active, phase, elapsedMs, workAlertSec, restAlertSec, resetToken])
}
