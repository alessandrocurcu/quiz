<script setup lang="ts">
import type { Deck } from '../types'
import { shallowRef, useTemplateRef } from 'vue'
import DeckCard from '../components/DeckCard.vue'
import { useDeckStore } from '../composables/useDeckStore'

const { decks, addDeck } = useDeckStore()
const fileInput = useTemplateRef<HTMLInputElement>('fileInput')
const errors = shallowRef<string[]>([])

function isDeck(obj: unknown): obj is Deck {
  if (typeof obj !== 'object' || obj === null)
    return false
  const d = obj as Record<string, unknown>
  return (
    typeof d.title === 'string'
    && Array.isArray(d.flashcards)
    && Array.isArray(d.quiz)
  )
}

async function handleFiles(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (!files?.length)
    return

  const newErrors: string[] = []

  for (const file of files) {
    try {
      const parsed: unknown = JSON.parse(await file.text())
      if (!isDeck(parsed)) {
        newErrors.push(`"${file.name}": formato non valido`)
        continue
      }
      addDeck(parsed)
    }
    catch {
      newErrors.push(`"${file.name}": JSON non valido`)
    }
  }

  errors.value = newErrors
  if (fileInput.value)
    fileInput.value.value = ''
}
</script>

<template>
  <div class="container">
    <header class="home-header">
      <h1 class="home-title">
        Study Deck
      </h1>
      <button class="btn-primary" @click="fileInput?.click()">
        Carica JSON
      </button>
      <input
        ref="fileInput"
        type="file"
        accept=".json"
        multiple
        class="file-input"
        @change="handleFiles"
      >
    </header>

    <ul v-if="errors.length" class="error-list">
      <li v-for="err in errors" :key="err" class="error-item">
        {{ err }}
      </li>
    </ul>

    <p v-if="decks.length === 0" class="empty-state">
      Carica un file JSON per iniziare
    </p>

    <ul v-else class="deck-list">
      <li v-for="(deck, index) in decks" :key="deck.title + index">
        <DeckCard :deck="deck" :index="index" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.home-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.home-title {
  font-size: 1.5rem;
  font-weight: 700;
}

.file-input {
  display: none;
}

.btn-primary {
  background-color: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.5rem 1rem;
  font-weight: 600;
  transition: background-color 0.15s;
}

.btn-primary:hover {
  background-color: var(--color-accent-hover);
}

.error-list {
  list-style: none;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.error-item {
  background-color: rgba(239, 68, 68, 0.12);
  color: var(--color-error);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius-sm);
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

.empty-state {
  text-align: center;
  color: var(--color-text-muted);
  padding: 3rem 0;
}

.deck-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
