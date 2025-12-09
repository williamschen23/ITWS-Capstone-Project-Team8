# ITWS 4100 - Team 8 Final Project (Client - Twinner)

A full-stack web application for **uploading**, **classifying**, and **visualizing** 3D point cloud data using AI-powered object recognition and interactive 3D rendering.

![Tech Stack](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)
![Tech Stack](https://img.shields.io/badge/Flask-3.0.3-000000?logo=flask)
![Tech Stack](https://img.shields.io/badge/TensorFlow-2.17.0-FF6F00?logo=tensorflow)
![Tech Stack](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Development](#development)
- [Production Deployment](#production-deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

---

## Overview

This platform combines **machine learning** and **3D visualization** to provide a comprehensive solution for point cloud data analysis:

- **PointNet Classification**: Upload `.txt` point clouds and get instant AI-powered object classification (40 classes including chairs, desks, lamps, airplanes, etc.)
- **Potree Visualization**: Upload `.laz`/`.las` files and explore massive 3D datasets interactively in your browser
- **Real-time Processing**: Asynchronous job queue handles long-running conversions without blocking
- **Containerized Deployment**: Docker Compose ensures consistent environments across dev and production

---

## Features

### AI-Powered Classification
- **PointNet Deep Learning Model** trained on ShapeNet/ModelNet40 (40 object classes)
- Upload `.txt` point cloud files for instant classification
- View confidence scores and top-5 predictions
- Interactive 3D visualization of uploaded point clouds using Plotly

### Interactive 3D Visualization
- **Potree WebGL renderer** for massive point cloud datasets (millions/billions of points)
- Upload `.laz`/`.las` files with drag-and-drop interface
- Progressive loading with Level of Detail (LOD)
- Pan, rotate, zoom, and measure tools
- Manage multiple point clouds with status tracking (processing, ready, failed)

### Developer-Friendly
- **Hot reload** in development (Vite HMR + Flask debug mode)
- **Docker Compose** for one-command setup
- RESTful API design
- Clean separation between frontend and backend
- Comprehensive error handling and logging

---

## Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite 7** - Build tool & dev server
- **Tailwind CSS 4** - Styling
- **Plotly.js** - 3D visualization
- **React Router 7** - Client-side routing

### Backend
- **Flask 3** - Web framework
- **TensorFlow 2.17** - Deep learning
- **PointNet** - 3D object classification model
- **Potree** - Point cloud visualization library
- **PotreeConverter** - LAS/LAZ to octree conversion

### Infrastructure
- **Docker & Docker Compose** - Containerization
- **Python 3.11** - Backend runtime
- **Node.js** - Frontend build environment

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT BROWSER                           │
│  React Frontend (localhost:5173 dev / localhost:80 prod)    │
└────────────────┬────────────────────────────────────────────┘
                 │ REST API (HTTP/JSON)
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  Flask Backend (localhost:8080)                             │
│  ├─ /predict          → PointNet classification             │
│  ├─ /api/pointclouds  → List & manage point clouds          │
│  ├─ /viewer/<name>    → Potree 3D viewer                    │
│  └─ Worker Thread     → Async LAS/LAZ conversion            │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  Data Storage                                               │
│  ├─ backend/log/model.ckpt   → PointNet weights             │
│  ├─ backend/data/raw/         → Uploaded files              │
│  └─ backend/data/pointclouds/ → Converted octrees           │
└─────────────────────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- **Docker Desktop** installed and running
- **Docker Compose** V2+
- **Git** (for cloning the repository)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/williamschen23/ITWS-Capstone-Project-Team8.git
   cd ITWS-Capstone-Project-Team8
   ```

2. **Start the application**
   ```bash
   docker compose up --build
   ```

3. **Access the platform**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:8080

That's it! The application is now running with hot-reload enabled.

---

## Usage

### 1. PointNet Classification

1. Navigate to **"Try Classifier"** from the home page
2. Upload a `.txt` point cloud file (format: each line contains `X Y Z` coordinates)
3. View the 3D visualization in Plotly
4. See the predicted object class and confidence score
5. Example classes: `chair`, `desk`, `lamp`, `airplane`, `car`, etc.

### 2. Potree 3D Visualization

1. Navigate to **"Open Viewer"** from the home page
2. Click **"Upload Point Cloud"**
3. Drag & drop a `.laz` or `.las` file
4. Add a name and description
5. Wait for processing to complete (status shows in sidebar)
6. Click on the point cloud name to launch the interactive 3D viewer

---

## Project Structure

```
ITWS-Capstone-Project-Team8/
├── frontend/                  # React application
│   ├── src/
│   │   ├── pages/            # PointNetPage, PotreePage
│   │   ├── components/       # Reusable UI components
│   │   └── main.jsx          # App entry point
│   ├── package.json          # Node dependencies
│   ├── vite.config.js        # Vite configuration
│   └── Dockerfile            # Frontend container
│
├── backend/                   # Flask application
│   ├── server.py             # Main API server
│   ├── worker.py             # Background job processor
│   ├── models/               # PointNet architecture
│   │   └── pointnet_cls.py   # Classification model
│   ├── log/                  # Pre-trained model checkpoints
│   │   └── model.ckpt.*      # PointNet weights
│   ├── potree/               # Potree library & converter
│   ├── data/                 # Storage for point clouds
│   │   ├── raw/              # Uploaded LAS/LAZ files
│   │   └── pointclouds/      # Converted Potree octrees
│   ├── requirements.txt      # Python dependencies
│   └── Dockerfile            # Backend container
│
├── docker-compose.yml         # Development orchestration
├── docker-compose.prod.yml    # Production orchestration
└── README.md                  # This file
```

---

## Development

### Running in Development Mode

```bash
# Start with hot-reload
docker compose up --build

# View logs
docker compose logs -f

# View logs for specific service
docker compose logs -f backend
docker compose logs -f frontend

# Stop services
docker compose down
```

### Making Code Changes

- **Frontend**: Changes in `frontend/src/` auto-reload instantly (Vite HMR)
- **Backend**: Changes in `backend/*.py` auto-reload Flask server
- **No restart needed** for most code changes

### Rebuilding After Dependency Changes

If you modify `package.json` or `requirements.txt`:

```bash
docker compose down
docker compose up --build
```

### Accessing Container Shells

```bash
# Backend container
docker exec -it pointcloud-backend-dev bash

# Frontend container
docker exec -it pointcloud-frontend-dev sh
```

---

## Production Deployment

### Build and Run Production Images

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

**Access:**
- Frontend: http://localhost (port 80)
- Backend: http://localhost:8080

### Custom Domain Configuration

1. Create `frontend/.env`:
   ```env
   VITE_API_URL=https://your-domain.com:8080
   ```

2. Rebuild and redeploy:
   ```bash
   docker compose -f docker-compose.prod.yml up --build -d
   ```

### Stop Production Services

```bash
docker compose -f docker-compose.prod.yml down
```

---

## API Documentation

### Classification Endpoint

**POST** `/predict`

Upload a point cloud for classification.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `file` (`.txt` format, each line: `X Y Z`)

**Response:**
```json
{
  "predicted_label": "chair",
  "predicted_index": 8,
  "confidence": 94.23
}
```

---

### List Point Clouds

**GET** `/api/pointclouds`

Returns all point clouds grouped by status.

**Response:**
```json
{
  "ready": [
    ["building_scan", null, "Office building"],
    ["landscape", null, "Outdoor terrain"]
  ],
  "processing": [
    ["new_scan", null, "Processing..."]
  ],
  "failed": [
    ["bad_file", "Conversion error", "Invalid format"]
  ]
}
```

---

### Upload Point Cloud

**POST** `/api/pointclouds/upload`

Queue a LAS/LAZ file for conversion.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `file`: `.laz` or `.las` file
  - `name`: Unique identifier
  - `description`: Optional description

**Response:**
```json
{
  "status": "queued",
  "name": "building_scan"
}
```

---

### Delete Point Cloud

**POST** `/api/pointclouds/delete`

Remove a point cloud and its metadata.

**Request:**
```json
{
  "name": "building_scan"
}
```

**Response:**
```json
{
  "status": "deleted"
}
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Notes

- **PointNet model** is pre-trained on ShapeNet/ModelNet40 (40 object classes)
- **Potree conversion** can take several minutes for large files
- **Development mode** uses volume mounts for hot-reload
- **Production mode** bakes code into images (rebuild required for updates)

---

## License

This project is part of the ITWS Capstone Project - Team 8.

---

## Acknowledgments

- **PointNet**: Qi et al., "PointNet: Deep Learning on Point Sets for 3D Classification and Segmentation"
- **Potree**: High-performance WebGL point cloud renderer
- **ShapeNet/ModelNet40**: 3D object datasets for training

---