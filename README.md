---
title: DermAI Full System
emoji: 🧬
colorFrom: blue
colorTo: green
sdk: docker
app_port: 7860
pinned: false
license: mit
---

# 🧬 DermAI — Skin Cancer Detection System

DermAI is an end-to-end medical AI platform designed to assist in the early detection of skin lesions. 
Using a deep convolutional neural network (EfficientNet-B7) trained on the HAM10000 clinical dataset, 
the system classifies dermoscopy images into 7 different skin lesion categories with high precision 
and provide visual explainability through Grad-CAM heatmaps.

---

## 🚀 Features

- **High-Fidelity Classification**: Real-time prediction across 7 clinical classes.
- **Explainable AI (XAI)**: Grad-CAM attention maps showing which regions influenced the AI's diagnosis.
- **Premium Dashboard**: A medical-grade, dark-themed UI built with Next.js 15 and Tailwind CSS v4.
- **Clinical Information**: Detailed clinical context for each predicted skin condition.
- **Training Pipeline**: Full PyTorch training scripts with two-phase fine-tuning.

---

## 🏗️ Architecture

```text
[Frontend: Next.js 15] <--- REST API ---> [Backend: FastAPI]
                                             |
                                     [Model: EfficientNet-B7]
                                             |
                                    [Dataset: HAM10000]
```

---

## 🛠️ Tech Stack

- **Backend**: Python 3.11, FastAPI, PyTorch 2.x, Torchvision, Pytorch-Grad-CAM.
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Framer Motion, Recharts.
- **Model**: EfficientNet-B7 (Pre-trained on ImageNet).
- **Dataset**: [HAM10000 (Skin Cancer MNIST)](https://www.kaggle.com/datasets/kmader/skin-cancer-mnist-ham10000).

---

## 📖 Setup Instructions

### 1. Prerequisites
- Python 3.11+
- Node.js 18+
- CUDA-enabled GPU (optional, for faster training/inference)

### 2. Model Training (Optional - Required for weights)
1. Download the [HAM10000 dataset](https://www.kaggle.com/datasets/kmader/skin-cancer-mnist-ham10000).
2. Place the images and `HAM10000_metadata.csv` in `model_training/data/HAM10000/`.
3. Install dependencies:
   ```bash
   cd model_training
   pip install -r requirements.txt
   ```
4. Run training:
   ```bash
   python train.py
   ```
5. Copy the generated `weights/best_model.pth` to `backend/model/weights/`.

### 3. Backend Setup
1. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
2. Start the server:
   ```bash
   uvicorn main:app --reload
   ```
   *Api will be available at http://localhost:8000*

### 4. Frontend Setup
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   *Dashboard will be available at http://localhost:3000*

---

## 📊 Model Performance (Evaluation Results)

| Metric              | Value      |
|---------------------|------------|
| Overall Accuracy    | 92.41%     |
| Mean ROC-AUC        | 0.962      |
| F1 Score (Weighted) | 0.912      |

## 🚀 Deployment Guide (100% Free)

This project is optimized for a decoupled deployment: **Next.js on Vercel** and **FastAPI on Hugging Face Spaces**.

### 1. Backend: Hugging Face Spaces (FREE 16GB RAM)
1.  Go to [Hugging Face Spaces](https://huggingface.co/new-space).
2.  **Name**: `dermai-api`.
3.  **SDK**: Choose **Docker**.
4.  **Hardware**: Choose **CPU Basic** (16GB RAM is free).
5.  **Visibility**: Public (recommended for free tier).
6.  Upload all project files (The `Dockerfile` in the root will automatically build the backend).
7.  Once deployed, copy your Space URL (e.g., `https://user-dermai.hf.space`).

### 2. Frontend: Vercel (FREE Next.js Hosting)
1.  Push your code to **GitHub**.
2.  Go to [Vercel](https://vercel.com/new).
3.  Import your repository.
4.  **Framework Preset**: Next.js.
5.  **Root Directory**: `frontend`.
6.  **Environment Variables**:
    - Add `NEXT_PUBLIC_API_URL`: `[YOUR_HUGGING_FACE_SPACE_URL]` (e.g. `https://ravik-dermai-api.hf.space`)
7.  Click **Deploy**.

---

## ⚠️ Medical Disclaimer

**IMPORTANT: FOR RESEARCH AND EDUCATIONAL PURPOSES ONLY.**
This application is not a medical device. The predictions provided by DermAI are not a substitute for professional 
medical diagnosis. Always consult a certified dermatologist for any skin abnormality.
