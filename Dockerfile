# --- Stage 1: Build Next.js Frontend ---
FROM node:18-alpine AS builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# --- Stage 2: Unified Runtime ---
FROM python:3.11-slim

# Set environment
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=7860 \
    HOME=/home/user

# Install Node.js (needed for running Next.js server)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN useradd -m -u 1000 user
WORKDIR /app

# Install system dependencies (OpenCV/Torch)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -U pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY --chown=user backend/ ./backend/

# Copy frontend source and build
COPY --chown=user frontend/ ./frontend/
# Ensure the .next folder from builder is preserved if we were doing static, 
# but here we just copy the whole frontend and will run 'npm run start'

# Switch to non-root user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

# Copy startup script
COPY --chown=user start.sh .
RUN chmod +x start.sh

# Expose port
EXPOSE 7860

# Start both services
CMD ["./start.sh"]
