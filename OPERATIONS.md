# Quality Pulse - Operations & Runbook

This document provides a comprehensive guide on how to operate, maintain, and troubleshoot the Quality Pulse system using Docker Compose.

## 1. Environment Setup

Before starting the system, ensure you have a `.env` file in the root directory. This file is required by both development and production docker-compose configurations.

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=qualitypulse
REDIS_PASSWORD=your_secure_password
GEMINI_API_KEY=your_gemini_api_key
NEWS_API_KEY=your_news_api_key
DOMAIN_NAME=doodle-choi.me
```

---

## 2. Production Environment (HTTPS Enabled)

The production environment uses `docker-compose.prod.yml`, which includes Nginx for routing and Certbot for automatic SSL/HTTPS certificate management.

### Starting the System
To build and run all services in the background:
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

### Stopping the System
To gracefully stop all services without deleting data:
```bash
docker-compose -f docker-compose.prod.yml stop
```
To stop and remove all containers, networks, and images (data volumes will persist):
```bash
docker-compose -f docker-compose.prod.yml down
```

### Rebuilding a Specific Service
If you made changes to a specific component (e.g., the frontend), you can rebuild and restart just that service:
```bash
docker-compose -f docker-compose.prod.yml up --build -d frontend
```

---

## 3. Viewing Logs

Monitoring logs is crucial for debugging. You can view logs for all services or specify a particular one.

**View all logs in real-time:**
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

**View logs for a specific service (e.g., backend, crawler, frontend):**
```bash
# Follow live logs for the crawler
docker-compose -f docker-compose.prod.yml logs -f crawler

# See the last 50 lines of the backend logs
docker-compose -f docker-compose.prod.yml logs --tail=50 backend
```

*Available Services:* `db`, `redis`, `backend`, `frontend`, `crawler`, `nginx`, `certbot`.

---

## 4. HTTPS and SSL Management

SSL certificates are provided by Let's Encrypt and managed via Certbot.

### Initial Setup
If you are deploying to a new server or a new domain, you must run the initialization script **before** starting the production stack. Ensure your DNS records point to the server's IP.
```bash
chmod +x init-letsencrypt.sh
./init-letsencrypt.sh
```

### Automatic Renewals
The `certbot` service in `docker-compose.prod.yml` automatically wakes up every 12 hours to attempt certificate renewal. If successful, Nginx will automatically pick up the new certificates.

### Manual Nginx Reload
If you make changes to `nginx/nginx.conf`, you can reload Nginx without stopping the container:
```bash
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

---

## 5. Development Environment

For local development (without HTTPS/Nginx), use the standard `docker-compose.yml`.

**Start Development Stack:**
```bash
docker-compose up --build -d
```
Access the local dashboard at: `http://localhost:3000`

---

## 6. Troubleshooting & Common Issues

### 🔴 Error: `KeyError: 'ContainerConfig'` during docker-compose
**Cause:** This happens when an older version of `docker-compose` tries to read the state of containers created by a newer Docker engine update.
**Solution:**
Instead of using `docker-compose up` to restart, start the containers directly via Docker:
```bash
# List all containers to get their IDs
docker ps -a

# Start specific containers (e.g., DB and Redis) using their Container ID
docker start <db_container_id> <redis_container_id>

# Restart the dependent apps
docker restart <backend_container_id> <crawler_container_id>
```

### 🔴 Error: Backend says `could not translate host name "db" to address`
**Cause:** The backend container started, but the database container crashed or is not running, causing a DNS failure inside the Docker network.
**Solution:**
1. Check if the DB is running: `docker ps | grep db`
2. Check DB logs to see why it crashed: `docker logs <db_container_name>`
3. Start the DB and Redis, wait 5 seconds, then restart the Backend and Crawler.

### 🔴 Error: Frontend is trying to fetch from `http://localhost:8000` in Production
**Cause:** Next.js bakes environment variables starting with `NEXT_PUBLIC_` into the static build. Changing the variable in the `.env` file or `docker-compose.yml` does not affect an already built image.
**Solution:**
You must rebuild the frontend image passing the build argument.
```bash
docker-compose -f docker-compose.prod.yml up --build -d frontend
```

---

## 7. Data Management

### Accessing the Database Directly
You can enter the PostgreSQL database shell via the container:
```bash
docker exec -it ae83cd0b6aa6 psql -U postgres -d qualitypulse
```
*(Replace `ae83cd0b6aa6` with your actual db container ID from `docker ps`)*

### Clearing All Data (Hard Reset)
If you want to wipe the database and redis cache entirely:
```bash
docker-compose -f docker-compose.prod.yml down -v
```
*(Warning: This deletes the `postgres_data` and `redis_data` volumes permanently!)*