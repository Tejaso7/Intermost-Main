# AWS EC2 Deployment Guide - Intermost Study Abroad

This guide outlines the step-by-step process of deploying the Intermost platform (Next.js frontend + Django backend) on a single AWS EC2 instance using Docker and Docker Compose.

---

## 📋 Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [EC2 Instance Provisioning](#2-ec2-instance-provisioning)
3. [AWS Security Group Configuration](#3-aws-security-group-configuration)
4. [Docker & Git Installation on EC2](#4-docker--git-installation-on-ec2)
5. [Project Directory Layout & Cloning](#5-project-directory-layout--cloning)
6. [SSL Certificates via Let's Encrypt](#6-ssl-certificates-via-lets-encrypt)
7. [Environment Configuration](#7-environment-configuration)
8. [Deploying with Docker Compose](#8-deploying-with-docker-compose)
9. [Troubleshooting & Logs](#9-troubleshooting--logs)

---

## 1. Prerequisites
- An active AWS Account.
- A registered domain name (e.g., `intermost.in`) with DNS records pointing to your EC2 elastic IP:
  - `A` record pointing `intermost.in` to your EC2 IP.
  - `A` record pointing `www.intermost.in` to your EC2 IP.
  - `A` record pointing `api.intermost.in` to your EC2 IP.

---

## 2. EC2 Instance Provisioning
1. Log in to your AWS Console and navigate to **EC2 Dashboard** -> **Launch Instance**.
2. **Name**: `Intermost-Prod-Server`
3. **OS Image**: Select **Ubuntu Server 24.04 LTS** (or 22.04 LTS).
4. **Instance Type**: Select **t3.medium** (2 vCPUs, 4GB RAM minimum for builds).
5. **Key Pair**: Choose an existing key pair or create a new one (save the `.pem` file).
6. **Network Settings**: Allow SSH, HTTP, and HTTPS traffic from the wizard.
7. **Configure Storage**: Set Root Volume size to **30 GB** (gp3 SSD) to accommodate Docker builds.
8. Click **Launch Instance**.

---

## 3. AWS Security Group Configuration
In the EC2 dashboard, select your running instance, click **Security**, and click your Security Group. Add these **Inbound Rules**:

| Type | Protocol | Port Range | Source | Description |
|------|----------|------------|--------|-------------|
| SSH | TCP | 22 | My IP / Anywhere | SSH Access |
| HTTP | TCP | 80 | Anywhere-IPv4 (`0.0.0.0/0`) | Nginx HTTP |
| HTTPS | TCP | 443 | Anywhere-IPv4 (`0.0.0.0/0`) | Nginx HTTPS |
| Custom TCP | TCP | 8000 | Anywhere-IPv4 (optional) | Backend Direct API |
| Custom TCP | TCP | 3000 | Anywhere-IPv4 (optional) | Frontend Direct Access |

---

## 4. Docker & Git Installation on EC2
Connect to your EC2 instance via SSH:
```bash
ssh -i /path/to/your-key.pem ubuntu@your-ec2-public-ip
```

Run updates and install Docker + Docker Compose:
```bash
# Update package list
sudo apt-get update && sudo apt-get upgrade -y

# Install prerequisites
sudo apt-get install -y curl git apt-transport-https ca-certificates software-properties-common

# Add Docker’s official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify installations
docker --version
docker compose version

# Add ubuntu user to docker group (so you don't need sudo for docker command)
sudo usermod -aG docker $USER
newgrp docker
```

---

## 5. Project Directory Layout & Cloning
We will clone the backend and frontend into a single main directory on the server.

```bash
# Create main project directory
mkdir -p ~/intermost && cd ~/intermost

# Clone Frontend Repository
git clone https://github.com/Tejaso7/Intermost-Frontend.git Intermost-Frontend

# Clone Backend Repository
git clone https://github.com/Tejaso7/Intermost-Backend.git Intermost-Backend
```

Now copy the production compose configuration and nginx configuration into the root directory. You can download or create them:
```bash
# Copy compose files from the backend/repo to root:
cp Intermost-Backend/docker-compose.prod.yml ./docker-compose.prod.yml
cp Intermost-Backend/nginx.prod.conf ./nginx.prod.conf
```

Confirm your directory layout looks like this:
```
~/intermost/
├── docker-compose.prod.yml
├── nginx.prod.conf
├── Intermost-Frontend/
└── Intermost-Backend/
```

---

## 6. SSL Certificates via Let's Encrypt
We need SSL certificates for `intermost.in`, `www.intermost.in`, and `api.intermost.in` before starting Nginx.

```bash
# Install Certbot
sudo apt-get install -y certbot

# Request a single SAN certificate for all domains
sudo certbot certonly --standalone \
  -d intermost.in \
  -d www.intermost.in \
  -d api.intermost.in \
  --email admissionintermost@gmail.com \
  --agree-tos --no-eff-email

# Create the local SSL directory inside our project root
mkdir -p ~/intermost/ssl

# Symlink the generated Let's Encrypt keys so they can be read by Nginx container
sudo ln -sf /etc/letsencrypt/live/intermost.in/fullchain.pem ~/intermost/ssl/intermost.in.crt
sudo ln -sf /etc/letsencrypt/live/intermost.in/privkey.pem ~/intermost/ssl/intermost.in.key
```

### Auto-Renewal Cron Job
Let's Encrypt certificates expire in 90 days. Set up automatic renewal:
```bash
sudo crontab -e
```
Add the following line to renew twice a day and reload Nginx:
```cron
0 */12 * * * certbot renew --post-hook "docker exec intermost-nginx-prod nginx -s reload" >> /var/log/certbot-renew.log 2>&1
```

---

## 7. Environment Configuration
Create the production environment file `~/intermost/.env`:
```bash
nano ~/intermost/.env
```

Paste and configure the following template with your production credentials:
```env
# ===== DJANGO/BACKEND PRODUCTION =====
SECRET_KEY=generate-a-strong-random-key-here
DEBUG=False
ALLOWED_HOSTS=api.intermost.in,intermost.in,www.intermost.in

# Database Configuration (Atlas or Managed MongoDB Recommended)
MONGODB_URI=mongodb+srv://<dbuser>:<dbpassword>@<your-cluster>.mongodb.net/intermost_db?retryWrites=true&w=majority
MONGODB_NAME=intermost_db

# JWT Configuration
JWT_SECRET_KEY=another-strong-random-key
JWT_ACCESS_TOKEN_LIFETIME=86400
JWT_REFRESH_TOKEN_LIFETIME=604800

# API Keys
GEMINI_API_KEY=AIzaSy...your-production-gemini-key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret

# CORS Configuration
CORS_ALLOWED_ORIGINS=https://intermost.in,https://www.intermost.in

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=admissionintermost@gmail.com
EMAIL_HOST_PASSWORD=your-gmail-app-password
EMAIL_USE_TLS=True

# Django logging
DJANGO_LOG_LEVEL=WARNING

# ===== NEXT.JS/FRONTEND PRODUCTION =====
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.intermost.in/api/v1
NEXT_PUBLIC_SITE_URL=https://intermost.in
NEXT_PUBLIC_WHATSAPP_NUMBER=919058501818
```

*(Tip: Generate a Django `SECRET_KEY` on your local machine using: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`)*

---

## 8. Deploying with Docker Compose
Run the setup with Docker Compose. This will pull images, build the custom frontend and backend, run Django migrations, compile static files, and start all containers.

```bash
# Build and run containers in detached mode
docker compose -f docker-compose.prod.yml up -d --build

# Verify all containers are running
docker compose -f docker-compose.prod.yml ps
```

### Initial Data Seeding (First-time setup)
Once the containers are running:
```bash
# Run django migrations
docker compose -f docker-compose.prod.yml exec backend python manage.py migrate

# Create the admin user
docker compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser

# Seed default data (countries, colleges, testimonials)
docker compose -f docker-compose.prod.yml exec backend python scripts/seed_data.py
```

---

## 9. Troubleshooting & Logs

### View Container Logs
```bash
# All logs
docker compose -f docker-compose.prod.yml logs -f

# Backend logs only
docker compose -f docker-compose.prod.yml logs -f backend

# Nginx logs only
docker compose -f docker-compose.prod.yml logs -f nginx
```

### Check Container Health Status
```bash
# Verify Docker network stats
docker network ls

# View resources
docker stats
```

### Common Issues
1. **502 Bad Gateway**:
   - Check if the backend container is running: `docker compose -f docker-compose.prod.yml ps`.
   - Run `docker compose -f docker-compose.prod.yml logs backend` to inspect Python/Gunicorn startup errors.
2. **MongoDB Connection Failures**:
   - Make sure your MongoDB Atlas Cluster IP Access List allows connections from your EC2 Public IP address.
3. **SSL Certificate Errors**:
   - Ensure the symlinks `/home/ubuntu/intermost/ssl/intermost.in.crt` and `key` point to valid file paths in `/etc/letsencrypt/live/...`.
