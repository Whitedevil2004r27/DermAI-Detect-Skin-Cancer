from dataclasses import dataclass, field
from typing import List

@dataclass
class Config:
    # Data Paths
    DATA_DIR: str = "model_training/data/HAM10000"
    METADATA_CSV: str = "HAM10000_metadata.csv"
    MODEL_SAVE_DIR: str = "backend/model/weights"
    
    # Training Hyperparameters
    BATCH_SIZE: int = 32
    NUM_EPOCHS: int = 30
    LR_HEAD: float = 1e-3         # Learning rate for the custom head
    LR_BACKBONE: float = 1e-5     # Learning rate for the backbone (fine-tuning)
    FREEZE_EPOCHS: int = 5        # Epochs to train only the head before unfreezing
    
    # Image Settings
    IMAGE_SIZE: int = 224
    NUM_CLASSES: int = 7
    
    # Regularization
    DROPOUT_1: float = 0.4
    DROPOUT_2: float = 0.3
    
    # Hardware
    DEVICE: str = "cuda"
    SEED: int = 42
    
    # Optimization
    EARLY_STOPPING_PATIENCE: int = 7
    
    # Labels
    CLASS_NAMES: List[str] = field(default_factory=lambda: [
        "akiec", "bcc", "bkl", "df", "mel", "nv", "vasc"
    ])

config = Config()
