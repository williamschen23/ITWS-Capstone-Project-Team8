# Point Cloud Viewer

## Setup
### Development
```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8080
## Commands

```bash
# Start
docker compose up

# Stop
docker compose down

# Rebuild (only if you changed package.json or requirements.txt)
docker compose up --build

# View logs
docker compose logs -f

# After installing new dependency
docker compose down
docker compose up --build
```

## Notes

- Code changes auto-reload
- No need to restart containers when editing files

# Deployment

### Production
```bash
docker compose -f docker-compose.prod.yml up --build -d
```
- Frontend: http://localhost (port 80)
- Backend: http://localhost:8080
- Frontend speaks to backend using a `.env` file with `VITE_API_URL`
