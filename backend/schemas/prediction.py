from pydantic import BaseModel
from typing import List

class ClassScore(BaseModel):
    class_id: str
    label: str
    confidence: float
    risk_level: str

class PredictionResponse(BaseModel):
    predicted_class: str
    class_label: str
    confidence: float
    risk_level: str
    all_predictions: List[ClassScore]

class HealthStatus(BaseModel):
    status: str
    model_loaded: bool
    device: str
