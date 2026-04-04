import torch
import torch.nn as nn
from torchvision.models import efficientnet_b7, EfficientNet_B7_Weights

class SkinCancerModel(nn.Module):
    """
    Skin Cancer classification model based on EfficientNet-B7.
    """
    def __init__(self, num_classes: int = 7):
        super(SkinCancerModel, self).__init__()
        
        # Load pre-trained EfficientNet-B7
        self.model = efficientnet_b7(weights=EfficientNet_B7_Weights.IMAGENET1K_V1)
        
        # Features extractor (backbone)
        self.backbone = self.model.features
        
        # Global Average Pooling
        self.pool = nn.AdaptiveAvgPool2d(1)
        
        # New classifier head
        # EfficientNet-B7 features output is 2560
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(2560, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(),
            nn.Dropout(0.4),
            nn.Linear(512, 256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, num_classes)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.backbone(x)
        x = self.pool(x)
        x = self.classifier(x)
        return x

def load_model(path: str, device: str = "cpu") -> nn.Module:
    """
    Loads model weights from a specified path and puts it in evaluation mode.
    If weights file is missing, initializes from pre-trained ImageNet.
    """
    model = SkinCancerModel(num_classes=7)
    
    try:
        import os
        if path and os.path.exists(path):
            if torch.cuda.is_available() and device == "cuda":
                 state_dict = torch.load(path)
            else:
                 state_dict = torch.load(path, map_location=torch.device('cpu'))
                 
            model.load_state_dict(state_dict)
            print(f"Model loaded successfully from {path}")
        else:
            print(f"Warning: Model weights not found at {path}. System will run in DEMO mode with random head weights.")
    except Exception as e:
        print(f"Error loading model: {e}")
        
    model.to(device)
    model.eval()
    return model
