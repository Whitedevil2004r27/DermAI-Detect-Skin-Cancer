"use client";

import { motion } from "framer-motion";
import { formatConfidence } from "@/lib/utils";
import RiskBadge from "./RiskBadge";
import { Activity, ShieldCheck } from "lucide-react";

interface PredictionCardProps {
  label: string;
  scientificName: string;
  confidence: number;
  riskLevel: string;
}

export default function PredictionCard({
  label,
  scientificName,
  confidence,
  riskLevel,
}: PredictionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border border-border-visible bg-bg-card p-8 shadow-2xl"
    >
      {/* Background Accent */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent-green/5 blur-3xl" />
      
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-accent-green" />
            <span className="text-xs font-mono uppercase tracking-widest text-text-muted">Analysis Result</span>
          </div>
          <RiskBadge level={riskLevel} />
        </div>

        <div className="space-y-1">
          <h2 className="text-4xl font-bold tracking-tight text-white mb-2">
            {label}
          </h2>
          <p className="text-sm font-mono text-text-secondary italic">
            Scientific: {scientificName}
          </p>
        </div>

        <div className="flex items-end space-x-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Confidence Score</span>
            <span className="text-5xl font-extrabold text-accent-green text-glow-green tabular-nums">
              {formatConfidence(confidence)}
            </span>
          </div>
          
          <div className="mb-2 h-10 w-px bg-border-subtle" />
          
          <div className="flex items-center space-x-2 mb-2 text-text-secondary">
             <ShieldCheck className="h-4 w-4" />
             <span className="text-xs font-medium">Verified by EfficientNet-B7</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
