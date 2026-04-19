<script setup lang="ts">
import type { QuizQuestion } from '../types'
import { computed, shallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import QuizCard from '../components/QuizCard.vue'
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

interface ShuffledQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = a[i] as T
    a[i] = a[j] as T
    a[j] = temp
  }
  return a
}

function shuffleQuestion(q: QuizQuestion): ShuffledQuestion {
  const pairs = q.options.map((text, i) => ({ text, i }))
  const shuffled = shuffleArray(pairs)
  return {
    id: q.id,
    question: q.question,
    options: shuffled.map(p => p.text),
    correctIndex: shuffled.findIndex(p => p.i === q.correctIndex),
  }
}

const shuffled = shallowRef<ShuffledQuestion[]>(
  deck ? shuffleArray(deck.quiz).map(shuffleQuestion) : [],
)
const currentIndex = shallowRef(0)
const selected = shallowRef<number | null>(null)

const currentQuestion = computed(() => shuffled.value[currentIndex.value])

const { isCorrect, markCorrect } = useProgress(deck?.title ?? '')

function handleSelect(index: number) {
  if (selected.value !== null || !currentQuestion.value)
    return
  selected.value = index
  if (index === currentQuestion.value.correctIndex) {
    markCorrect(currentQuestion.value.id)
  }
}

function next() {
  currentIndex.value = (currentIndex.value + 1) % shuffled.value.length
  selected.value = null
}
</script>

<template>
  <div v-if="deck && currentQuestion" class="container">
    <div class="nav-top">
      <button class="btn-ghost" @click="router.push({ name: 'home' })">
        ← Home
      </button>
      <span class="breadcrumb">{{ currentIndex + 1 }} / {{ shuffled.length }}</span>
    </div>

    <QuizCard
      :key="currentQuestion.id + currentIndex"
      :question="currentQuestion.question"
      :options="currentQuestion.options"
      :correct-index="currentQuestion.correctIndex"
      :selected="selected"
      @select="handleSelect"
    />

    <div class="actions">
      <span v-if="selected !== null && isCorrect(currentQuestion.id)" class="feedback-correct">
        ✓ Corretto
      </span>
      <span v-else-if="selected !== null" class="feedback-wrong">
        ✗ Sbagliato
      </span>
      <button v-if="selected !== null" class="btn-next" @click="next">
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
  padding: 0.25rem 0;
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
  min-height: 2.25rem;
}

.feedback-correct {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-correct);
}

.feedback-wrong {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-error);
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
</style>
