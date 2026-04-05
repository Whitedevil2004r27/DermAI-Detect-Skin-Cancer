"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { PredictionResponse } from "@/types/prediction";
import { CANCER_INFO } from "@/lib/constants";
import PredictionCard from "@/components/PredictionCard";
import ConfidenceChart from "@/components/ConfidenceChart";
import HeatmapOverlay from "@/components/HeatmapOverlay";
import CancerInfoCard from "@/components/CancerInfoCard";
import { 
  ArrowLeft, 
  RotateCcw, 
  Download, 
  Share2,
  AlertCircle,
  ClipboardCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getHeatmap } from "@/lib/api";
import { generatePDF } from "@/components/ReportGenerator";
import ABCDEModal from "@/components/ABCDEModal";
import { useHistory } from "@/hooks/useHistory";

export default function DynamicResultPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { history, getEntryById } = useHistory();
  
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [heatmapSrc, setHeatmapSrc] = useState<string | null>(null);
  const [isHeatmapLoading, setIsHeatmapLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [auditScore, setAuditScore] = useState<number | null>(null);

  useEffect(() => {
    // Wait for history to load
    if (history.length === 0) return;

    const entry = getEntryById(id);
    if (!entry) {
      router.push("/");
      return;
    }

    setPrediction(entry.prediction);
    setImageSrc(entry.image);

    const loadHeatmap = async () => {
      try {
        const response = await fetch(entry.image);
        const blob = await response.blob();
        const file = new File([blob], "lesion.jpg", { type: "image/jpeg" });
        
        const hmUrl = await getHeatmap(file, entry.prediction.predicted_class);
        setHeatmapSrc(hmUrl);
      } catch (err) {
        console.error("Heatmap loading failed:", err);
        setError("AI Visualization failed to load. The diagnostic data is still valid.");
      } finally {
        setIsHeatmapLoading(false);
      }
    };

    loadHeatmap();
  }, [id, history, getEntryById, router]);

  const handleExport = async () => {
    if (prediction) {
      await generatePDF("diagnostic-content", prediction, id);
    }
  };

  if (!prediction || !imageSrc) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
         <div className="text-center space-y-4">
            <Activity className="h-12 w-12 text-accent-green animate-spin mx-auto opacity-20" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Loading Case: {id}</p>
         </div>
      </div>
    );
  }

  const info = CANCER_INFO[prediction.predicted_class];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0"
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push("/")}
            className="group flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-text-muted transition-colors hover:text-accent-green"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>New Analysis</span>
          </button>
          <div className="h-4 w-px bg-border-subtle" />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-muted">
             CASE_ID: {id}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={handleExport}
            className="flex items-center space-x-2 rounded-xl border border-border-visible bg-bg-card px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-text-secondary transition-all hover:bg-bg-hover hover:-translate-y-0.5"
          >
            <Download className="h-4 w-4 text-accent-green" />
            <span>Export Report</span>
          </button>
          <div className="h-8 w-px bg-border-subtle hidden sm:block" />
          <button className="flex items-center space-x-2 rounded-xl border border-accent-green/20 bg-accent-green/10 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-accent-green transition-all hover:bg-accent-green/20 hover:-translate-y-0.5 shadow-lg shadow-accent-green/5">
            <Share2 className="h-4 w-4" />
            <span>Share Case</span>
          </button>
        </div>
      </motion.div>

      <div id="diagnostic-content" className="grid grid-cols-1 gap-12 lg:grid-cols-12 bg-bg-primary p-4 rounded-[2rem]">
        {/* Same Layout as original result page */}
        <div className="flex flex-col space-y-8 lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <PredictionCard
              label={prediction.class_label}
              scientificName={info.scientific_name}
              confidence={prediction.confidence}
              riskLevel={prediction.risk_level}
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-border-subtle bg-bg-card/30 p-8 shadow-xl backdrop-blur-md"
          >
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted mb-8 border-b border-border-subtle pb-4">
              Diagnostic Probabilities
            </h4>
            <ConfidenceChart data={prediction.all_predictions} />
          </motion.div>

          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between px-2">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Clinical Tools</h4>
              {auditScore !== null && (
                <div className="flex items-center space-x-2 rounded-full bg-accent-blue/10 px-3 py-1 text-[10px] font-bold text-accent-blue border border-accent-blue/20">
                  <ClipboardCheck className="h-3 w-3" />
                  <span>Audit: {auditScore}/5</span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => router.push("/")}
                className="relative overflow-hidden flex flex-col items-center justify-center p-8 rounded-3xl border border-border-subtle bg-bg-card/50 hover:bg-bg-hover transition-all group"
              >
                <RotateCcw className="h-6 w-6 text-accent-purple mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Restart</span>
                <div className="absolute inset-0 bg-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button 
                onClick={() => setIsAuditOpen(true)}
                className="relative overflow-hidden flex flex-col items-center justify-center p-8 rounded-3xl border border-border-subtle bg-bg-card/50 hover:bg-bg-hover transition-all group"
              >
                <AlertCircle className={`h-6 w-6 mb-3 group-hover:scale-110 transition-transform ${auditScore !== null ? 'text-accent-green' : 'text-accent-orange'}`} />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Clinical Audit</span>
                <div className="absolute inset-0 bg-accent-orange/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-8 lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl border border-border-visible bg-bg-card p-1 shadow-2xl overflow-hidden ring-1 ring-white/10"
          >
            <div className="bg-bg-secondary p-8 rounded-[1.4rem]">
              <HeatmapOverlay
                originalImage={imageSrc}
                heatmapImage={heatmapSrc}
                isLoading={isHeatmapLoading}
              />
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 flex items-center space-x-3 rounded-2xl border border-accent-orange/20 bg-accent-orange/5 p-4 text-[10px] font-black uppercase tracking-widest text-accent-orange"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CancerInfoCard classId={prediction.predicted_class} />
          </motion.div>
        </div>
      </div>

      <ABCDEModal 
        isOpen={isAuditOpen} 
        onClose={() => setIsAuditOpen(false)} 
        onComplete={(score) => setAuditScore(score)}
      />
    </div>
  );
}

import { Activity } from "lucide-react";
