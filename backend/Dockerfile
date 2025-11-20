# Development Dockerfile - enables hot reload
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Don't copy code - it will be mounted as volume
# This allows hot reload

EXPOSE 8080

# Flask will auto-reload on file changes
CMD ["python", "server.py"]
