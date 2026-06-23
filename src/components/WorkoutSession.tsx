import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react'
import type {
  Exercise,
  Phase,
  SessionRecord,
  SoundSettings as SoundSettingsType,
  TimerSettings as TimerSettingsType,
  WorkoutMode,
} from '../types'
import { formatTime, useStopwatch } from '../hooks/useStopwatch'
import { useCountdownTimer } from '../hooks/useCountdownTimer'
import { useSessionKeyboard } from '../hooks/useSessionKeyboard'
import { usePhaseAlert } from '../hooks/usePhaseAlert'
import { useTransitionSounds } from '../hooks/useTransitionSounds'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { ExerciseGif } from './ExerciseGif'

interface WorkoutSessionProps {
  exercises: Exercise[]
  mode: WorkoutMode
  workSec: number
  restSec: number
  soundSettings: SoundSettingsType
  timerSettings: TimerSettingsType
  onExit: () => void
}

export function WorkoutSession({
  exercises,
  mode,
  workSec,
  restSec,
  soundSettings,
  timerSettings,
  onExit,
}: WorkoutSessionProps) {
  const isInterval = mode === 'interval'
  const workDurationMs = workSec * 1000
  const restDurationMs = restSec * 1000

  const [sessionSound, setSessionSound] = useState(soundSettings)
  const toggleSound = useCallback(() => {
    setSessionSound((current) => ({ ...current, enabled: !current.enabled }))
  }, [])

  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('work')
  const [completed, setCompleted] = useState(false)
  const [timerToken, setTimerToken] = useState(0)
  const [records, setRecords] = useState<SessionRecord[]>([])
  const [currentWorkMs, setCurrentWorkMs] = useState(0)
  const [pendingRestMs, setPendingRestMs] = useState(0)

  const timerRunning = !completed
  const elapsedMs = useStopwatch(timerRunning, timerToken)
  const countdownElapsedMs = useCountdownTimer(phase === 'countdown', timerToken)
  const elapsedRef = useRef(elapsedMs)
  const restAutoAdvanceReadyRef = useRef(false)
  const suppressTransitionSoundRef = useRef(false)

  useEffect(() => {
    elapsedRef.current = elapsedMs
  }, [elapsedMs])

  useEffect(() => {
    if (phase === 'rest') {
      restAutoAdvanceReadyRef.current = false
    }
  }, [phase, timerToken])

  useEffect(() => {
    if (phase === 'rest' && !restAutoAdvanceReadyRef.current && elapsedMs < 100) {
      restAutoAdvanceReadyRef.current = true
    }
  }, [phase, elapsedMs])

  const currentExercise = exercises[exerciseIndex]
  const nextExercise = !completed && exerciseIndex < exercises.length - 1 ? exercises[exerciseIndex + 1] : null
  const isLastExercise = exerciseIndex === exercises.length - 1
  const featuredExercise =
    phase === 'work' ? currentExercise : phase === 'rest' || phase === 'countdown' ? nextExercise : null

  const resetTimer = useCallback(() => {
    setTimerToken((token) => token + 1)
  }, [])

  const finishExerciseAndStartNext = useCallback(
    (restMs: number) => {
      const record: SessionRecord = {
        exerciseId: currentExercise.id,
        exerciseName: currentExercise.name,
        workMs: currentWorkMs,
        restMs,
      }

      setRecords((prev) => [...prev, record])
      setCurrentWorkMs(0)
      setPendingRestMs(0)
      setExerciseIndex((index) => index + 1)
      setPhase('work')
      resetTimer()
    },
    [currentExercise, currentWorkMs, resetTimer],
  )

  const advance = useCallback(() => {
    if (completed) return

    if (phase === 'work') {
      const workMs = isInterval
        ? Math.min(elapsedRef.current, workDurationMs)
        : Math.max(0, elapsedRef.current - timerSettings.workEndPenaltySec * 1000)
      setCurrentWorkMs(workMs)
      setPhase('rest')
      resetTimer()
      return
    }

    if (phase === 'countdown') {
      finishExerciseAndStartNext(pendingRestMs)
      return
    }

    if (isLastExercise) {
      const restMs = isInterval ? Math.min(elapsedRef.current, restDurationMs) : elapsedRef.current
      const record: SessionRecord = {
        exerciseId: currentExercise.id,
        exerciseName: currentExercise.name,
        workMs: currentWorkMs,
        restMs,
      }

      setRecords((prev) => [...prev, record])
      setCurrentWorkMs(0)
      setCompleted(true)
      resetTimer()
      return
    }

    const restMs = isInterval ? Math.min(elapsedRef.current, restDurationMs) : elapsedRef.current

    if (isInterval || timerSettings.countdownSec <= 0) {
      finishExerciseAndStartNext(restMs)
      return
    }

    setPendingRestMs(restMs)
    setPhase('countdown')
    resetTimer()
  }, [
    completed,
    phase,
    isInterval,
    workDurationMs,
    restDurationMs,
    timerSettings.workEndPenaltySec,
    timerSettings.countdownSec,
    isLastExercise,
    currentExercise,
    currentWorkMs,
    pendingRestMs,
    finishExerciseAndStartNext,
    resetTimer,
  ])

  useEffect(() => {
    if (completed || phase === 'countdown') return

    if (isInterval && phase === 'work' && elapsedMs >= workDurationMs) {
      setCurrentWorkMs(workDurationMs)
      setPhase('rest')
      resetTimer()
      return
    }

    if (
      isInterval &&
      phase === 'rest' &&
      restAutoAdvanceReadyRef.current &&
      elapsedMs >= restDurationMs
    ) {
      advance()
    }
  }, [completed, phase, isInterval, elapsedMs, workDurationMs, restDurationMs, advance, resetTimer])

  useEffect(() => {
    if (isInterval || phase !== 'countdown' || completed) return

    const countdownMs = timerSettings.countdownSec * 1000
    if (countdownMs <= 0) return
    if (countdownElapsedMs >= countdownMs) {
      finishExerciseAndStartNext(pendingRestMs)
    }
  }, [
    phase,
    completed,
    countdownElapsedMs,
    timerSettings.countdownSec,
    isInterval,
    pendingRestMs,
    finishExerciseAndStartNext,
  ])

  const countdownMs = timerSettings.countdownSec * 1000
  const countdownRemainingSec =
    phase === 'countdown' ? Math.max(0, Math.ceil((countdownMs - countdownElapsedMs) / 1000)) : 0

  useTransitionSounds({
    enabled: sessionSound.enabled,
    phase,
    exerciseIndex,
    countdownRemainingSec,
    completed,
    suppressNextRef: suppressTransitionSoundRef,
  })

  const goBack = useCallback(() => {
    suppressTransitionSoundRef.current = true
    if (completed) {
      setCompleted(false)
      setExerciseIndex(exercises.length - 1)
      setPhase('rest')
      const lastRecord = records[records.length - 1]
      if (lastRecord) {
        setCurrentWorkMs(lastRecord.workMs)
        setRecords((prev) => prev.slice(0, -1))
      }
      resetTimer()
      return
    }

    if (phase === 'countdown') {
      setPendingRestMs(0)
      setPhase('rest')
      resetTimer()
      return
    }

    if (phase === 'rest') {
      setPhase('work')
      resetTimer()
      return
    }

    if (exerciseIndex === 0) return

    const previousRecord = records[records.length - 1]
    if (previousRecord) {
      setRecords((prev) => prev.slice(0, -1))
      setCurrentWorkMs(previousRecord.workMs)
    }

    setExerciseIndex((index) => index - 1)
    setPhase('rest')
    resetTimer()
  }, [completed, phase, exerciseIndex, exercises.length, records, resetTimer])

  const canGoBack = completed || phase === 'countdown' || phase === 'rest' || exerciseIndex > 0

  useSessionKeyboard(advance, goBack, { enabled: !completed, canGoBack })

  usePhaseAlert({
    enabled: sessionSound.enabled && !isInterval,
    phase,
    elapsedMs,
    resetToken: timerToken,
    workAlertSec: sessionSound.workAlertSec,
    restAlertSec: sessionSound.restAlertSec,
    active: !completed,
  })

  const isTouchLayout = useMediaQuery('(max-width: 480px), (pointer: coarse)')

  const handleSessionTap = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (completed) return

      const target = event.target as HTMLElement
      if (target.closest('button, input, textarea, select, label, a')) return

      advance()
    },
    [completed, advance],
  )

  const advanceLabel =
    phase === 'work'
      ? isInterval
        ? 'skip work'
        : 'end work'
      : phase === 'countdown'
        ? 'start now'
        : isLastExercise
          ? 'finish session'
          : isInterval
            ? 'skip rest'
            : 'begin countdown'

  const phaseLabel = completed
    ? 'Complete'
    : phase === 'work'
      ? 'Work'
      : phase === 'countdown'
        ? 'Get ready'
        : 'Rest'

  const phaseHint = completed
    ? 'Review your times below, or start a new session.'
    : isTouchLayout
      ? phase === 'work'
        ? isInterval
          ? 'Give it your all — tap anywhere to skip early'
          : 'Push until your limit, then tap anywhere'
        : phase === 'countdown'
          ? 'Get into position — tap anywhere to start early'
          : isLastExercise
            ? 'Rest up, then tap anywhere to finish'
            : isInterval
              ? 'Recover — tap anywhere to skip rest early'
              : 'Rest until ready, then tap anywhere to begin countdown'
      : phase === 'work'
        ? isInterval
          ? 'Give it your all — press Space to skip early'
          : 'Push until your limit, then press Space'
        : phase === 'countdown'
          ? 'Get into position — press Space to start early'
          : isLastExercise
            ? 'Rest up, then press Space to finish'
            : isInterval
              ? 'Recover — press Space to skip rest early'
              : 'Rest until ready, then press Space to begin countdown'

  const countdownDisplaySec = phase === 'countdown' ? Math.max(1, countdownRemainingSec) : 0

  const intervalRemainingMs =
    phase === 'work'
      ? Math.max(0, workDurationMs - elapsedMs)
      : phase === 'rest'
        ? Math.max(0, restDurationMs - elapsedMs)
        : 0

  const displayTime = completed
    ? records.reduce((sum, record) => sum + record.workMs + record.restMs, 0)
    : phase === 'countdown'
      ? countdownDisplaySec * 1000
      : isInterval && (phase === 'work' || phase === 'rest')
        ? intervalRemainingMs
        : elapsedMs

  const totalWorkMs =
    records.reduce((sum, record) => sum + record.workMs, 0) +
    (phase === 'rest' || phase === 'countdown' || completed ? currentWorkMs : elapsedMs)

  const workButtonLabel = isInterval ? 'Skip' : 'Hit limit'
  const restButtonLabel = isLastExercise ? 'Finish' : isInterval ? 'Skip rest' : 'Begin countdown'

  return (
    <div
      className={`workout-session phase-${completed ? 'complete' : phase}${!completed && isTouchLayout ? ' workout-session-tappable' : ''}`}
      onClick={!completed && isTouchLayout ? handleSessionTap : undefined}
    >
      <header className="session-header">
        <button type="button" className="text-btn" onClick={onExit}>
          ← Exit
        </button>
        <div className="session-header-right">
          {!completed && (
            <span className="progress-label">
              {exerciseIndex + 1} / {exercises.length}
            </span>
          )}
          {!completed && (
            <button
              type="button"
              className={`icon-btn sound-toggle${sessionSound.enabled ? ' sound-toggle-on' : ''}`}
              onClick={toggleSound}
              aria-label={sessionSound.enabled ? 'Turn sound off' : 'Turn sound on'}
              aria-pressed={sessionSound.enabled}
            >
              {sessionSound.enabled ? '🔊' : '🔇'}
            </button>
          )}
        </div>
      </header>

      <main className="session-main">
        <div className={`phase-badge phase-badge-${completed ? 'complete' : phase}`}>{phaseLabel}</div>

        {!completed && featuredExercise && (
          <>
            {phase === 'rest' && <p className="up-next-label">Up next</p>}
            {phase === 'countdown' && <p className="countdown-prompt">Get into position</p>}
            <ExerciseGif
              src={featuredExercise.gifUrl}
              alt={featuredExercise.name}
              size="session"
              className="session-exercise-gif"
            />
            <h1 className="current-exercise">{featuredExercise.name}</h1>
            <p className="exercise-description">{featuredExercise.description}</p>
          </>
        )}

        {!completed && phase === 'rest' && isLastExercise && (
          <h1 className="current-exercise">Final rest</h1>
        )}

        {completed && <h1 className="current-exercise">Session complete</h1>}

        <div
          className={`timer-display${phase === 'countdown' ? ' timer-display-countdown' : ''}`}
          aria-live="polite"
        >
          {phase === 'countdown' ? countdownDisplaySec : formatTime(displayTime)}
        </div>

        <p className="phase-hint">{phaseHint}</p>

        <div className="keyboard-hint">
          {!completed && !isTouchLayout && (
            <>
              <kbd>Space</kbd> or <kbd>→</kbd> {advanceLabel}
              {canGoBack && (
                <>
                  {' '}
                  · <kbd>←</kbd> back
                </>
              )}
            </>
          )}
          {!completed && isTouchLayout && <span className="tap-hint">Tap anywhere to {advanceLabel}</span>}
        </div>
      </main>

      <footer className="session-footer">
        <button type="button" className="secondary-btn" onClick={goBack} disabled={!canGoBack}>
          ← Back
        </button>

        {!completed && (
          <button type="button" className="primary-btn session-advance-btn" onClick={advance}>
            {phase === 'work' ? workButtonLabel : phase === 'countdown' ? 'Start now' : restButtonLabel}
          </button>
        )}

        {completed && (
          <button type="button" className="primary-btn" onClick={onExit}>
            New session
          </button>
        )}
      </footer>

      {(records.length > 0 || phase === 'rest' || phase === 'countdown') && (
        <section className="session-summary">
          <h2>Session log</h2>
          <ul>
            {records.map((record, index) => (
              <li key={`${record.exerciseId}-${index}`}>
                <span>{record.exerciseName}</span>
                <span>
                  {formatTime(record.workMs)} work · {formatTime(record.restMs)} rest
                </span>
              </li>
            ))}
            {!completed && phase === 'rest' && (
              <li className="current-log">
                <span>{currentExercise.name}</span>
                <span>
                  {formatTime(currentWorkMs)} work · {formatTime(elapsedMs)} rest
                </span>
              </li>
            )}
            {!completed && phase === 'countdown' && (
              <li className="current-log">
                <span>{currentExercise.name}</span>
                <span>
                  {formatTime(currentWorkMs)} work · {formatTime(pendingRestMs)} rest · getting ready
                </span>
              </li>
            )}
          </ul>
          {!completed && (
            <p className="total-work">Total work time: {formatTime(totalWorkMs)}</p>
          )}
        </section>
      )}
    </div>
  )
}
