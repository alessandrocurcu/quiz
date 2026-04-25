<script setup lang="ts">
defineProps<{
  question: string
  answer: string
  isCorrect: boolean
  isFlipped: boolean
}>()

defineEmits<{ flip: [] }>()
</script>

<template>
  <div
    class="card-wrapper"
    :class="{ 'card-wrapper--correct': isCorrect }"
    role="button"
    tabindex="0"
    :aria-label="isFlipped ? 'Mostra domanda' : 'Mostra risposta'"
    @click="$emit('flip')"
    @keydown.enter.prevent="$emit('flip')"
    @keydown.space.prevent="$emit('flip')"
  >
    <div class="card-inner" :class="{ 'card-inner--flipped': isFlipped }">
      <div class="card-face card-front">
        <p class="card-question">
          {{ question }}
        </p>
        <span class="card-hint">↺ Clicca o tocca per rivelare la risposta</span>
      </div>
      <div class="card-face card-back">
        <p class="card-answer">
          {{ answer }}
        </p>
        <span class="card-hint">↺ Clicca o tocca per vedere la domanda</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-wrapper {
  perspective: 1200px;
  cursor: pointer;
  border-radius: var(--radius);
  transition: box-shadow 0.2s;
  outline: none;
}

.card-wrapper:focus-visible {
  box-shadow: 0 0 0 2px var(--color-accent);
}

.card-wrapper--correct {
  box-shadow: 0 0 0 2px var(--color-correct);
}

.card-inner {
  position: relative;
  height: 260px;
  transform-style: preserve-3d;
  transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-inner--flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  background-color: var(--color-surface);
  border-radius: var(--radius);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  overflow: hidden;
}

.card-back {
  transform: rotateY(180deg);
}

.card-question {
  font-size: 1.1rem;
  text-align: center;
  line-height: 1.5;
  position: relative;
}

.card-answer {
  font-size: 1rem;
  text-align: center;
  line-height: 1.6;
  color: var(--color-text);
}

.card-hint {
  position: absolute;
  bottom: 1rem;
  font-size: 0.8rem;
  color: var(--color-text-muted);
}
</style>
