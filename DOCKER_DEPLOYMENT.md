# Docker Deployment Guide - Intermost Study Abroad

Complete guide for deploying Intermost using Docker and Docker Compose.

## 📋 Table of Contents
- [Quick Start](#quick-start)
- [Development Setup](#development-setup)
- [Production Deployment](#production-deployment)
- [Docker Commands](#docker-commands)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed
- [Docker Compose](https://docs.docker.com/compose/install/) v1.29+
- 4GB RAM minimum, 2 CPU cores

### One Command Deploy (Development)

```bash
# 1. Clone repository
git clone <your-repo>
cd intermost

# 2. Create environment file
cp .env.example .env

# 3. Start services
docker-compose up -d

# 4. Access applications
# Frontend: http://localhost:3000
# API: http://localhost:8000
# Docs: http://localhost:8000/api/docs/
# MongoDB: localhost:27017
```

That's it! ✨

---

## 💻 Development Setup

### Step 1: Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with development values
nano .env
```

```env
# Example development .env
DEBUG=True
SECRET_KEY=dev-secret-key-change-in-production
MONGODB_URI=mongodb://admin:password@mongodb:27017/intermost_db?authSource=admin
MONGODB_NAME=intermost_db
GEMINI_API_KEY=your-dev-key
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://frontend:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Step 2: Build and Start

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Open in browser
# Frontend: http://localhost:3000
# API Docs: http://localhost:8000/api/docs/
```

### Step 3: Initialize Database

```bash
# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser
# Username: admin
# Email: admin@intermost.in
# Password: <enter strong password>

# Seed initial data (optional)
docker-compose exec backend python scripts/seed_data.py
```

### Step 4: Access Services

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Web application |
| API | http://localhost:8000 | REST API |
| API Docs | http://localhost:8000/api/docs/ | Swagger documentation |
| API ReDoc | http://localhost:8000/api/redoc/ | ReDoc documentation |
| MongoDB | localhost:27017 | Database |
| Nginx | http://localhost:80 | Reverse proxy |

---

## 🌍 Production Deployment

### Step 1: Prepare for Production

```bash
# Update environment for production
cp .env.example .env.prod

# Edit with production values
nano .env.prod
```

```env
# Production .env.prod
SECRET_KEY=<generate-strong-key>
DEBUG=False
ALLOWED_HOSTS=api.intermost.in,intermost.in,www.intermost.in
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/db?retryWrites=true
CORS_ALLOWED_ORIGINS=https://intermost.in,https://www.intermost.in,https://api.intermost.in
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

### Step 2: SSL Certificate Setup

```bash
# Create SSL directory
mkdir -p ssl

# Option A: Use Let's Encrypt (recommended)
certbot certonly --standalone -d intermost.in -d www.intermost.in -d api.intermost.in

# Copy certificates
cp /etc/letsencrypt/live/intermost.in/fullchain.pem ssl/intermost.in.crt
cp /etc/letsencrypt/live/intermost.in/privkey.pem ssl/intermost.in.key

# Option B: Use self-signed (testing only)
openssl req -x509 -newkey rsa:4096 -keyout ssl/intermost.in.key -out ssl/intermost.in.crt -days 365 -nodes
```

### Step 3: Deploy to Server

```bash
# Use production compose file
docker-compose -f docker-compose.prod.yml up -d

# Verify services
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Step 4: Database Backup Strategy

```bash
# Automatic backups (cron job)
0 2 * * * /home/ubuntu/intermost/scripts/backup-mongo.sh

# Manual backup
docker-compose exec mongodb mongodump --uri "mongodb://admin:pass@localhost:27017" --out ./backups

# Restore backup
docker-compose exec mongodb mongorestore ./backups
```

---

## 📝 Docker Commands

### Using Makefile (Recommended)

```bash
# Show all available commands
make help

# Build images
make build

# Start services
make up

# Stop services
make down

# View logs
make logs
make logs-backend
make logs-frontend

# Access shell
make shell-backend
make shell-frontend

# Database operations
make migrate
make createsuperuser
make seed

# Production
make prod        # Deploy production
make prod-down   # Stop production
```

### Manual Docker Commands

```bash
# Build specific service
docker-compose build backend
docker-compose build frontend

# Start specific service
docker-compose up -d backend
docker-compose start backend

# Stop all services
docker-compose stop
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v

# View container logs
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs backend --tail=100

# Execute command in container
docker-compose exec backend bash
docker-compose exec frontend sh
docker-compose exec backend python manage.py migrate

# View resource usage
docker stats

# Prune unused resources
docker system prune -a -v
```

---

## 🐛 Troubleshooting

### Issue: Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000
# Kill process
kill -9 <PID>

# Or use different ports
docker-compose down
# Edit docker-compose.yml ports section
docker-compose up
```

### Issue: Containers Won't Start

```bash
# Check logs
docker-compose logs backend

# Common causes:
# 1. Port conflict
# 2. Insufficient disk space
# 3. Network issues
# 4. Invalid environment variables

# Solution
docker-compose down
docker system prune -a
docker-compose up --build
```

### Issue: Database Connection Error

```bash
# Check MongoDB status
docker-compose logs mongodb

# MongoDB not ready yet, wait and retry
docker-compose restart mongodb

# Check MongoDB connection string in .env
cat .env | grep MONGODB_URI
```

### Issue: API Returns 502 Bad Gateway

```bash
# Check backend logs
docker-compose logs backend

# Check Nginx logs
docker-compose logs nginx

# Restart services
docker-compose restart backend
docker-compose restart nginx
```

### Issue: Frontend Can't Connect to API

```bash
# Check CORS settings in .env
cat .env | grep CORS

# Verify API is running
curl http://backend:8000/api/v1/health/

# Check frontend environment
docker-compose exec frontend env | grep NEXT_PUBLIC_API_URL

# Restart frontend
docker-compose restart frontend
```

### Issue: High Memory Usage

```bash
# Check resource usage
docker stats

# Limit container resources
# Edit docker-compose.yml and add:
# deploy:
#   resources:
#     limits:
#       memory: 1G

# Restart with new limits
docker-compose up -d
```

---

## 🔧 Maintenance

### Regular Tasks

```bash
# Daily
make logs  # Review logs for errors
docker system df  # Check disk usage

# Weekly
docker-compose exec backend python manage.py check  # Django health check
# Backup MongoDB

# Monthly
docker images prune -a  # Remove unused images
# Update base images
docker-compose build --no-cache

# Quarterly
# Update dependencies
# Security patches
# Performance review
```

### Backup & Restore

```bash
# Backup database
docker-compose exec mongodb mongodump --uri "mongodb://..." --out ./backups/$(date +%Y%m%d)

# Restore database
docker-compose exec mongodb mongorestore ./backups/20260526

# Backup volumes
docker run --rm -v intermost_mongodb_data:/data -v $(pwd):/backup alpine tar czf /backup/mongodb.tar.gz -C /data .
```

### Scaling Services

```bash
# Scale backend workers
docker-compose up -d --scale backend=3

# For production, use Kubernetes or Docker Swarm
# Consider managed services (AWS ECS, Google Cloud Run, etc.)
```

---

## 📊 Monitoring

### Health Checks

```bash
# API health
curl http://localhost:8000/api/v1/health/

# Database health
curl http://localhost:8000/api/v1/db-health/

# Frontend health
curl http://localhost:3000

# Check all services status
docker-compose ps
```

### Logging

```bash
# All logs
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb

# Last 100 lines
docker-compose logs --tail=100

# Since specific time
docker-compose logs --since 1h
```

### Performance Monitoring

```bash
# Real-time resource usage
docker stats

# Container processes
docker-compose top backend

# Network stats
docker network stats intermost-network
```

---

## 🚀 Advanced Deployment Options

### Option 1: Docker Hub Registry

```bash
# Login to Docker Hub
docker login

# Tag images
docker tag intermost-backend:latest username/intermost-backend:latest
docker tag intermost-frontend:latest username/intermost-frontend:latest

# Push images
docker push username/intermost-backend:latest
docker push username/intermost-frontend:latest

# Pull and run on server
docker pull username/intermost-backend:latest
docker pull username/intermost-frontend:latest
```

### Option 2: Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.prod.yml intermost

# View services
docker service ls
docker service logs intermost_backend
```

### Option 3: Kubernetes

```bash
# Convert docker-compose to Kubernetes
kompose convert -f docker-compose.yml

# Deploy to Kubernetes
kubectl apply -f .
```

### Option 4: Managed Services

**AWS ECS:**
```bash
# Use AWS ECS CLI
ecs-cli compose --file docker-compose.yml service up
```

**Google Cloud Run:**
```bash
gcloud run deploy intermost-web --image gcr.io/.../intermost-frontend
```

**Azure Container Instances:**
```bash
az container create --resource-group myResourceGroup --file docker-compose.yml
```

---

## 📚 Documentation Links

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [MongoDB Docker Image](https://hub.docker.com/_/mongo)
- [Node.js Docker Image](https://hub.docker.com/_/node)
- [Python Docker Image](https://hub.docker.com/_/python)

---

## ✅ Deployment Checklist

- [ ] Environment variables configured
- [ ] SSL certificates set up
- [ ] Database backups configured
- [ ] Health checks passing
- [ ] All services running
- [ ] Frontend accessible at https://intermost.in
- [ ] API accessible at https://api.intermost.in
- [ ] API documentation available
- [ ] Monitoring/logging configured
- [ ] Automated backups set up

---

**Last Updated:** May 26, 2026  
**Status:** ✅ Production Ready
