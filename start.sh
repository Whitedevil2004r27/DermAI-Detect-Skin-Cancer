#!/bin/bash

# Check for Google Auth Credentials
if [ -z "$AUTH_GOOGLE_ID" ] || [ -z "$AUTH_GOOGLE_SECRET" ]; then
    echo "WARNING: AUTH_GOOGLE_ID or AUTH_GOOGLE_SECRET not set. Google Login might fail."
fi

# Start FastAPI Backend on port 7860 (Hugging Face default public port)
echo "Starting DermAI Backend API on port 7860..."
export PORT=7860
python backend/main.py
