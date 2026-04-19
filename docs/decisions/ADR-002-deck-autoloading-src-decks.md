# ADR-002: Auto-caricamento deck da src/decks/ via import.meta.glob

## Status

Accepted

## Date

2026-04-19

## Context

L'app doveva caricare automaticamente i deck JSON presenti in una cartella locale,
senza richiedere all'utente di caricarli manualmente ogni volta che avvia il dev server.

Il piano originale prevedeva solo il caricamento manuale via file picker (Task 3).
La funzionalità di auto-loading è stata aggiunta come estensione durante lo sviluppo.

## Decision

I deck auto-caricati vanno in `src/decks/*.json`.
`App.vue` usa `import.meta.glob('./decks/*.json', { eager: true })` per importarli
tutti a build time e aggiungerli allo store al montaggio dell'app.

## Alternatives Considered

### File in public/ con manifest JSON

- Pro: i file in `public/` sono serviti as-is, non richiedono rebuild per essere aggiunti
- Contro: il browser non può listare il contenuto di una directory; serve un file
  `public/manifest.json` da aggiornare manualmente ogni volta che si aggiunge un deck
- Rifiutato: il manifest è un indirection extra che si dimentica facilmente di aggiornare

### Fetch runtime da public/ con lista hardcodata

- Pro: nessun rebuild necessario
- Contro: i filename sono hardcodati nel sorgente, non è auto-discovery reale
- Rifiutato: peggio del manifest, non scala

### import.meta.glob da src/decks/ (scelta adottata)

- Pro: zero configurazione — basta copiare un JSON in src/decks/ e il dev server
  lo rileva in tempo reale (HMR); il build lo include automaticamente
- Contro: aggiungere un deck richiede accesso al sorgente (non adatto a utenti non tecnici
  che vogliano distribuire deck post-deploy)
- Accettato: il target sono utenti che lavorano in locale con il dev server

## Consequences

- **Per aggiungere un deck auto-caricato**: copiare il file JSON in `src/decks/`
  e ricaricare la pagina (dev) o fare un nuovo build (produzione)
- `public/example-deck.json` esiste separatamente come file scaricabile di esempio
  per mostrare il formato atteso — non viene auto-caricato
- I deck in `src/decks/` vengono **bundlati** nel build di produzione: aumentano la
  dimensione del bundle in proporzione al contenuto dei JSON
- Se in futuro si vuole un'app distribuibile (utenti che caricano deck propri su un
  deploy fisso), il meccanismo va cambiato — il caricamento manuale via file picker
  (già implementato in HomeView) rimane la soluzione corretta per quel caso d'uso
