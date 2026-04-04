import os
import torch
import torch.nn as nn
from PIL import Image
import numpy as np
import cv2
import argparse
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
from model import DermAIModel
from config import config

def get_gradcam(model, image_tensor, target_idx=None):
    # Target the last layer of features
    target_layers = [model.backbone[-1]]
    
    # Init CAM
    cam = GradCAM(model=model, target_layers=target_layers)
    
    # Auto-target if needed
    if target_idx is None:
        outputs = model(image_tensor)
        probabilities = torch.softmax(outputs, dim=1)
        target_idx = torch.argmax(probabilities).item()
        
    targets = [ClassifierOutputTarget(target_idx)]
    
    # Generate heatmap
    grayscale_cam = cam(input_tensor=image_tensor, targets=targets)
    grayscale_cam = grayscale_cam[0, :]
    
    # Raw Image for visualization (Normalized back)
    img_np = image_tensor.squeeze(0).permute(1, 2, 0).cpu().numpy()
    mean = np.array([0.485, 0.456, 0.406])
    std = np.array([0.229, 0.224, 0.225])
    img_np = (img_np * std) + mean
    img_np = np.clip(img_np, 0, 1)
    
    # Blend
    visualization = show_cam_on_image(img_np, grayscale_cam, use_rgb=True)
    return visualization, config.CLASS_NAMES[target_idx]

def main():
    parser = argparse.ArgumentParser(description="Test Grad-CAM on a skin lesion image.")
    parser.add_argument("--image", type=str, required=True, help="Path to input image.")
    parser.add_argument("--weights", type=str, default="weights/best_model.pth", help="Path to weights.")
    parser.add_argument("--output", type=str, default="gradcam_result.png", help="Path to output image.")
    args = parser.parse_args()
    
    device = torch.device(config.DEVICE if torch.cuda.is_available() else "cpu")
    
    # 1. Load Model
    print(f"Loading weights from {args.weights}...")
    model = DermAIModel(num_classes=7)
    model.load_state_dict(torch.load(args.weights, map_location=device))
    model.to(device)
    model.eval()
    
    # 2. Load Image
    print(f"Processing {args.image}...")
    img = Image.open(args.image).convert("RGB").resize((224, 224))
    img_arr = np.array(img).astype(np.float32) / 255.0
    
    # Normalize
    mean = [0.485, 0.456, 0.406]
    std = [0.229, 0.224, 0.225]
    img_arr = (img_arr - mean) / std
    image_tensor = torch.from_numpy(img_arr).permute(2, 0, 1).unsqueeze(0).to(device)
    
    # 3. Generate CAM
    visualization, predicted_class = get_gradcam(model, image_tensor)
    
    # 4. Save Side-by-Side
    original = np.array(img)
    combined = np.hstack((original, visualization))
    cv2.imwrite(args.output, cv2.cvtColor(combined, cv2.COLOR_RGB2BGR))
    
    print(f"Predicted Class: {predicted_class}")
    print(f"Result saved to {args.output}")

if __name__ == "__main__":
    main()
    # Usage: python gradcam_test.py --image test.jpg --weights weights/best_model.pth
