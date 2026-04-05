#!/bin/bash

# Check for Google Auth Credentials
if [ -z "$AUTH_GOOGLE_ID" ] || [ -z "$AUTH_GOOGLE_SECRET" ]; then
    echo "WARNING: AUTH_GOOGLE_ID or AUTH_GOOGLE_SECRET not set. Google Login might fail."
fi

# Start FastAPI Backend on port 8000
echo "Starting FastAPI Backend..."
python backend/main.py &

# Wait for backend to be ready
echo "Waiting for backend to start..."
sleep 5

# Start Next.js Frontend on port 7860 (Hugging Face default)
echo "Starting Next.js Frontend on port 7860..."
cd frontend && npm run start -- -p 7860
