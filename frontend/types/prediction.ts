export interface ClassScore {
  class_id: string;
  label: string;
  confidence: number;
  risk_level: string;
}

export interface PredictionResponse {
  predicted_class: string;
  class_label: string;
  confidence: number;
  risk_level: string;
  all_predictions: ClassScore[];
}

export interface HealthStatus {
  status: string;
  model_loaded: boolean;
  device: string;
}

export interface CancerInfo {
  label: string;
  scientific_name: string;
  risk_level: string;
  color: string;
  description: string;
  prevalence: string;
  symptoms: string[];
  treatment: string;
  when_to_see_doctor: string;
}
