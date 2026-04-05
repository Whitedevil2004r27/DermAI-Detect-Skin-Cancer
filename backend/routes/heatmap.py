from fastapi import APIRouter, File, UploadFile, HTTPException, Request, Form
from fastapi.responses import StreamingResponse
from PIL import Image
import torch
import io
from model.preprocessing import preprocess_image
from model.gradcam import generate_heatmap
from config import settings

router = APIRouter()

@router.post("")
async def get_heatmap(request: Request, file: UploadFile = File(...), target_class: str = Form(None)):
    """
    Returns Grad-CAM heatmap as a PNG image stream.
    """
    # 1. Validation
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid image type.")
        
    # 2. Open image
    image_content = await file.read()
    try:
        pil_image = Image.open(io.BytesIO(image_content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image error: {e}")
        
    # 3. Preprocess
    image_tensor = preprocess_image(pil_image, settings.IMAGE_SIZE).to(settings.DEVICE)
    model = request.app.state.model
    
    # 4. Target Class Index
    target_idx = None
    if target_class:
        try:
            target_idx = settings.CLASS_NAMES.index(target_class)
        except ValueError:
            pass # Use auto-detection if target class is invalid
            
    # 5. Generate Heatmap
    # model must be in eval mode for Grad-CAM
    heatmap_pil = generate_heatmap(model, image_tensor, target_class=target_idx)
    
    # 6. Stream Response
    img_byte_arr = io.BytesIO()
    heatmap_pil.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)
    
    return StreamingResponse(img_byte_arr, media_type="image/png")
