# Docker Deployment Guide - Intermost Study Abroad

Complete guide for deploying the Intermost platform locally and in production using Docker and Docker Compose under a single domain configuration (`intermost.in`).

## 📋 Table of Contents
- [Quick Start](#quick-start)
- [Development Setup](#development-setup)
- [Production Deployment](#production-deployment)
- [Docker Commands](#docker-commands)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed.
- [Docker Compose](https://docs.docker.com/compose/install/) v2.0+.
- 4GB RAM minimum, 2 CPU cores.

### One Command Deploy (Development)
```bash
# 1. Clone repository
git clone https://github.com/Tejaso7/Intermost-Main.git intermost
cd intermost

# 2. Create environment file
cp .env.example .env

# 3. Start services
docker compose up -d

# 4. Access applications
# Frontend: http://localhost (Port 80)
# API: http://localhost:8000
# Docs: http://localhost:8000/api/docs/
# Nginx Admin Router: http://api.localhost
```

---

## 💻 Development Setup

### Step 1: Environment Configuration
```bash
# Copy environment template
cp .env.example .env
```

Default development `.env` variables:
```env
DEBUG=True
SECRET_KEY=dev-secret-key-change-in-production
MONGODB_URI=mongodb://admin:password@mongodb:27017/intermost_db?authSource=admin
MONGODB_NAME=intermost_db
GEMINI_API_KEY=your-dev-key
CORS_ALLOWED_ORIGINS=http://localhost,http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Step 2: Build and Start
```bash
# Build and launch containers
docker compose up -d --build

# View real-time logs
docker compose logs -f
```

### Step 3: Initialize Database
```bash
# Run migrations (Django auth & session tables)
docker compose exec backend python manage.py migrate

# Create administrator credentials
docker compose exec backend python manage.py createsuperuser

# Seed default database data (countries, colleges, testimonials)
docker compose exec backend python scripts/seed_data.py
```

### Step 4: Local Access Points
| Service | URL | Purpose |
|---------|-----|---------|
| Frontend App | http://localhost | Main website |
| API Engine | http://localhost:8000 | Backend REST API |
| Swagger Docs | http://localhost:8000/api/docs/ | API documentation |
| Nginx Local Proxy | http://api.localhost | Local proxy routing |

---

## 🌍 Production Deployment

### Step 1: Production Environment
Configure a production-safe `.env` file at the root.

```env
SECRET_KEY=<generate-strong-key>
DEBUG=False
ALLOWED_HOSTS=intermost.in,www.intermost.in,localhost,127.0.0.1,backend
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/intermost_db?retryWrites=true&w=majority
CORS_ALLOWED_ORIGINS=https://intermost.in,https://www.intermost.in
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
NEXT_PUBLIC_API_URL=https://intermost.in/api/v1
NEXT_PUBLIC_SITE_URL=https://intermost.in
```

### Step 2: SSL Certificate Provisioning
Request a certificate for your domain and configure symlinks:
```bash
sudo certbot certonly --standalone -d intermost.in -d www.intermost.in

# Copy or symlink to ssl directory
mkdir -p ssl
sudo ln -sf /etc/letsencrypt/live/intermost.in/fullchain.pem ssl/intermost.in.crt
sudo ln -sf /etc/letsencrypt/live/intermost.in/privkey.pem ssl/intermost.in.key
```

### Step 3: Launch Production Containers
```bash
# Start production profile containers
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 📝 Docker Commands

### Using Makefile (Recommended)
```bash
make build              # Build Docker images
make up                 # Start services in background
make down               # Stop services
make logs               # View logs from all services
make migrate            # Run Django migrations
make seed               # Seed database
make prod               # Deploy production environment
make prod-down          # Stop production environment
```

---

## 🐛 Troubleshooting

### Port Already in Use
Find the process blocking your ports (typically port 80 or 443) and kill it:
```bash
# Find blocking PID
sudo lsof -i :80
# Kill the process
sudo kill -9 <PID>
```

### Database Connection Error
Ensure your database URI fallback is pointing to the dockerized mongo network alias (`mongodb:27017`) and check connection logs:
```bash
docker compose logs mongodb
```

### API returns 502 Bad Gateway
If Nginx returns a 502 error, check if the backend container is running or crashed:
```bash
docker compose ps
docker compose logs backend
```
