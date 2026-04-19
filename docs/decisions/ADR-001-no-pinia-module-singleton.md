# ADR-001: Store senza Pinia — singleton a livello modulo

## Status
Accepted

## Date
2026-04-19

## Context
L'app ha un unico stato globale: la lista dei deck caricati in memoria (`Deck[]`).
Serviva un modo per condividere questo stato tra `HomeView`, `FlashcardView` e `QuizView`.

Le opzioni standard sono Pinia (store ufficiale Vue 3) o un composable reattivo condiviso.

## Decision
Stato gestito con un `ref<Deck[]>` dichiarato **a livello modulo** in `src/composables/useDeckStore.ts`.
Il composable `useDeckStore()` espone `decks` e `addDeck` — tutti i componenti che lo importano
condividono la stessa istanza reattiva (singleton per via del modulo ES).

## Alternatives Considered

### Pinia
- Pro: devtools integration, SSR-friendly, pattern consolidato
- Contro: dipendenza extra, boilerplate (defineStore, actions, getters) sproporzionato
  per un singolo array con una sola operazione di scrittura
- Rifiutato: over-engineering per questo caso d'uso

### provide/inject a livello di App.vue
- Pro: esplicito, segue il modello Vue
- Contro: più verboso, richiede injection key tipizzata e accesso al contesto app
- Rifiutato: il singleton a modulo è più semplice e altrettanto corretto per una SPA senza SSR

## Consequences
- Nessuna dipendenza aggiuntiva
- I deck **resettano al reload** della pagina (comportamento atteso e documentato):
  i deck in-memory non persistono, solo il progresso in localStorage persiste
- Se in futuro si aggiunge SSR, questo pattern non funziona — serve Pinia o provide/inject
- `readonly()` su `decks` è stato **rimosso** perché `DeepReadonly<Ref<Deck[]>>` non è
  assegnabile a `Deck[]` nelle prop dei componenti figli, generando errori TypeScript
  senza benefici pratici in un'app monoutente
