# Deployment

The app runs in Docker, proxied by nginx with a Let's Encrypt certificate.

## Prerequisites

On the server:
- Docker + Docker Compose
- nginx
- certbot (`sudo apt install certbot python3-certbot-nginx`)
- The subdomain pointed at the server's IP in DNS (required before certbot will work)

## First-time setup

### 1. Clone the repo

```bash
git clone <repo-url> /opt/iconography-guide
cd /opt/iconography-guide
```

### 2. Create the env file

```bash
sudo cp .env.example /etc/iconography-guide.env
sudo chmod 600 /etc/iconography-guide.env
sudo chown root:root /etc/iconography-guide.env
sudo nano /etc/iconography-guide.env
```

Fill in real values. The `DATABASE_URL` must point to the in-container path:

```
DATABASE_URL=sqlite:/app/db/app.db
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<strong password>
SESSION_SECRET=<output of: openssl rand -hex 32>
PORT=3001
```

### 3. Start the app

```bash
docker compose up -d --build
docker compose logs -f   # watch for errors
```

The container runs database migrations automatically on startup.

### 4. Configure nginx

```bash
sudo cp deploy/nginx-site.conf /etc/nginx/sites-available/iconography-guide
sudo ln -s /etc/nginx/sites-available/iconography-guide /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 5. Get a TLS certificate

```bash
sudo certbot --nginx -d icons.lnrssll.com
```

Certbot updates the nginx config with cert paths automatically and installs a renewal cron job.

## Redeploying

```bash
cd /opt/iconography-guide
git pull
docker compose up -d --build
```

Migrations run automatically on startup, so schema changes are applied as part of the normal redeploy.

## Useful commands

```bash
docker compose logs -f            # follow logs
docker compose ps                 # container status
docker compose down               # stop everything
docker compose exec app sh        # shell inside the running container
```

## Backing up the database

The SQLite database lives in a Docker named volume (`db`) and persists across restarts and rebuilds.

```bash
docker compose exec app sh -c 'sqlite3 /app/db/app.db ".backup /app/db/backup.db"'
docker cp $(docker compose ps -q app):/app/db/backup.db ./backup.db
```
