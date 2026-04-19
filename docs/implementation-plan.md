# Implementation Plan: Study Deck

## Overview

SPA Vue 3 + Vite + TypeScript. L'utente carica JSON dal dispositivo, sceglie un deck dalla home, studia in modalità flashcard o quiz. Progresso salvato in `localStorage`. Deploy su Netlify come sito statico.

## Architecture Decisions

- **No Pinia** — stato gestito con un composable `useDeckStore` a livello modulo (reactive singleton). Evita una dipendenza extra per un caso d'uso semplice.
- **Routing per indice deck** — i deck sono in-memory, resettano al reload. Il param di rotta è l'indice nell'array (`/deck/0/flashcards`).
- **No UI library** — CSS custom con variabili, dark theme fedele agli screenshot.
- **`localStorage` key format** — `progress:{deckTitle}:{cardId}` → `"correct" | undefined`.

## Dependency Graph

```
src/types.ts  (Deck, Flashcard, QuizQuestion)
      │
      ├── src/composables/useDeckStore.ts  (deck list, upload)
      │         │
      │         ├── src/views/HomeView.vue
      │         ├── src/views/FlashcardView.vue
      │         └── src/views/QuizView.vue
      │
      └── src/composables/useProgress.ts  (localStorage r/w)
                │
                ├── src/views/FlashcardView.vue
                └── src/views/QuizView.vue
```

---

## Phase 1: Foundation

### Task 1 — Tipi TypeScript + store composable + router

**Description:** Definire i tipi del dominio, creare il composable `useDeckStore` (singleton reattivo che espone `decks`, `addDeck`), configurare le route.

**Acceptance criteria:**

- [x] `src/types.ts` esporta `Deck`, `Flashcard`, `QuizQuestion`
- [x] `useDeckStore` espone `decks: Ref<Deck[]>` e `addDeck(deck: Deck): void`
- [x] Router ha le route: `/`, `/deck/:index/flashcards`, `/deck/:index/quiz`
- [x] `pnpm type-check` non produce errori

**Verification:**

- [x] Build pulita: `pnpm build`
- [x] Nessun errore TypeScript

**Dependencies:** Nessuna

**Files touched:**

- `src/types.ts` _(nuovo)_
- `src/composables/useDeckStore.ts` _(nuovo)_
- `src/router/index.ts`

**Estimated scope:** S

---

### Task 2 — CSS globale + layout base

**Description:** Impostare CSS variables per dark theme, reset di base, font, layout mobile-first. `App.vue` diventa un semplice `<RouterView />` con wrapper.

**Acceptance criteria:**

- [x] `--color-bg`, `--color-surface`, `--color-text`, `--color-accent` definite come CSS vars
- [x] Dark background visibile all'apertura dell'app
- [x] Layout responsive (max-width centrato, padding mobile)
- [x] Font sans-serif leggibile

**Verification:**

- [x] Visivo: apri `localhost:5173`, sfondo dark presente

**Dependencies:** Nessuna (parallela a Task 1)

**Files touched:**

- `src/App.vue`
- `src/assets/main.css` _(nuovo)_

**Estimated scope:** S

---

### Checkpoint: Foundation

- [x] `pnpm build` pulita
- [x] App apre su `localhost:5173` con sfondo dark

---

## Phase 2: Core Features

### Task 3 — HomeView: upload JSON + lista deck

**Description:** Schermata home con bottone "Carica JSON" (input file, accept `.json`, multiplo). Per ogni deck caricato mostra una card con titolo, numero flashcard, numero quiz, e bottoni "Flashcard" / "Quiz".

**Acceptance criteria:**

- [x] Click su "Carica JSON" apre il file picker (anche da mobile)
- [x] Si possono selezionare più file in una volta
- [x] Ogni file valido aggiunge una voce alla lista
- [x] File JSON malformato mostra un messaggio di errore inline (non crash)
- [x] Bottoni "Flashcard" e "Quiz" navigano alle route corrette
- [x] Se nessun deck caricato, mostra empty state ("Carica un file JSON per iniziare")

**Verification:**

- [x] Upload di un JSON valido → deck appare in lista
- [x] Upload di JSON invalido → errore visibile, app non crasha
- [x] Click "Flashcard" → naviga a `/deck/0/flashcards`

**Dependencies:** Task 1, Task 2

**Files touched:**

- `src/views/HomeView.vue` _(nuovo)_
- `src/composables/useDeckStore.ts` (eventuale aggiustamento)
- `src/router/index.ts` (aggiunta componente alla route `/`)

**Estimated scope:** M

---

### Task 4 — FlashcardView: flip card + segna corretto

**Description:** Visualizza flashcard in ordine casuale. Front: domanda. Back (dopo click/tap): risposta. Pulsante ✓ "Segna come corretto" salva in localStorage. Pulsante "→ Prossima". Breadcrumb "N / Tot". Pulsante "← Torna alla home".

**Acceptance criteria:**

- [x] Carta mostra la domanda di default
- [x] Click sulla carta (o su un bottone "Mostra risposta") rivela la risposta
- [x] "Segna come corretto" salva `progress:{title}:{id} = "correct"` in localStorage
- [x] Carte già corrette mostrano un indicatore visivo (es. bordo verde)
- [x] Ordine casuale ad ogni sessione
- [x] Breadcrumb "3 / 12" aggiornato
- [x] Navigazione a indice inesistente → redirect `/`

**Verification:**

- [x] Flip funziona su mobile (touch)
- [x] localStorage contiene la chiave dopo aver segnato corretto
- [x] Ricaricare la pagina → progresso corretto letto da localStorage

**Dependencies:** Task 1, Task 2, Task 3

**Files touched:**

- `src/views/FlashcardView.vue` _(nuovo)_
- `src/composables/useProgress.ts` _(nuovo)_

**Estimated scope:** M

---

### Task 5 — QuizView: scelta multipla + feedback

**Description:** Visualizza domande quiz in ordine casuale. 4 opzioni cliccabili. Dopo la selezione: feedback immediato (verde = corretto, rosso = sbagliato + evidenzia quello giusto). Pulsante "→ Prossima". Breadcrumb "N / Tot". Risposta corretta salvata in localStorage (come flashcard).

**Acceptance criteria:**

- [x] 4 opzioni visibili per ogni domanda
- [x] Click su opzione → feedback immediato, nessun'altra opzione cliccabile
- [x] Risposta corretta evidenziata in verde
- [x] Risposta sbagliata evidenziata in rosso + mostra quella corretta
- [x] Risposta corretta salva in localStorage
- [x] Ordine domande casuale, ordine opzioni casuale
- [x] Navigazione a indice inesistente → redirect `/`

**Verification:**

- [x] Risposta corretta → localStorage aggiornato
- [x] Risposta sbagliata → localStorage non aggiornato
- [x] Visivo coerente con screenshot allegati

**Dependencies:** Task 1, Task 2, Task 3, Task 4 (riusa `useProgress`)

**Files touched:**

- `src/views/QuizView.vue` _(nuovo)_
- `src/composables/useProgress.ts` (eventuale aggiustamento)

**Estimated scope:** M

---

### Checkpoint: Core Features

- [x] Upload JSON → selezione deck → flashcard funzionanti end-to-end
- [x] Upload JSON → selezione deck → quiz funzionante end-to-end
- [x] Progresso persistito in localStorage verificato con DevTools

---

## Phase 3: Polish + Deploy

### Task 6 — Modalità "Ripassa errori"

**Description:** Aggiungere alla HomeView un terzo bottone per deck "Ripassa errori" (flashcard). Filtra solo le card il cui ID non è marcato corretto in localStorage. Se tutte corrette, mostra messaggio "Hai risposto correttamente a tutte le carte!".

**Acceptance criteria:**

- [x] Bottone "Ripassa errori" visibile su ogni deck in HomeView
- [x] Naviga a `/deck/:index/flashcards?mode=errors`
- [x] FlashcardView con `?mode=errors` mostra solo le card non corrette
- [x] Se zero card da ripassare → messaggio dedicato + bottone "Torna alla home"

**Verification:**

- [x] Segna 3 card su 5 come corrette → "Ripassa errori" mostra 2 card
- [x] Segna tutte → messaggio "Hai risposto correttamente a tutte"

**Dependencies:** Task 3, Task 4

**Files touched:**

- `src/views/HomeView.vue`
- `src/views/FlashcardView.vue`

**Estimated scope:** S

---

### Task 7 — Netlify config + esempio JSON

**Description:** Aggiungere `netlify.toml` per redirect SPA (tutte le route → `index.html`). Aggiungere un file JSON di esempio in `public/example-deck.json` così l'utente può scaricarlo e capire il formato.

**Acceptance criteria:**

- [x] `netlify.toml` contiene redirect `/* → /index.html 200`
- [x] `public/example-deck.json` ha almeno 3 flashcard e 3 domande quiz valide
- [x] `pnpm build` produce `dist/` deployabile

**Verification:**

- [x] `pnpm preview` + navigazione diretta a `/deck/0/flashcards` non dà 404
- [x] `dist/example-deck.json` presente dopo build

**Dependencies:** Task 5

**Files touched:**

- `netlify.toml` _(nuovo)_
- `public/example-deck.json` _(nuovo)_

**Estimated scope:** XS

---

### Checkpoint: Complete

- [x] Flusso completo testato da mobile (upload → flashcard → quiz → ripassa errori)
- [x] `pnpm build` pulita, nessun errore TypeScript
- [x] Pronto per deploy su Netlify

---

## Risks and Mitigations

| Risk                                                | Impact | Mitigation                                                                                      |
| --------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------- |
| FileReader non disponibile su vecchi browser mobile | Med    | API supportata da Safari 13.1+, Chrome 76+ — accettabile                                        |
| JSON malformato crasha l'app                        | Med    | try/catch nel parser, errore inline in HomeView                                                 |
| localStorage pieno (> 5MB)                          | Low    | Chiavi leggere (`correct` string), improbabile                                                  |
| Indice deck come param di rotta è fragile al reload | Med    | Reload resetta i deck (comportamento atteso e documentato) — redirect a `/` se deck non trovato |

## Open Questions

- Nessuna — tutte le decisioni chiave sono state prese.
