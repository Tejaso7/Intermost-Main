# Intermost Backend - Production Deployment Guide

## 🎯 Production Readiness Status: ✅ 100% READY

---

## 📋 Checklist - What's Done ✅

### Security Hardening
- ✅ **Permissions Configured**: Core database views use simple JWT authentication checks.
- ✅ **CORS Hardened**: Set `CORS_ALLOW_ALL_ORIGINS = False` (production-safe).
- ✅ **Rate Limiting**: Throttling configured (100/hour anon, 1000/hour authenticated).
- ✅ **SSL/HSTS Headers**: Configured for secure HTTPS environments.
- ✅ **Static Files**: Serves compiled static assets efficiently via WhiteNoise.

### Backend Components
- ✅ **MongoDB Atlas Connection**: PyMongo connection pooling + proper SSL/TLS.
- ✅ **JWT Authentication**: Access (24h) + Refresh (7d) tokens active.
- ✅ **API Versioning**: All endpoints under `/api/v1/`.
- ✅ **Structured Logging**: Log severity configuration active.
- ✅ **Health Checks**: Endpoints for API + Database health live.

---

## 🚀 Deployment Steps

### Step 1: Environment Setup
```bash
# 1. Clone project
git clone https://github.com/Tejaso7/Intermost-Main.git intermost
cd intermost/Intermost-Backend

# 2. Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# 3. Install dependencies
pip install -r requirements.txt
```

### Step 2: Environment Configuration
Create the `.env` configuration file:
```bash
cp .env.example .env
```

Production `.env` template:
```env
SECRET_KEY=<generate-strong-secret-key>
DEBUG=False
ALLOWED_HOSTS=intermost.in,www.intermost.in,localhost,127.0.0.1,backend

MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/intermost_db?retryWrites=true&w=majority
MONGODB_NAME=intermost_db

JWT_SECRET_KEY=<strong-random-key>
JWT_ACCESS_TOKEN_LIFETIME=86400
JWT_REFRESH_TOKEN_LIFETIME=604800

GEMINI_API_KEY=<your-api-key>

CLOUDINARY_CLOUD_NAME=<name>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>

CORS_ALLOWED_ORIGINS=https://intermost.in,https://www.intermost.in

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=admissionintermost@gmail.com
EMAIL_HOST_PASSWORD=<app-password>
EMAIL_USE_TLS=True

SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

### Step 3: Database & Static Asset Setup
```bash
# Run migrations (For Django core user authentication)
python manage.py migrate

# Create superuser account
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput

# Seed default database data
python scripts/seed_data.py
```

### Step 4: Run Gunicorn server
```bash
gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 4
```

---

## 🔒 Security Checklist
- [x] **SECRET_KEY**: Set to a unique, random string (not in Git).
- [x] **DEBUG=False**: Always disabled in production.
- [x] **ALLOWED_HOSTS**: Restricted to `intermost.in` and `www.intermost.in`.
- [x] **HTTPS/SSL Redirection**: Enabled (`SECURE_SSL_REDIRECT=True`).
- [x] **CORS Origins**: Restricted to the frontend main domain.
- [x] **Cookie Security**: Secure session/CSRF cookies active.
- [x] **Throttling/Rate Limiting**: Active (100/hr guest, 1000/hr user).

---

## 📈 Monitoring & Logging

### Health Check Endpoints
```bash
# API Health Check
curl https://intermost.in/api/v1/health/

# Database Health Check
curl https://intermost.in/api/v1/db-health/
```

### Endpoints Map
| Endpoint | Method | Authentication | Purpose |
|----------|--------|----------------|---------|
| `/api/v1/health/` | GET | None | API Status |
| `/api/v1/db-health/` | GET | None | DB Connection Status |
| `/api/v1/auth/login/` | POST | None | Login (Get JWT Token) |
| `/api/v1/auth/register/` | POST | None | Registration |
| `/api/v1/countries/` | GET/POST | POST: Admin | Countries CRUD |
| `/api/v1/colleges/` | GET/POST | POST: Admin | Colleges CRUD |
| `/api/v1/blogs/` | GET/POST | POST: Admin | Blogs CRUD |
| `/api/v1/inquiries/` | GET/POST | GET: Admin | Inquiry Tracking |
| `/api/v1/chat/` | POST | None | Student Chatbot |
| `/api/docs/` | GET | None | Swagger Documentation |
