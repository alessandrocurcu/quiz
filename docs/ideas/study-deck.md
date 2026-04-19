# Study Deck

## Problem Statement
Come creare un tool di studio personale — accessibile da mobile, senza backend — che presenti flashcard e quiz da file JSON con tracking degli errori?

## Recommended Direction

SPA Vue 3 deployata su Netlify. L'utente carica uno o più JSON dal dispositivo; l'app li lista e permette di scegliere quale deck studiare. Le sessioni sono di due tipi: **flashcard** (flip card dark-themed) e **quiz** (scelta multipla). Il progresso (carte marcate "corrette") è salvato in `localStorage` per chiave `deck.title + card.id`.

I deck si resettano ad ogni riapertura dell'app (no persistenza IndexedDB) — scelta deliberata per semplicità.

## JSON Format

```json
{
  "title": "Frontend Architecture",
  "flashcards": [
    { "id": "fc-1", "question": "...", "answer": "..." }
  ],
  "quiz": [
    {
      "id": "q-1",
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correct": 1
    }
  ]
}
```

## Key Assumptions
- `localStorage` è sufficiente per il tracking — non serve sync tra dispositivi
- FileReader API funziona da mobile Safari/Chrome
- Un deck per file è granularità giusta

## MVP Scope

**In:**
- Schermata home: lista deck caricati + bottone upload JSON
- Modalità flashcard: ordine casuale, flip, "segna come corretto" ✓
- Modalità quiz: 4 opzioni, feedback immediato, ordine casuale
- Modalità "ripassa errori": filtra solo le card non marcate corrette
- Persistenza progresso via localStorage (reset al reload dell'app)

**Not Doing:**
- Spatial repetition — future
- Editor JSON in-app
- Account / sync cloud
- Statistiche avanzate
- UI library — CSS custom fedele agli screenshot
- Backend
