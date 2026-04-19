<script setup lang="ts">
import type { Deck } from '../types'
import { useRouter } from 'vue-router'

const props = defineProps<{
  deck: Deck
  index: number
}>()

const router = useRouter()
</script>

<template>
  <article class="deck-card">
    <div class="deck-info">
      <h2 class="deck-title">
        {{ deck.title }}
      </h2>
      <p class="deck-meta">
        {{ deck.flashcards.length }} flashcard · {{ deck.quiz.length }} quiz
      </p>
    </div>
    <div class="deck-actions">
      <button
        class="btn-action"
        @click="router.push({ name: 'flashcards', params: { index: props.index } })"
      >
        Flashcard
      </button>
      <button
        class="btn-action"
        @click="router.push({ name: 'quiz', params: { index: props.index } })"
      >
        Quiz
      </button>
      <button
        class="btn-action btn-action--errors"
        @click="router.push({ name: 'flashcards', params: { index: props.index }, query: { mode: 'errors' } })"
      >
        Ripassa errori
      </button>
    </div>
  </article>
</template>

<style scoped>
.deck-card {
  background-color: var(--color-surface);
  border-radius: var(--radius);
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.deck-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.deck-meta {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.deck-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.btn-action {
  border: 1px solid var(--color-accent);
  color: var(--color-accent);
  background: transparent;
  border-radius: var(--radius-sm);
  padding: 0.5rem 0.75rem;
  min-height: 2.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition:
    background-color 0.15s,
    color 0.15s;
}

.btn-action:hover {
  background-color: var(--color-accent);
  color: #fff;
}

.btn-action--errors {
  border-color: var(--color-text-muted);
  color: var(--color-text-muted);
}

.btn-action--errors:hover {
  background-color: var(--color-text-muted);
  color: var(--color-bg);
}
</style>
