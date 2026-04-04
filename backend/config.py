import os
import torch
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Model Settings
    MODEL_PATH: str = os.getenv("MODEL_PATH", "model/weights/best_model.pth")
    DEVICE: str = os.getenv("DEVICE", "cuda" if torch.cuda.is_available() else "cpu")
    IMAGE_SIZE: int = 224
    
    # API Settings
    MAX_FILE_SIZE_MB: int = 10
    CORS_ORIGINS: List[str] = ["*"]
    
    # Class Settings (HAM10000)
    CLASS_NAMES: List[str] = ["akiec", "bcc", "bkl", "df", "mel", "nv", "vasc"]
    
    CLASS_LABELS: dict = {
        "akiec": "Actinic Keratosis / Bowen's Disease",
        "bcc": "Basal Cell Carcinoma",
        "bkl": "Benign Keratosis-like Lesions",
        "df": "Dermatofibroma",
        "mel": "Melanoma",
        "nv": "Melanocytic Nevi",
        "vasc": "Vascular Lesions"
    }
    
    RISK_LEVELS: dict = {
        "akiec": "MODERATE",
        "bcc": "HIGH",
        "bkl": "LOW",
        "df": "LOW",
        "mel": "CRITICAL",
        "nv": "BENIGN",
        "vasc": "LOW"
    }

    class Config:
        env_file = ".env"

settings = Settings()
