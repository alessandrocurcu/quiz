- **Serialization** is the process of **converting an in-memory object into a format that can be stored or transmitted** — usually a **string**
- **Deserialization** is the process of taking that serialized string and **turning it back into an object** in memory.

---

- Un databse driver È una libreria che fa da **traduttore** tra il tuo codice applicativo e il protocollo wire del database
  - Quando scrivi: `const result = await pool.query('SELECT * FROM companies')`, non stai parlando direttamente a PostgreSQL. Stai chiamando il driver (`pg` / `postgres.js`), che:
    - serializza la query nel **protocollo binario di PostgreSQL**
    - apre/gestisce la connessione TCP
    - deserializza la risposta in oggetti JavaScript

---

- An environment variable is a value that is set from outside the program. _The purpose of environment variables is to be able to change your program functionality without having to rebuild and/or redeploy the program_
  - In production, you typically don't use `.env` files at all. Instead, you set environment variables directly in your hosting platform
- Common uses of environment variables
  - Feature toggles
  - Setting environment-specific values
  - Storing secrets
