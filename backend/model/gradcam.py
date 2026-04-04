import torch
import torch.nn as nn
import numpy as np
from PIL import Image
import cv2
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget

def generate_heatmap(model: nn.Module, image_tensor: torch.Tensor, target_class: int = None) -> Image.Image:
    """
    Generate Grad-CAM heatmap overlaid on original image.
    Targets the last layer of the features (backbone).
    """
    # Define target layer: model.backbone[-1]
    target_layers = [model.backbone[-1]]
    
    # Initialize implementation
    cam = GradCAM(model=model, target_layers=target_layers)
    
    # Target class logic
    if target_class is None:
        outputs = model(image_tensor)
        target_class = torch.argmax(outputs, dim=1).item()
        
    targets = [ClassifierOutputTarget(target_class)]
    
    # Generate grayscale CAM heatmap
    grayscale_cam = cam(input_tensor=image_tensor, targets=targets)
    grayscale_cam = grayscale_cam[0, :]
    
    # Original image for overlay (normalized back to [0,1])
    # image_tensor is [1, 3, 224, 224], normalized
    # For visualization, we convert it back to numpy
    img_np = image_tensor.squeeze(0).permute(1, 2, 0).cpu().numpy()
    
    # Inverse normalization
    mean = np.array([0.485, 0.456, 0.406])
    std = np.array([0.229, 0.224, 0.225])
    img_np = (img_np * std) + mean
    img_np = np.clip(img_np, 0, 1)
    
    # Overlay heatmap
    visualization = show_cam_on_image(img_np, grayscale_cam, use_rgb=True)
    
    return Image.fromarray(visualization)
