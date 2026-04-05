---
title: DermAI Unified System
emoji: 🧬
colorFrom: blue
colorTo: green
sdk: docker
app_port: 7860
pinned: true
license: mit
---

# 🧬 DermAI — Unified Skin Cancer Detection System

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-success?style=for-the-badge&logo=vercel)](https://derm-ai-detect-skin-cancer.vercel.app/)
[![Hugging%20Face](https://img.shields.io/badge/Model%20Host-Hugging%20Face-yellow?style=for-the-badge&logo=huggingface)](https://huggingface.co/spaces/ravikumar227/dermai-full-system)

DermAI is an institutional-grade medical AI platform for the early detection of skin lesions. This repository contains the **Unified Monolith** version of the system, designed to run both the high-performance AI backend and the premium Next.js frontend within a single high-memory container.

Using an **EfficientNet-B7** neural network trained on the **HAM10000** dataset, DermAI provides rapid classification across 7 skin lesion categories, accompanied by **Grad-CAM heatmaps** for clinical explainability.

---

## 🚀 Key Features

-   **⚡ Unified Monolith**: Frontend and Backend run concurrently in one environment, resolving CORS and latency issues.
-   **🔍 Explainable AI (XAI)**: Real-time Grad-CAM maps highlight the specific pixels influencing the AI's diagnosis.
-   **🔐 Secure Authentication**: Integrated **Google OAuth 2.0** for clinical session management.
-   **📁 Dynamic Result History**: Each scan generates a unique Case ID with a dedicated persistent URL (`/result/[id]`).
-   **🎨 Premium UI**: A glassmorphic, medical-grade dashboard built with **Next.js 15** and **Tailwind CSS v4**.
-   **📄 Clinical Reports**: Auto-generation of diagnostic PDF reports for patient records.

---

## 🏗️ Architecture: The "Super Container"

DermAI utilizes a dual-process architecture managed by a single Docker entry point:

1.  **Entry Point (Port 7860)**: Next.js Frontend (Production Server).
2.  **API Proxy (Port 8000)**: FastAPI Backend (AI Inference Engine).
3.  **Process Manager**: `start.sh` orchestrates the simultaneous execution of both services.

---

## 🛠️ Tech Stack

-   **AI Core**: Python 3.11, PyTorch 2.x, Torchvision, Pytorch-Grad-CAM.
-   **Backend**: FastAPI (High-performance asynchronous API).
-   **Frontend**: Next.js 15 (App Router), TypeScript, Framer Motion, Recharts.
-   **Styling**: Tailwind CSS v4 (Modern performance-first CSS).
-   **Auth**: NextAuth.js (Secure Google OAuth Integration).

---

## 📊 AI Model Performance

| Metric              | Value      |
|---------------------|------------|
| Overall Accuracy    | 92.41%     |
| Mean ROC-AUC        | 0.962      |
| F1 Score (Weighted) | 0.912      |

---

## 🚀 Deployment Guide (Hugging Face Spaces)

This system is optimized for **Hugging Face Spaces** with at least **16GB RAM** (CPU Basic tier).

### 1. Configure Secrets
In your Hugging Face Space **Settings > Variables and Secrets**, add the following:

| Secret Key             | Description                                     |
|------------------------|-------------------------------------------------|
| `AUTH_GOOGLE_ID`       | Your Google Cloud OAuth Client ID               |
| `AUTH_GOOGLE_SECRET`   | Your Google Cloud OAuth Client Secret           |
| `NEXTAUTH_SECRET`      | A random string for session encryption          |
| `NEXTAUTH_URL`         | Your Space URL (e.g., `https://user-space.hf.space`) |
| `AUTH_TRUST_HOST`      | Set to `true`                                  |

### 2. Push to Space
Simply push this repository to your Hugging Face remote:
```bash
git remote add hf https://huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE_NAME
git push hf main
```

---

## 💻 Local Development

### 1. Prerequisites
- Python 3.11+
- Node.js 18+

### 2. Quick Start
1.  **Install Frontend Deps**: `cd frontend && npm install`
2.  **Install Backend Deps**: `cd backend && pip install -r requirements.txt`
3.  **Run Monolith locally**:
    ```bash
    chmod +x start.sh
    ./start.sh
    ```
    *The system will be available at http://localhost:7860 (and API at :8000)*

---

## ⚠️ Medical Disclaimer

**IMPORTANT: FOR RESEARCH AND EDUCATIONAL PURPOSES ONLY.**
DermAI is a predictive tool designed to assist in clinical evaluation. It is **not** a replacement for professional medical diagnosis. A full bioptical evaluation by a board-certified dermatologist remains the clinical standard.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
