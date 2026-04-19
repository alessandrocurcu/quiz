<script setup lang="ts">
import type { Flashcard } from '../types'
import { computed, shallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FlashcardCard from '../components/FlashcardCard.vue'
import { useDeckStore } from '../composables/useDeckStore'
import { useProgress } from '../composables/useProgress'

const route = useRoute()
const router = useRouter()
const { decks } = useDeckStore()

const deckIndex = Number(route.params.index)
const deck = decks.value[deckIndex]

if (!deck) {
  router.replace({ name: 'home' })
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = a[i] as T
    a[i] = a[j] as T
    a[j] = temp
  }
  return a
}

const isErrorsMode = route.query.mode === 'errors'

const { isCorrect, markCorrect } = useProgress(deck?.title ?? '')

const shuffled = shallowRef<Flashcard[]>(
  deck
    ? shuffle(deck.flashcards.filter(c => !isErrorsMode || !isCorrect(c.id)))
    : [],
)
const currentIndex = shallowRef(0)
const isFlipped = shallowRef(false)

const currentCard = computed(() => shuffled.value[currentIndex.value])

const currentCardCorrect = computed(
  () => !!currentCard.value && isCorrect(currentCard.value.id),
)

function next() {
  currentIndex.value = (currentIndex.value + 1) % shuffled.value.length
  isFlipped.value = false
}

function handleMarkCorrect() {
  if (currentCard.value)
    markCorrect(currentCard.value.id)
}
</script>

<template>
  <div v-if="deck && isErrorsMode && shuffled.length === 0" class="container">
    <div class="all-correct">
      <p class="all-correct-msg">
        Hai risposto correttamente a tutte le carte!
      </p>
      <button class="btn-next" @click="router.push({ name: 'home' })">
        ← Torna alla home
      </button>
    </div>
  </div>

  <div v-else-if="deck && currentCard" class="container">
    <div class="nav-top">
      <button class="btn-ghost" @click="router.push({ name: 'home' })">
        ← Home
      </button>
      <span class="breadcrumb">{{ currentIndex + 1 }} / {{ shuffled.length }}</span>
    </div>

    <FlashcardCard
      :question="currentCard.question"
      :answer="currentCard.answer"
      :is-correct="currentCardCorrect"
      :is-flipped="isFlipped"
      @flip="isFlipped = !isFlipped"
    />

    <div class="actions">
      <button
        v-if="isFlipped && !currentCardCorrect"
        class="btn-correct"
        @click="handleMarkCorrect"
      >
        ✓ Segna come corretto
      </button>
      <button class="btn-next" @click="next">
        Prossima →
      </button>
    </div>
  </div>
</template>

<style scoped>
.nav-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.btn-ghost {
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  padding: 0.5rem 0.5rem;
  min-height: 2.75rem;
  transition: color 0.15s;
}

.btn-ghost:hover {
  color: var(--color-text);
}

.breadcrumb {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.25rem;
}

.btn-correct {
  background: none;
  border: 1px solid var(--color-correct);
  color: var(--color-correct);
  border-radius: var(--radius-sm);
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  transition:
    background-color 0.15s,
    color 0.15s;
}

.btn-correct:hover {
  background-color: var(--color-correct);
  color: #fff;
}

.btn-next {
  background-color: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.5rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background-color 0.15s;
}

.btn-next:hover {
  background-color: var(--color-accent-hover);
}

.all-correct {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 4rem 0;
  text-align: center;
}

.all-correct-msg {
  font-size: 1.1rem;
  color: var(--color-correct);
  font-weight: 600;
}
</style>
