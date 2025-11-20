# Point Cloud Viewer - Docker Setup

## Prerequisites
- Docker Desktop installed
- Docker Compose installed

## Quick Start

### 1. Build and Start (Development Mode with Hot Reload)
```bash
docker-compose up --build
```

### 2. Access the Application
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend API**: http://localhost:8080 (Flask debug mode)

### 3. Stop Services
```bash
docker-compose down
```

## Features
- ✅ **Hot reload enabled** - Code changes appear instantly
- ✅ **Flask debug mode** - Backend auto-reloads on Python changes
- ✅ **Vite HMR** - Frontend updates without full page refresh
- ✅ **Volume mounts** - Edit code locally, see changes in containers

## Commands

### Start in Background
```bash
docker-compose up -d
```

### View Logs
```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend
```

### Restart After Changes
```bash
docker-compose restart
```

### Stop Everything
```bash
docker-compose down
```

### Run Single Service

```bash
# Backend only
docker-compose up backend

# Frontend only
docker-compose up frontend
```

## Troubleshooting

### Port Already in Use
If ports 3000 or 8080 are taken, edit `docker-compose.yml`:
```yaml
ports:
  - "8081:8080"  # Change 8080 to 8081
```

### Rebuild After Code Changes
```bash
docker-compose up --build
```

### Check Container Status
```bash
docker-compose ps
```

### Access Container Shell
```bash
# Backend
docker exec -it pointcloud-backend bash

# Frontend
docker exec -it pointcloud-frontend sh
```

### Clear Everything and Start Fresh
```bash
docker-compose down -v
docker system prune -af
docker-compose up --build
```

## Notes

- Backend runs on Python 3.11 with TensorFlow 2.17
- Frontend uses Vite dev server with hot module replacement
- Code changes automatically reload in containers
- Data volumes are mounted so point clouds persist
- Model checkpoints in `backend/log/` are preserved
- Potree files in `backend/potree/` are accessible
