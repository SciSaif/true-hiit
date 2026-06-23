import { useEffect } from 'react'

interface UseSessionKeyboardOptions {
  enabled?: boolean
  canGoBack?: boolean
}

export function useSessionKeyboard(
  onAdvance: () => void,
  onBack: () => void,
  { enabled = true, canGoBack = true }: UseSessionKeyboardOptions = {},
) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      if (event.code === 'Space' || event.code === 'ArrowRight') {
        event.preventDefault()
        onAdvance()
        return
      }

      if (event.code === 'ArrowLeft' && canGoBack) {
        event.preventDefault()
        onBack()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled, canGoBack, onAdvance, onBack])
}
