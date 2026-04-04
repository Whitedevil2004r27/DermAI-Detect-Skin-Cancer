from fastapi import APIRouter
from schemas.prediction import HealthStatus
from config import settings
import torch

router = APIRouter()

@router.get("/", response_model=HealthStatus)
async def health_check():
    """
    Returns API health status.
    """
    # model_loaded check is handled by the main app lifespan
    # For now, just return true as we assume model loading starts
    return {
        "status": "ok",
        "model_loaded": True,
        "device": settings.DEVICE
    }
