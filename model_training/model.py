import torch
import torch.nn as nn
from torchvision.models import efficientnet_b7, EfficientNet_B7_Weights

class DermAIModel(nn.Module):
    """
    EfficientNet-B7 based skin cancer classification model.
    """
    def __init__(self, num_classes: int = 7, dropout_1: float = 0.4, dropout_2: float = 0.3):
        super(DermAIModel, self).__init__()
        
        # Load pre-trained weights
        self.base_model = efficientnet_b7(weights=EfficientNet_B7_Weights.IMAGENET1K_V1)
        
        # Split into backbone (features) and original classifier
        self.backbone = self.base_model.features
        self.pool = nn.AdaptiveAvgPool2d(1)
        
        # Custom head for HAM10000 classification
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(2560, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(),
            nn.Dropout(dropout_1),
            nn.Linear(512, 256),
            nn.ReLU(),
            nn.Dropout(dropout_2),
            nn.Linear(256, num_classes)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.backbone(x)
        x = self.pool(x)
        x = self.classifier(x)
        return x

    def freeze_backbone(self):
        """
        Freeze all backbone parameters for the first stage of training.
        """
        for param in self.backbone.parameters():
            param.requires_grad = False

    def unfreeze_backbone(self, last_n_blocks: int = 3):
        """
        Unfreeze the entire backbone or specifically the last N blocks.
        For now, unfreezes EVERYTHING to allow full fine-tuning.
        """
        for param in self.backbone.parameters():
            param.requires_grad = True
            
        print(f"Backbone unfrozen for full fine-tuning.")
