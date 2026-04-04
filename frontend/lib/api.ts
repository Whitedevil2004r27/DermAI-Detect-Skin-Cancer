import axios from "axios";
import { PredictionResponse } from "@/types/prediction";

// Relative URL for unified hosting (same origin)
const API_BASE = process.env.NEXT_PUBLIC_API_URL || ""; 

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export const predictImage = async (file: File): Promise<PredictionResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.post<PredictionResponse>("/api/predict/", formData);
  return response.data;
};

export const getHeatmap = async (file: File, targetClass?: string): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  if (targetClass) formData.append("target_class", targetClass);
  
  const response = await apiClient.post("/api/heatmap/", formData, {
    responseType: "blob",
  });
  
  return URL.createObjectURL(response.data);
};

export const checkHealth = async () => {
  const response = await axios.get(`${API_BASE}/health/`);
  return response.data;
};
