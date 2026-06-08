# Study Deck

SPA Vue 3 per lo studio personale tramite flashcard e quiz. Nessun backend, nessun account — funziona interamente nel browser.

## Funzionalità

- **Carica un deck** — seleziona uno o più file JSON dal dispositivo
- **Flashcard** — flip card in ordine casuale, segna le carte corrette
- **Quiz** — scelta multipla con feedback immediato, ordine casuale
- **Ripassa errori** — filtra solo le card non ancora corrette
- Il progresso è salvato in `localStorage` e persiste tra sessioni

## Formato JSON

```json
{
  "title": "Nome del deck",
  "flashcards": [
    { "id": "fc-1", "question": "...", "answer": "..." }
  ],
  "quiz": [
    {
      "id": "q-1",
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 1
    }
  ]
}
```

Un file di esempio scaricabile è disponibile in `public/example-deck.json`.

## Generare un deck con Claude Code

Con Claude Code attivo nella repo, puoi generare un deck da qualsiasi testo (articolo, capitolo, nota tecnica):

```
/study-deck-generator
```

Incolla o indica il testo sorgente e la skill produce direttamente il file JSON in `src/decks/`, pronto da usare.

## Deck pre-caricati (sviluppo)

Copia un file JSON in `src/decks/` — il dev server lo rileva automaticamente via `import.meta.glob`.

## Setup

```sh
pnpm install
pnpm dev        # dev server su localhost:5173
pnpm build      # build di produzione
pnpm type-check # controllo TypeScript
pnpm lint:fix   # lint + autofix
```

## Deploy

Configurato per Netlify (`netlify.toml`). Tutte le route reindirizzano a `index.html`.
