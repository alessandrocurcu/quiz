---
name: study-deck-generator
description: Generate a JSON study deck (flashcards + quiz) from a markdown source text. Use whenever the user asks to create flashcards, quiz cards, study cards, learning materials, "deck di studio", "carte di studio", "materiale di ripasso", or any spaced-repetition / Anki-style content from a .md file, blog post, book chapter, article, or technical document. Trigger even if the user just pastes a long text and asks "fammi delle flashcard" or "genera un quiz su questo" without explicitly using the word "deck". The deliverable is always a single JSON file with `flashcards` and `quiz` arrays in the schema defined below.
---

# Study Deck Generator

Trasforma un testo (tipicamente un capitolo di libro, un articolo, una nota tecnica in markdown) in un deck JSON che contiene flashcard e quiz pronti per essere usati in un sistema di ripasso.

L'output è SEMPRE un singolo file JSON con questa forma esatta — non un report, non testo discorsivo, non bullet point in chat.

## Schema di output (autoritativo)

Salva il file in `src/decks/<topic-slug>-deck.json`, dove `<topic-slug>` è una versione kebab-case del titolo (es. `async-patterns-deck.json`, `tdd-fundamentals-deck.json`)

```json
{
  "title": "Titolo del deck (sintetico, descrittivo)",
  "flashcards": [
    {
      "id": "f1",
      "question": "...",
      "answer": "..."
    }
  ],
  "quiz": [
    {
      "id": "q1",
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "correctIndex": 0
    }
  ]
}
```

Vincoli rigidi:
- Gli `id` sono `f1, f2, ..., fN` per le flashcard e `q1, q2, ..., qN` per i quiz, in ordine progressivo
- Ogni quiz ha esattamente 4 `options`
- `correctIndex` è un intero 0-3 e indica l'indice nell'array `options`
- Nessuna chiave aggiuntiva oltre a quelle dello schema
- Lingua dell'output = lingua del testo sorgente (italiano se il sorgente è italiano)

## Densità e copertura

La dimensione del deck deve essere proporzionale alla densità concettuale del testo, non alla sua lunghezza in parole. Un articolo di 800 parole con un singolo concetto chiaro genera ~5-7 flashcard; un capitolo di libro che introduce 4-5 concetti distinti ne genera 15-20. Linee guida:

- **Testo monotematico breve** (un singolo pattern, una singola tecnica): 5-8 flashcard, 5-6 quiz
- **Testo a media densità** (un argomento con più sfaccettature, es. un articolo tecnico approfondito): 10-14 flashcard, 8-10 quiz
- **Testo denso o multi-tema** (un capitolo di libro, un long-form che copre 4+ concetti interconnessi): 15-20 flashcard, 10-13 quiz

Regola pratica: una flashcard per ogni "idea distinta" identificabile nel testo. Se due idee sono varianti della stessa cosa, accorpale; se un'idea ha sotto-aspetti significativi (es. "regola X" + "trappola tipica nell'applicare X"), spesso meritano flashcard separate.

## Come scrivere una buona flashcard

Una flashcard non è una sintesi: è una specifica eseguibile per la memoria. La domanda definisce il concetto, la risposta lo spiega in modo autosufficiente.

### La domanda

- Apre un concetto, non un dettaglio isolato. Preferisci "Cos'è X?", "Perché X funziona?", "Qual è la differenza tra X e Y?", "Quando si usa X?" rispetto a "Qual è il valore di default del parametro X?".
- Deve essere comprensibile senza il contesto del testo originale. Se la domanda usa termini ad hoc del testo che il lettore potrebbe non ricordare, riformulala.
- Una sola idea per flashcard. Domande del tipo "Cos'è X e come si usa e quali sono i suoi limiti?" vanno divise.

### La risposta

- Self-contained: chi legge la risposta deve capirla anche senza ricordare la domanda alla lettera.
- Multi-frase, tipicamente 2-5 frasi. Una risposta di una sola frase quasi sempre è troppo povera; una risposta che supera 6-7 frasi probabilmente contiene più di un concetto e va spezzata.
- Include il "perché", non solo il "cosa". Una risposta che spiega solo *cosa* è una cosa, senza dire *perché* esiste o *quando* si usa, è memorizzazione meccanica. La cosa interessante è il modello mentale.
- Conserva i termini tecnici del sorgente (es. "backpressure", "fail-fast", "behavioral boundary"). Se sono il vocabolario del dominio, vanno trasmessi così come sono.

### Anti-pattern da evitare

- **Domanda banale**: "Cosa fa readFile()?" → "Legge un file." Non aggiunge nulla rispetto alla documentazione, e non c'è niente da capire.
- **Risposta che è solo parafrasi del testo**: una buona risposta riformula il concetto con parole proprie, non copia frasi del sorgente.
- **Risposta enciclopedica**: lunghi elenchi senza una struttura narrativa sono difficili da memorizzare. Meglio una spiegazione causale ("X funziona così perché Y, e questo implica Z").

## Come scrivere un buon quiz

Il quiz testa la comprensione applicata, non il riconoscimento di frasi del testo.

### Tipologie di domande (idealmente mescolare)

1. **Recognition**: "Cosa significa X?" con 4 definizioni di cui una corretta. Utile per fissare la terminologia, ma da non abusare.
2. **Decisional / scenario-based**: "Hai N file di config da caricare. Quale approccio è corretto?" con 4 strategie diverse. Sono le più formative perché simulano una vera decisione di sviluppo.
3. **Code-reading / interpretation**: si mostra uno snippet di codice o di configurazione e si chiede cosa fa, o dove sta il bug. Particolarmente potenti per concetti che hanno un "ordine corretto" (es. ordine delle condizioni in `exports`, ordine delle fasi red/green/refactor).
4. **Diagnostic**: "Il test X fallisce ma Y passa. Dove guardi?" — testa la capacità di leggere segnali e localizzare problemi.

Punta ad almeno 2 tipologie per deck, evita che siano tutte recognition.

### Le opzioni (distrattori)

I distrattori sono la parte più importante del quiz. Un quiz facile ha distrattori ovviamente sbagliati; un quiz formativo ha distrattori plausibili che corrispondono a misconception reali.

Strategie per costruirli:
- **Trappola del principiante**: una risposta che sembra ragionevole se non si conosce la sfumatura chiave (es. per i feature flag booleani da env: `Boolean(process.env.FEATURE_X)` sembra corretto ma è bacato perché `Boolean("false") === true`).
- **Risposta parziale**: corretta a metà, sbagliata sul punto chiave. Costringe il lettore a verificare ogni clausola.
- **Tecnologia adiacente confusa**: cita uno strumento o concetto simile ma non equivalente (es. confondere `Promise.all` e `Promise.allSettled`).
- **Risposta troppo generica**: dice qualcosa di vero ma non risponde alla domanda specifica.

Evita distrattori ovviamente assurdi tipo "TypeScript non supporta i test" — sprecano un'opzione e rendono il quiz banale.

### Vincolo di mutua esclusività

Le 4 opzioni devono essere chiaramente alternative, non combinabili. Non scrivere mai opzioni come "A) Usa Promise.all  B) Promise.all è veloce  C) Promise.all gestisce gli errori" dove A è procedurale e B/C sono affermazioni: il lettore non sa cosa sta scegliendo.

## Ordine delle card

L'ordine delle flashcard dovrebbe rispecchiare la progressione concettuale del testo sorgente: prima i fondamenti (cosa, perché esiste), poi i meccanismi operativi (come si usa), infine le sfumature avanzate (trappole, anti-pattern, diagnostica). Questo aiuta il ripasso sequenziale, in cui ogni card poggia su quelle precedenti.

L'ordine dei quiz è meno vincolato, ma per leggibilità tendi a mettere le domande di recognition all'inizio e quelle decisional/diagnostic verso la fine, in modo che la difficoltà cresca.

## Workflow operativo

1. **Leggi il testo sorgente per intero** prima di iniziare. Identifica la spina dorsale concettuale: quali sono le 3-7 idee chiave attorno a cui ruota il testo? Sono il riferimento per la copertura.
2. **Stima la densità target**: applica le linee guida sopra. Annota mentalmente il numero approssimativo di flashcard e quiz prima di scrivere.
3. **Scrivi le flashcard nell'ordine narrativo del testo**: dalla concetto fondamentale ai dettagli avanzati. Per ogni idea chiave identificata al passo 1, una o più flashcard.
4. **Scrivi i quiz mescolando le tipologie**: punta ad avere almeno 1 domanda decisional/scenario per ogni 3-4 di recognition.
5. **Verifica i vincoli dello schema**: id progressivi, 4 opzioni per quiz, correctIndex tra 0 e 3, nessuna chiave extra.
6. **Salva il file** in `src/decks/<topic-slug>-deck.json`
7. **Chiudi con una nota sintetica** che spiega le scelte non ovvie: copertura adottata, eventuali sotto-temi accorpati, eventuali domande "trabocchetto" inserite e perché. Massimo 3-4 paragrafi, niente preamboli.

## Esempio di flashcard ben fatta

**Sorgente** (frammento): "Il backpressure si verifica quando uno stream produce dati più velocemente di quanto il consumer riesca a processarli. writeStream.write() ritorna false quando il buffer interno è pieno..."

**Flashcard generata bene**:
```json
{
  "id": "f12",
  "question": "Cos'è il backpressure in uno stream e come si gestisce manualmente?",
  "answer": "Si verifica quando produci dati più velocemente di quanto lo stream di destinazione riesca a scriverli. writeStream.write() ritorna false quando il buffer interno è pieno; a quel punto devi aspettare l'evento 'drain' prima di continuare a scrivere (await once(writeStream, 'drain')). Ignorarlo porta a crescita incontrollata di memoria."
}
```

Cosa la rende buona: la domanda apre un concetto autonomo, la risposta spiega *cosa* è il fenomeno, *come* si manifesta a livello di API (`write()` ritorna `false`), *come* si gestisce (attesa di `drain`), e *perché* va gestito (memory leak). Quattro frasi, ogni frase guadagna il suo posto.

## Esempio di quiz ben fatto

```json
{
  "id": "q9",
  "question": "Come si legge un feature flag booleano da una env variable in modo robusto?",
  "options": [
    "Boolean(process.env.FEATURE_X)",
    "process.env.FEATURE_X === 'true'",
    "!!process.env.FEATURE_X",
    "process.env.FEATURE_X == true"
  ],
  "correctIndex": 1
}
```

Cosa lo rende buono: tre distrattori plausibili, ognuno corrispondente a una misconception reale. `Boolean(...)` e `!!` sembrano idiomatici JS ma sono entrambi bacati con la stringa `"false"`. `== true` con coercion è semantica diversa. Solo `=== 'true'` è la lettura tipologicamente corretta. Chi non ha mai pensato al fatto che le env sono sempre stringhe sbaglia con altissima probabilità.

## Comunicazione finale all'utente

Dopo aver presentato il file, scrivi una nota sintetica con queste informazioni:
- Numero di flashcard e quiz generati
- Logica di copertura (quali macro-temi sono stati coperti, quali eventualmente accorpati o omessi e perché)
- Eventuali scelte non ovvie nelle domande (es. una domanda trabocchetto con tutti distrattori plausibili, una scelta editoriale tra due interpretazioni del testo)
- Offerta di iterare: taglio diverso (più pratico, più teorico, più focalizzato su un sottoinsieme), più o meno densità, aggiunta di domande code-reading

Non aggiungere preamboli tipo "Ecco il deck!" o post-amboli generici tipo "Spero ti sia utile!". Il file è il deliverable, il commento finale aggiunge valore informativo o si tace.