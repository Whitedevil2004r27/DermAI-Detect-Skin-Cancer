from fastapi import APIRouter, File, UploadFile, HTTPException, Request
from PIL import Image
import torch
import torch.nn.functional as F
import io
from schemas.prediction import PredictionResponse, ClassScore
from model.preprocessing import preprocess_image
from config import settings

router = APIRouter()

@router.post("", response_model=PredictionResponse)
async def predict(request: Request, file: UploadFile = File(...)):
    """
    Predict skin cancer class from image.
    """
    # 1. Validate file extension
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid image type. Use JPG or PNG.")
        
    # 2. Validate file size (already configured in config, let's double check here)
    file_content = await file.read()
    if len(file_content) > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
         raise HTTPException(status_code=413, detail=f"File too large. Max {settings.MAX_FILE_SIZE_MB}MB.")
    
    # 3. Load image from bytes
    try:
        pil_image = Image.open(io.BytesIO(file_content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not open image: {str(e)}")
        
    # 4. Preprocess
    image_tensor = preprocess_image(pil_image, settings.IMAGE_SIZE).to(settings.DEVICE)
    model = request.app.state.model
    
    # 5. Inference
    with torch.no_grad():
        logits = model(image_tensor)
        probabilities = F.softmax(logits, dim=1)[0]
        
    # 6. Prepare Response
    predicted_idx = torch.argmax(probabilities).item()
    predicted_class = settings.CLASS_NAMES[predicted_idx]
    
    # Format all scores
    scores = []
    for i, class_name in enumerate(settings.CLASS_NAMES):
        scores.append(ClassScore(
            class_id=class_name,
            label=settings.CLASS_LABELS[class_name],
            confidence=float(probabilities[i]),
            risk_level=settings.RISK_LEVELS[class_name]
        ))
        
    # Sort by confidence descending
    scores.sort(key=lambda x: x.confidence, reverse=True)
    
    return PredictionResponse(
        predicted_class=predicted_class,
        class_label=settings.CLASS_LABELS[predicted_class],
        confidence=float(probabilities[predicted_idx]),
        risk_level=settings.RISK_LEVELS[predicted_class],
        all_predictions=scores
    )
