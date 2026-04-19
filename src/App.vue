<script setup lang="ts">
import type { Deck } from './types'
import { RouterView } from 'vue-router'
import { useDeckStore } from './composables/useDeckStore'

const { addDeck } = useDeckStore()

const modules = import.meta.glob<{ default: unknown }>('./decks/*.json', { eager: true })

function isDeck(obj: unknown): obj is Deck {
  if (typeof obj !== 'object' || obj === null)
    return false
  const d = obj as Record<string, unknown>
  return typeof d.title === 'string' && Array.isArray(d.flashcards) && Array.isArray(d.quiz)
}

for (const mod of Object.values(modules)) {
  if (isDeck(mod.default))
    addDeck(mod.default)
}
</script>

<template>
  <RouterView />
</template>
