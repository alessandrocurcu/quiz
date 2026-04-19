import type { Deck } from '../types'
import { ref } from 'vue'

const decks = ref<Deck[]>([])

function addDeck(deck: Deck): void {
  decks.value.push(deck)
}

export function useDeckStore() {
  // decks è esposto mutabile intenzionalmente: readonly() genera DeepReadonly<Ref<Deck[]>>
  // che non è assegnabile a Deck[] nelle prop dei componenti figli. Vedi ADR-001.
  return { decks, addDeck }
}
