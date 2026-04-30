import axios from "axios";
import { PredictionResponse } from "@/types/prediction";

/**
 * 🚀 Dynamic API Configuration
 * ----------------------------
 * 1. Local Dev: Uses NEXT_PUBLIC_API_URL from .env.local (http://127.0.0.1:7860)
 * 2. Production: Defaults to the Hugging Face Space AI Engine
 */
const HF_SPACE_URL = "https://ravikumar227-dermai-full-system.hf.space";
let API_BASE = process.env.NEXT_PUBLIC_API_URL || HF_SPACE_URL;

// Force HTTPS for production to avoid Mixed Content errors on Vercel
// But allow HTTP for local development (localhost/127.0.0.1)
if (API_BASE.startsWith("http://") && !API_BASE.includes("localhost") && !API_BASE.includes("127.0.0.1")) {
  API_BASE = API_BASE.replace("http://", "https://");
}

console.log(`[DermAI] API connected to: ${API_BASE}`);

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 90000, // 90 seconds for deep learning inference
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

interface AxiosErrorLike {
  response?: {
    status?: number;
    data?: unknown;
  };
  message?: string;
}

export const predictImage = async (file: File): Promise<PredictionResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await apiClient.post<PredictionResponse>("/api/predict/", formData);
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosErrorLike;
    console.error("[DermAI] Prediction Error:", err.response?.status, err.message, err.response?.data);
    throw error;
  }
};

export const getHeatmap = async (file: File, targetClass?: string): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  if (targetClass) formData.append("target_class", targetClass);

  try {
    const response = await apiClient.post("/api/heatmap/", formData, {
      responseType: "blob",
    });
    return URL.createObjectURL(response.data);
  } catch (error: unknown) {
    const err = error as AxiosErrorLike;
    console.error("[DermAI] Heatmap Error:", err.response?.status, err.message);
    throw error;
  }
};

export const checkHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE}/health/`);
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosErrorLike;
    console.error("[DermAI] Health Check Failed:", err.message);
    return { status: "offline" };
  }
};
