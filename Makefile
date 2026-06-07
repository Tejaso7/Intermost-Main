.PHONY: help build up down logs clean restart shell-backend shell-frontend migrate seed

help:
	@echo "Intermost Docker Commands"
	@echo "========================="
	@echo "make build              - Build all Docker images"
	@echo "make up                 - Start all services"
	@echo "make down               - Stop all services"
	@echo "make logs               - View logs from all services"
	@echo "make logs-backend       - View backend logs"
	@echo "make logs-frontend      - View frontend logs"
	@echo "make clean              - Remove all Docker containers and volumes"
	@echo "make restart            - Restart all services"
	@echo "make shell-backend      - Open shell in backend container"
	@echo "make shell-frontend     - Open shell in frontend container"
	@echo "make migrate            - Run Django migrations"
	@echo "make seed               - Seed database with initial data"
	@echo "make test-backend       - Run backend tests"
	@echo "make test-frontend      - Run frontend tests"
	@echo "make prod               - Deploy production setup"
	@echo "make prod-down          - Stop production services"

build:
	@echo "Building Docker images..."
	docker-compose build

build-prod:
	@echo "Building production Docker images..."
	docker-compose -f docker-compose.prod.yml build

up:
	@echo "Starting services..."
	docker-compose up -d
	@echo "✓ Services started"
	@echo "Frontend: http://localhost:3000"
	@echo "API: http://localhost:8000"
	@echo "Docs: http://localhost:8000/api/docs/"

up-prod:
	@echo "Starting production services..."
	docker-compose -f docker-compose.prod.yml up -d
	@echo "✓ Production services started"

down:
	@echo "Stopping services..."
	docker-compose down

down-prod:
	@echo "Stopping production services..."
	docker-compose -f docker-compose.prod.yml down

logs:
	docker-compose logs -f

logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

logs-prod:
	docker-compose -f docker-compose.prod.yml logs -f

clean:
	@echo "Cleaning up Docker resources..."
	docker-compose down -v
	@echo "✓ Cleaned"

clean-prod:
	@echo "Cleaning up production Docker resources..."
	docker-compose -f docker-compose.prod.yml down -v
	@echo "✓ Cleaned"

restart:
	@echo "Restarting services..."
	docker-compose restart
	@echo "✓ Services restarted"

shell-backend:
	docker-compose exec backend bash

shell-frontend:
	docker-compose exec frontend sh

shell-backend-prod:
	docker-compose -f docker-compose.prod.yml exec backend bash

shell-frontend-prod:
	docker-compose -f docker-compose.prod.yml exec frontend sh

migrate:
	@echo "Running migrations..."
	docker-compose exec backend python manage.py migrate

migrate-prod:
	@echo "Running migrations (prod)..."
	docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate

seed:
	@echo "Seeding database..."
	docker-compose exec backend python scripts/seed_data.py

seed-prod:
	@echo "Seeding database (prod)..."
	docker-compose -f docker-compose.prod.yml exec backend python scripts/seed_data.py

createsuperuser:
	@echo "Creating superuser..."
	docker-compose exec backend python manage.py createsuperuser

createsuperuser-prod:
	@echo "Creating superuser (prod)..."
	docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser

test-backend:
	@echo "Running backend tests..."
	docker-compose exec backend pytest

test-frontend:
	@echo "Running frontend tests..."
	docker-compose exec frontend npm test

health:
	@echo "Checking service health..."
	@curl -s http://localhost:8000/api/v1/health/ | jq . || echo "Backend API is down"
	@curl -s http://localhost:3000/health | jq . || echo "Frontend is down"

prod: build-prod up-prod
	@echo "✓ Production environment ready"

prod-down: down-prod
	@echo "✓ Production environment stopped"

docker-login:
	@read -p "Docker username: " username; \
	docker login -u $$username

docker-push:
	@read -p "Docker registry: " registry; \
	docker tag intermost-backend:latest $$registry/intermost-backend:latest; \
	docker tag intermost-frontend:latest $$registry/intermost-frontend:latest; \
	docker push $$registry/intermost-backend:latest; \
	docker push $$registry/intermost-frontend:latest;

install-deps:
	@echo "Installing local dependencies..."
	cd Intermost-Backend && pip install -r requirements.txt
	cd ../Intermost-Frontend && npm install

version:
	@echo "Docker version info:"
	docker --version
	docker-compose --version
