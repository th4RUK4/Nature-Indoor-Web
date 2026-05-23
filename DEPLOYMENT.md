# Nature Indoor Backend

This project now runs as a small Node app with no external dependencies.

## Local Run

```bash
npm start
```

Open `http://localhost:3000`.

## Endpoints

- `GET /api/health` returns a simple health check.
- `POST /api/contact` accepts contact form messages.

Contact submissions are stored locally in:

```text
data/contact-submissions.jsonl
```

## Deploy

Use any Node hosting provider that supports `npm start`, such as Render, Railway, Fly.io, Azure App Service, or a VPS.

Recommended settings:

- Build command: none
- Start command: `npm start`
- Node version: `18` or newer

The server reads the hosting platform's `PORT` environment variable automatically.
