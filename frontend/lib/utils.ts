import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatConfidence(confidence: number): string {
  return (confidence * 100).toFixed(1) + "%";
}

export function getRiskColor(level: string): string {
  switch (level.toUpperCase()) {
    case "CRITICAL": return "text-accent-red border-accent-red/20 bg-accent-red/10";
    case "HIGH": return "text-accent-orange border-accent-orange/20 bg-accent-orange/10";
    case "MODERATE": return "text-accent-yellow border-accent-yellow/20 bg-accent-yellow/10";
    case "LOW": return "text-accent-blue border-accent-blue/20 bg-accent-blue/10";
    case "BENIGN": return "text-accent-green border-accent-green/20 bg-accent-green/10";
    default: return "text-text-muted border-border-subtle bg-bg-secondary";
  }
}
