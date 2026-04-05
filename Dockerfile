# --- STAGE 1: Build the Next.js Frontend ---
FROM node:18-alpine AS builder-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# --- STAGE 2: Build the FastAPI Backend & Serve Frontend ---
FROM python:3.11-slim

# Create a non-root user (Required for Hugging Face Spaces)
RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

WORKDIR /app

# Set environment
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=7860

# Install system dependencies (must be root)
USER root
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*
USER user

# Copy backend requirements and install
COPY --chown=user backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY --chown=user backend/ .

# Copy the built frontend ('out' folder) from Stage 1 into 'static'
COPY --from=builder-frontend --chown=user /app/frontend/out ./static

# Expose the API and Frontend port (Hugging Face default)
EXPOSE 7860

# Start the unified application
CMD ["python", "main.py"]
