import torch
import torchvision.transforms as transforms
from PIL import Image

def get_inference_transform(image_size: int = 224):
    """
    Returns the transformation pipeline for model inference.
    Equivalent to validation transforms: Resize, ToTensor, Normalize.
    """
    return transforms.Compose([
        transforms.Resize((image_size, image_size)),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406], 
            std=[0.229, 0.224, 0.225]
        )
    ])

def preprocess_image(pil_image: Image.Image, image_size: int = 224) -> torch.Tensor:
    """
    Apply necessary transforms to a PIL image and return a batch-dimensioned tensor.
    """
    # Ensure image is RGB
    if pil_image.mode != "RGB":
        pil_image = pil_image.convert("RGB")
        
    transform = get_inference_transform(image_size)
    image_tensor = transform(pil_image)
    
    # Add batch dimension [1, 3, 224, 224]
    return image_tensor.unsqueeze(0)
