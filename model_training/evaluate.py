import os
import torch
import torch.nn as nn
import pandas as pd
import numpy as np
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, roc_curve
from torch.utils.data import DataLoader
from config import config
from dataset import HAM10000Dataset
from transforms import get_val_transforms
from model import DermAIModel
import seaborn as sns
import matplotlib.pyplot as plt

def plot_confusion_matrix(y_true, y_pred, labels):
    cm = confusion_matrix(y_true, y_pred)
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=labels, yticklabels=labels)
    plt.xlabel('Predicted'); plt.ylabel('Actual')
    plt.title('Confusion Matrix')
    plt.savefig('confusion_matrix.png')
    print("Confusion Matrix saved to confusion_matrix.png")

def main():
    device = torch.device(config.DEVICE if torch.cuda.is_available() else "cpu")
    
    # 1. Load Data
    print("Loading test data...")
    csv_path = os.path.join(config.DATA_DIR, config.METADATA_CSV)
    df = pd.read_csv(csv_path)
    # Using the same split as training for evaluation context
    from sklearn.model_selection import train_test_split
    _, test_df = train_test_split(df, test_size=0.15, stratify=df['dx'], random_state=config.SEED)
    
    test_dataset = HAM10000Dataset(test_df, config.DATA_DIR, transform=get_val_transforms(config.IMAGE_SIZE))
    loader = DataLoader(test_dataset, batch_size=config.BATCH_SIZE, shuffle=False)
    
    # 2. Load Model
    print(f"Loading best weights from weights/best_model.pth...")
    model = DermAIModel(num_classes=config.NUM_CLASSES)
    model.load_state_dict(torch.load("weights/best_model.pth"))
    model.to(device)
    model.eval()
    
    # 3. Model Predictions
    all_preds = []; all_labels = []; all_probs = []
    
    with torch.no_grad():
        for images, labels in loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            probs = torch.softmax(outputs, dim=1)
            _, preds = torch.max(outputs, 1)
            
            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())
            all_probs.extend(probs.cpu().numpy())
            
    # 4. Evaluation
    print("\n--- Classification Report ---")
    print(classification_report(all_labels, all_preds, target_names=config.CLASS_NAMES))
    
    # Plot CM
    plot_confusion_matrix(all_labels, all_preds, config.CLASS_NAMES)
    
    # Calculate ROC-AUC
    # ROC-AUC is one-vs-rest
    auc_score = roc_auc_score(all_labels, all_probs, multi_class='ovr')
    print(f"\nOverall ROC-AUC Score: {auc_score:.4f}")

if __name__ == "__main__":
    main()
