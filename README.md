# Iconography Guide

A web app for St. Katherine's Orthodox Church. Each saint depicted in the church's frescoes has a tappable NFC tag that opens a public page here with information about that saint.

The single admin account (credentials from env vars) can edit saint data: biographical info, feast days, content sections, and external links.

## Data model

- **saints** — name, birth date, repose date
- **feast_days** — text label + optional sort fields; many per saint
- **sections** — title + body content blocks; every edit creates a new revision (old row marked `is_current = 0`, new row inserted), so edits are auditable and undoable
- **links** — external links; soft-deleted via `deleted_at` timestamp

## Dev setup

```bash
npm install
cp .env.example .env   # then fill in real values
npm run db:migrate
npm run dev
```

Open http://localhost:5173. Admin is at `/admin/login`.

## Stack

| Concern | What |
|---|---|
| Server | Hono on Node.js |
| Templating | hono/jsx (SSR only — not React) |
| Dev server | Vite + @hono/vite-dev-server |
| CSS | Tailwind v4 (standalone CLI) |
| Interactivity | htmx (vendored) |
| Database | SQLite via better-sqlite3 |
| Migrations | dbmate |

## Database

Requires `dbmate` on PATH:

```bash
# Arch
sudo pacman -S dbmate
# Debian/Ubuntu
curl -fsSL -o /usr/local/bin/dbmate https://github.com/amacneil/dbmate/releases/latest/download/dbmate-linux-amd64
chmod +x /usr/local/bin/dbmate
```

```bash
npm run db:migrate    # run pending migrations
npm run db:rollback   # roll back last migration
npm run db:new <name> # scaffold a new migration file
```

## Deployment

Deployed via Docker. See `deploy/` for the nginx config.

```bash
# On the server
docker compose up -d --build
```

The container runs migrations automatically on startup. The SQLite database is stored in a named Docker volume (`db`).

Env vars are read from `/etc/iconography-guide.env` on the host. See `.env.example` for the required variables. Note that `DATABASE_URL` inside the container should be `sqlite:/app/db/app.db`.
