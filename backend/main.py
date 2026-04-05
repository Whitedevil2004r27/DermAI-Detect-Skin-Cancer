from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from routes import predict, heatmap, health
from config import settings
from model.efficientnet import load_model

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Life-cycle manager for FastAPI: Loads model on startup to app state.
    """
    print(f"Loading DermAI model on {settings.DEVICE}...")
    # Load model and store in app state
    model = load_model(settings.MODEL_PATH, settings.DEVICE)
    app.state.model = model
    print("Model initialized and ready for inference.")
    yield
    # Clean up model if needed
    del app.state.model

app = FastAPI(
    title="DermAI — Skin Cancer Detection API",
    description="Early detection of skin cancer using EfficientNet-B7 and Grad-CAM explainability.",
    version="1.0.0",
    redirect_slashes=False,
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(predict.router, prefix="/api/predict", tags=["Prediction"])
app.include_router(heatmap.router, prefix="/api/heatmap", tags=["Explainability"])
app.include_router(health.router, prefix="/health", tags=["System"])

# API Info Route
@app.get("/")
async def root():
    return {
        "name": "DermAI — Skin Cancer Detection API",
        "description": "EfficientNet-B7 Based Diagnosis",
        "endpoints": {
            "predict": "/api/predict",
            "heatmap": "/api/heatmap",
            "health": "/health",
            "docs": "/docs"
        },
        "version": "1.0.0",
        "status": "online"
    }

if __name__ == "__main__":
    import uvicorn
    import os
    
    # Dynamic port binding for cloud platforms (Hugging Face default 7860)
    port = int(os.getenv("PORT", 7860))
    
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
