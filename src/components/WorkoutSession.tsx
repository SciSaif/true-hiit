import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react'
import type { Exercise, Phase, SessionRecord, SoundSettings as SoundSettingsType } from '../types'
import { formatTime, useStopwatch } from '../hooks/useStopwatch'
import { useSpaceKey } from '../hooks/useSpaceKey'
import { usePhaseAlert } from '../hooks/usePhaseAlert'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { ExerciseGif } from './ExerciseGif'
import { SoundSettings } from './SoundSettings'

interface WorkoutSessionProps {
  exercises: Exercise[]
  soundSettings: SoundSettingsType
  onSoundSettingsChange: (patch: Partial<SoundSettingsType>) => void
  onToggleSound: () => void
  onExit: () => void
}

export function WorkoutSession({
  exercises,
  soundSettings,
  onSoundSettingsChange,
  onToggleSound,
  onExit,
}: WorkoutSessionProps) {
  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('work')
  const [completed, setCompleted] = useState(false)
  const [timerToken, setTimerToken] = useState(0)
  const [records, setRecords] = useState<SessionRecord[]>([])
  const [currentWorkMs, setCurrentWorkMs] = useState(0)

  const timerRunning = !completed
  const elapsedMs = useStopwatch(timerRunning, timerToken)
  const elapsedRef = useRef(elapsedMs)

  useEffect(() => {
    elapsedRef.current = elapsedMs
  }, [elapsedMs])

  const currentExercise = exercises[exerciseIndex]
  const isLastExercise = exerciseIndex === exercises.length - 1

  const resetTimer = useCallback(() => {
    setTimerToken((token) => token + 1)
  }, [])

  const advance = useCallback(() => {
    if (completed) return

    if (phase === 'work') {
      setCurrentWorkMs(elapsedRef.current)
      setPhase('rest')
      resetTimer()
      return
    }

    const record: SessionRecord = {
      exerciseId: currentExercise.id,
      exerciseName: currentExercise.name,
      workMs: currentWorkMs,
      restMs: elapsedRef.current,
    }

    setRecords((prev) => [...prev, record])
    setCurrentWorkMs(0)

    if (isLastExercise) {
      setCompleted(true)
      resetTimer()
      return
    }

    setExerciseIndex((index) => index + 1)
    setPhase('work')
    resetTimer()
  }, [completed, phase, currentExercise, currentWorkMs, isLastExercise, resetTimer])

  const goBack = useCallback(() => {
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

  useSpaceKey(advance, !completed)

  usePhaseAlert({
    enabled: soundSettings.enabled,
    phase,
    elapsedMs,
    resetToken: timerToken,
    workAlertSec: soundSettings.workAlertSec,
    restAlertSec: soundSettings.restAlertSec,
    active: !completed,
  })

  const canGoBack = completed || phase === 'rest' || exerciseIndex > 0
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
    phase === 'work' ? 'end work' : isLastExercise ? 'finish session' : 'start next exercise'

  const phaseLabel = completed ? 'Complete' : phase === 'work' ? 'Work' : 'Rest'
  const phaseHint = completed
    ? 'Review your times below, or start a new session.'
    : isTouchLayout
      ? phase === 'work'
        ? 'Push until your limit, then tap anywhere'
        : isLastExercise
          ? 'Rest up, then tap anywhere to finish'
          : 'Rest until ready, then tap anywhere for the next exercise'
      : phase === 'work'
        ? 'Push until your limit, then press Space'
        : isLastExercise
          ? 'Rest up, then press Space to finish'
          : 'Rest until ready, then press Space for the next exercise'

  const displayTime = completed
    ? records.reduce((sum, record) => sum + record.workMs + record.restMs, 0)
    : elapsedMs

  const totalWorkMs = records.reduce((sum, record) => sum + record.workMs, 0) + (phase === 'rest' || completed ? currentWorkMs : elapsedMs)

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
          <button
            type="button"
            className={`icon-btn sound-toggle${soundSettings.enabled ? ' sound-toggle-on' : ''}`}
            onClick={onToggleSound}
            aria-label={soundSettings.enabled ? 'Turn sound off' : 'Turn sound on'}
            aria-pressed={soundSettings.enabled}
          >
            {soundSettings.enabled ? '🔊' : '🔇'}
          </button>
        </div>
      </header>

      {soundSettings.enabled && !completed && (
        <SoundSettings
          settings={soundSettings}
          onChange={onSoundSettingsChange}
          compact
        />
      )}

      <main className="session-main">
        <div className={`phase-badge phase-badge-${completed ? 'complete' : phase}`}>{phaseLabel}</div>

        {!completed && (
          <>
            <ExerciseGif
              src={currentExercise.gifUrl}
              alt={currentExercise.name}
              size="session"
              className="session-exercise-gif"
            />
            <h1 className="current-exercise">{currentExercise.name}</h1>
            <p className="exercise-description">{currentExercise.description}</p>
          </>
        )}

        {completed && <h1 className="current-exercise">Session complete</h1>}

        <div className="timer-display" aria-live="polite">
          {formatTime(displayTime)}
        </div>

        <p className="phase-hint">{phaseHint}</p>

        <div className="keyboard-hint">
          {!completed && !isTouchLayout && (
            <>
              <kbd>Space</kbd> {advanceLabel}
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
            {phase === 'work' ? 'Hit limit' : isLastExercise ? 'Finish' : 'Next exercise'}
          </button>
        )}

        {completed && (
          <button type="button" className="primary-btn" onClick={onExit}>
            New session
          </button>
        )}
      </footer>

      {(records.length > 0 || phase === 'rest') && (
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
          </ul>
          {!completed && (
            <p className="total-work">Total work time: {formatTime(totalWorkMs)}</p>
          )}
        </section>
      )}
    </div>
  )
}
