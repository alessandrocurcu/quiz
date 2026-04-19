export interface Flashcard {
  id: string
  question: string
  answer: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
}

export interface Deck {
  title: string
  flashcards: Flashcard[]
  quiz: QuizQuestion[]
}
