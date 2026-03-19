# Compliance OS

Applicazione Next.js + Prisma per gestire clienti, profilo aziendale, baseline ISO/IEC 27001:2022, SoA, risk register, documenti richiesti, upload file ed export DOCX/PDF.

## Funzioni incluse

- login con cookie HTTP-only
- utenti multi-tenant
- profilo cliente con rebuild automatico
- baseline controlli, rischi e documenti
- analisi euristica dei file testuali caricati
- export SoA / Risk Register / Document Set in DOCX e PDF
- seed iniziale con utenti demo e due aziende

## Stack

- Next.js App Router
- React 19
- TypeScript
- Prisma
- PostgreSQL
- docx
- pdfkit

## Requisiti

- Node.js 22+
- PostgreSQL attivo in locale o remoto

## Avvio rapido

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
npm run seed
npm run dev
```

Apri `http://localhost:3000`.

## Variabili ambiente

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/compliance_os?schema=public"
AUTH_SECRET="replace-with-a-long-random-secret"
```

## Utenti demo

- `admin / admin12345`
- `acme / acme12345`
- `beta / beta12345`

## Rotte principali

- `/login`
- `/dashboard`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/companies`
- `POST /api/companies/[companyId]/profile`
- `POST /api/companies/[companyId]/rebuild`
- `POST /api/companies/[companyId]/uploads`
- `POST /api/companies/[companyId]/analyze`
- `POST /api/companies/[companyId]/risks`
- `POST /api/companies/[companyId]/documents`
- `GET /api/companies/[companyId]/exports/soa?format=docx`
- `GET /api/companies/[companyId]/exports/soa?format=pdf`

## Struttura progetto

```text
app/
components/
lib/
prisma/
types/
```

## Note

- Il parsing automatico oggi legge direttamente file testuali, CSV, JSON e XML.
- Per PDF e DOCX la pipeline è predisposta ma il parser contenuti va ancora esteso.
- La dashboard usa un profilo di fallback vuoto quando un tenant non ha ancora un profilo salvato.

## Passi successivi consigliati

1. aggiungere parser reali per PDF e DOCX
2. introdurre audit log e versioning dei documenti
3. collegare controlli, evidenze e task a workflow approvativi
4. aggiungere test automatici su regole, rebuild ed export
