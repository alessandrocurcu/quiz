<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  question: string
  options: string[]
  correctIndex: number
  selected: number | null
}>()

const emit = defineEmits<{ select: [index: number] }>()

function optionClass(index: number) {
  if (props.selected === null)
    return 'option'
  if (index === props.correctIndex)
    return 'option option--correct'
  if (index === props.selected)
    return 'option option--wrong'
  return 'option option--dimmed'
}

const isAnswered = computed(() => props.selected !== null)
</script>

<template>
  <div class="quiz-card">
    <p class="quiz-question">
      {{ question }}
    </p>
    <ul class="options">
      <li v-for="(option, i) in options" :key="i">
        <button
          :class="optionClass(i)"
          :disabled="isAnswered"
          @click="emit('select', i)"
        >
          <span class="option-number">{{ i + 1 }}</span>
          <span class="option-text">{{ option }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.quiz-card {
  background-color: var(--color-surface);
  border-radius: var(--radius);
  padding: 1.5rem 1.25rem;
}

.quiz-question {
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.5;
  margin-bottom: 1.25rem;
}

.options {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.option {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: var(--color-surface-2);
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  padding: 0.75rem 1rem;
  color: var(--color-text);
  text-align: left;
  transition:
    background-color 0.15s,
    border-color 0.15s;
}

.option:not(:disabled):hover {
  border-color: var(--color-accent);
}

.option--correct {
  border-color: var(--color-correct);
  background-color: rgba(34, 197, 94, 0.1);
}

.option--wrong {
  border-color: var(--color-error);
  background-color: rgba(239, 68, 68, 0.1);
}

.option--dimmed {
  opacity: 0.45;
}

.option-number {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.25rem;
  background-color: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.option-text {
  font-size: 0.9rem;
  line-height: 1.4;
}
</style>
