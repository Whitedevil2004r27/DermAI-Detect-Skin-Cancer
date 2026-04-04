import os
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, WeightedRandomSampler
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from config import config
from dataset import HAM10000Dataset
from transforms import get_train_transforms, get_val_transforms
from model import DermAIModel
import copy
import matplotlib.pyplot as plt

def calculate_class_weights(df):
    """
    Calculate inverse class frequencies for WeightedRandomSampler.
    """
    class_counts = df['dx'].value_counts().sort_index()
    weights = 1.0 / torch.tensor(class_counts.values, dtype=torch.float)
    return weights

def train_one_epoch(model, loader, criterion, optimizer, device):
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0
    
    for images, labels in loader:
        images, labels = images.to(device), labels.to(device)
        
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        
        running_loss += loss.item() * images.size(0)
        _, predicted = torch.max(outputs, 1)
        total += labels.size(0)
        correct += (predicted == labels).sum().item()
        
    return running_loss / total, correct / total

def validate(model, loader, criterion, device):
    model.eval()
    running_loss = 0.0
    correct = 0
    total = 0
    
    with torch.no_grad():
        for images, labels in loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)
            
            running_loss += loss.item() * images.size(0)
            _, predicted = torch.max(outputs, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
            
    return running_loss / total, correct / total

def main():
    # 1. Setup
    torch.manual_seed(config.SEED)
    device = torch.device(config.DEVICE if torch.cuda.is_available() else "cpu")
    os.makedirs(config.MODEL_SAVE_DIR, exist_ok=True)
    
    # 2. Data Loading
    print("Loading HAM10000 metadata...")
    csv_path = os.path.join(config.DATA_DIR, config.METADATA_CSV)
    if not os.path.exists(csv_path):
        print(f"Error: {csv_path} not found. Please download HAM10000 from Kaggle.")
        return

    df = pd.read_csv(csv_path)
    train_df, val_df = train_test_split(df, test_size=0.15, stratify=df['dx'], random_state=config.SEED)
    
    # 3. Datasets & Samplers
    train_dataset = HAM10000Dataset(train_df, config.DATA_DIR, transform=get_train_transforms(config.IMAGE_SIZE))
    val_dataset = HAM10000Dataset(val_df, config.DATA_DIR, transform=get_val_transforms(config.IMAGE_SIZE))
    
    # Handle Class Imbalance with WeightedRandomSampler
    weights = calculate_class_weights(train_df)
    sample_weights = [weights[train_dataset.label_map[row['dx']]] for _, row in train_df.iterrows()]
    sampler = WeightedRandomSampler(sample_weights, len(sample_weights))
    
    train_loader = DataLoader(train_dataset, batch_size=config.BATCH_SIZE, sampler=sampler, num_workers=4)
    val_loader = DataLoader(val_dataset, batch_size=config.BATCH_SIZE, shuffle=False, num_workers=4)
    
    # 4. Initialize Model & Criterion
    print(f"Initializing EfficientNet-B7 on {device}...")
    model = DermAIModel(num_classes=config.NUM_CLASSES).to(device)
    criterion = nn.CrossEntropyLoss()
    
    # 5. Phase 1: Train Head ONLY
    print(f"\n--- Phase 1: Training classifier head for {config.FREEZE_EPOCHS} epochs ---")
    model.freeze_backbone()
    optimizer_head = optim.Adam(model.classifier.parameters(), lr=config.LR_HEAD)
    
    best_loss = float('inf')
    history = {'train_loss': [], 'val_loss': [], 'train_acc': [], 'val_acc': []}
    
    for epoch in range(config.FREEZE_EPOCHS):
        t_loss, t_acc = train_one_epoch(model, train_loader, criterion, optimizer_head, device)
        v_loss, v_acc = validate(model, val_loader, criterion, device)
        
        print(f"Epoch {epoch+1}/{config.FREEZE_EPOCHS} | Train Loss: {t_loss:.4f}, Acc: {t_acc:.4f} | Val Loss: {v_loss:.4f}, Acc: {v_acc:.4f}")
        history['train_loss'].append(t_loss); history['val_loss'].append(v_loss)
        history['train_acc'].append(t_acc); history['val_acc'].append(v_acc)

    # 6. Phase 2: Fine-tune Backbone
    print(f"\n--- Phase 2: Unfreezing backbone for fine-tuning ---")
    model.unfreeze_backbone()
    # Use differential learning rates: slower for backbone, slightly faster for head
    optimizer_full = optim.Adam([
        {'params': model.backbone.parameters(), 'lr': config.LR_BACKBONE},
        {'params': model.classifier.parameters(), 'lr': config.LR_HEAD / 10}
    ])
    
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer_full, T_max=config.NUM_EPOCHS - config.FREEZE_EPOCHS)
    
    patience_counter = 0
    best_model_wts = copy.deepcopy(model.state_dict())
    
    for epoch in range(config.FREEZE_EPOCHS, config.NUM_EPOCHS):
        t_loss, t_acc = train_one_epoch(model, train_loader, criterion, optimizer_full, device)
        v_loss, v_acc = validate(model, val_loader, criterion, device)
        scheduler.step()
        
        print(f"Epoch {epoch+1}/{config.NUM_EPOCHS} | Train Loss: {t_loss:.4f}, Acc: {t_acc:.4f} | Val Loss: {v_loss:.4f}, Acc: {v_acc:.4f}")
        history['train_loss'].append(t_loss); history['val_loss'].append(v_loss)
        history['train_acc'].append(t_acc); history['val_acc'].append(v_acc)
        
        if v_loss < best_loss:
            best_loss = v_loss
            best_model_wts = copy.deepcopy(model.state_dict())
            torch.save(best_model_wts, os.path.join(config.MODEL_SAVE_DIR, "best_model.pth"))
            patience_counter = 0
        else:
            patience_counter += 1
            if patience_counter >= config.EARLY_STOPPING_PATIENCE:
                print("Early stopping triggered.")
                break
                
    # 7. Finalize
    print("\nTraining Complete. Best Validation Loss:", best_loss)
    
    # Plot results
    plt.figure(figsize=(12, 5))
    plt.subplot(1, 2, 1)
    plt.plot(history['train_loss'], label='Train')
    plt.plot(history['val_loss'], label='Val')
    plt.title('Loss Curves'); plt.legend()
    
    plt.subplot(1, 2, 2)
    plt.plot(history['train_acc'], label='Train')
    plt.plot(history['val_acc'], label='Val')
    plt.title('Accuracy Curves'); plt.legend()
    
    plt.savefig('training_curves.png')
    print("Training curves saved to training_curves.png")

if __name__ == "__main__":
    main()
