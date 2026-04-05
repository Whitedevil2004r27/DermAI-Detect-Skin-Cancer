import axios from "axios";
import { PredictionResponse } from "@/types/prediction";

// Relative URL for unified hosting (same origin)
// Direct Hugging Face Space URL to bypass Vercel's 10s proxy timeout
const HF_SPACE_URL = "https://ravikumar227-dermai-full-system.hf.space";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || HF_SPACE_URL; 

console.log(`[DermAI] API connected to: ${API_BASE}`);

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 90000, // 90 seconds for deep learning + cold starts
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export const predictImage = async (file: File): Promise<PredictionResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await apiClient.post<PredictionResponse>("/api/predict", formData);
    return response.data;
  } catch (error: unknown) {
    const err = error as any;
    console.error("[DermAI] Prediction Error:", err.response?.status, err.message, err.response?.data);
    throw error;
  }
};

export const getHeatmap = async (file: File, targetClass?: string): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  if (targetClass) formData.append("target_class", targetClass);
  
  try {
    const response = await apiClient.post("/api/heatmap", formData, {
      responseType: "blob",
    });
    return URL.createObjectURL(response.data);
  } catch (error: unknown) {
    const err = error as any;
    console.error("[DermAI] Heatmap Error:", err.response?.status, err.message);
    throw error;
  }
};

export const checkHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE}/health`);
    return response.data;
  } catch (error: unknown) {
    const err = error as any;
    console.error("[DermAI] Health Check Failed:", err.message);
    return { status: "offline" };
  }
};
