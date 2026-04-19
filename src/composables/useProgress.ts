import { shallowRef } from 'vue'

export function useProgress(deckTitle: string) {
  const prefix = `progress:${deckTitle}:`

  const correctIds = shallowRef(
    new Set(
      Object.keys(localStorage)
        .filter(k => k.startsWith(prefix) && localStorage.getItem(k) === 'correct')
        .map(k => k.slice(prefix.length)),
    ),
  )

  function isCorrect(cardId: string): boolean {
    return correctIds.value.has(cardId)
  }

  function markCorrect(cardId: string): void {
    localStorage.setItem(`${prefix}${cardId}`, 'correct')
    correctIds.value = new Set([...correctIds.value, cardId])
  }

  return { isCorrect, markCorrect, correctIds }
}
