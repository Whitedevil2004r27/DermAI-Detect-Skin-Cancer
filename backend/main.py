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
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(predict.router, prefix="/api/predict", tags=["Prediction"])
app.include_router(heatmap.router, prefix="/api/heatmap", tags=["Explainability"])
app.include_router(health.router, prefix="/health", tags=["System"])

@app.get("/")
async def root():
    return {
        "message": "DermAI — Skin Cancer Detection API",
        "docs": "/docs",
        "status": "active"
    }

if __name__ == "__main__":
    import uvicorn
    # Final production-ready entry point for local execution
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=False)
