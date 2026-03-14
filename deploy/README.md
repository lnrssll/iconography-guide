# Deployment

Assumes Ubuntu/Debian on a DigitalOcean droplet with nginx and Node.js installed.

## First-time setup

### 1. Create a dedicated user and app directory

```bash
sudo useradd --system --shell /usr/sbin/nologin --create-home --home-dir /opt/iconography-guide iconography
```

### 2. Copy the env file

```bash
sudo cp /path/to/your/.env /etc/iconography-guide.env
sudo chmod 600 /etc/iconography-guide.env
sudo chown root:root /etc/iconography-guide.env
```

Contents should look like:

```
DATABASE_URL=sqlite:/opt/iconography-guide/db/app.db
ADMIN_USERNAME=admin
ADMIN_PASSWORD=changeme
SESSION_SECRET=a-long-random-string
PORT=3000
```

### 3. Deploy the app

```bash
# From your local machine, or run on the server after cloning
npm ci --omit=dev
npm run build
sudo rsync -a --delete dist/ public/ /opt/iconography-guide/
sudo chown -R iconography:iconography /opt/iconography-guide
```

Or just clone the repo to `/opt/iconography-guide` and build there.

### 4. Run database migrations

```bash
sudo -u iconography bash -c 'cd /opt/iconography-guide && DATABASE_URL=sqlite:./db/app.db npx dbmate up'
```

### 5. Install and start the systemd service

```bash
sudo cp deploy/iconography-guide.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now iconography-guide
sudo systemctl status iconography-guide
```

### 6. Configure nginx

```bash
sudo cp deploy/nginx-site.conf /etc/nginx/sites-available/iconography-guide
# Edit the file and replace 'your.domain.com' with your actual domain
sudo ln -s /etc/nginx/sites-available/iconography-guide /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 7. Get a TLS certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your.domain.com
```

Certbot will update the nginx config with the cert paths automatically.

## Redeploying

```bash
npm run build
sudo rsync -a --delete dist/ public/ /opt/iconography-guide/
sudo systemctl restart iconography-guide
```
