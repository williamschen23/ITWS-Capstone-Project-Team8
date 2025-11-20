# Development Dockerfile - Vite dev server with hot reload
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Don't copy source - it will be mounted as volume
# This enables hot module replacement (HMR)

EXPOSE 5173

# Run Vite dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
