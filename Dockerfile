# --- STAGE 1: Build the Next.js Frontend ---
FROM node:20-alpine AS builder-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# --- STAGE 2: Build the FastAPI Backend & Serve Frontend ---
FROM python:3.11-slim

# Set environment
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=7860 \
    HOME=/home/user

# Create a non-root user
RUN useradd -m -u 1000 user
WORKDIR /app

# Install system dependencies and build tools (as root)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3-dev \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Install requirements as root to avoid permission issues in site-packages
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -U pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY --chown=user backend/ .

# Copy the built frontend ('out' folder) from Stage 1 into 'static'
COPY --from=builder-frontend --chown=user /app/frontend/out ./static

# Switch to non-root user for final execution
USER user
ENV PATH="/home/user/.local/bin:$PATH"

# Expose the API and Frontend port
EXPOSE 7860

# Start the unified application
CMD ["python", "main.py"]
