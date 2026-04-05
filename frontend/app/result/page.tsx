"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function ResultPage() {
  const router = useRouter();
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [heatmapSrc, setHeatmapSrc] = useState<string | null>(null);
  const [isHeatmapLoading, setIsHeatmapLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [caseId, setCaseId] = useState("");
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [auditScore, setAuditScore] = useState<number | null>(null);
  const { addToHistory } = useHistory();

  useEffect(() => {
    const storedPrediction = sessionStorage.getItem("last_prediction");
    const storedImage = sessionStorage.getItem("last_image");

    if (!storedPrediction || !storedImage) {
      router.push("/");
      return;
    }

    const parsedPrediction = JSON.parse(storedPrediction) as PredictionResponse;
    setPrediction(parsedPrediction);
    setImageSrc(storedImage);

    // Generate or retrieve Case ID
    let currentCaseId = sessionStorage.getItem("current_case_id");
    if (!currentCaseId) {
      currentCaseId = Math.random().toString(36).substring(7).toUpperCase();
      sessionStorage.setItem("current_case_id", currentCaseId);
      // Auto-save to history on first load
      addToHistory(parsedPrediction, storedImage);
    }
    setCaseId(currentCaseId);

    const loadHeatmap = async () => {
      try {
        const response = await fetch(storedImage);
        const blob = await response.blob();
        const file = new File([blob], "lesion.jpg", { type: "image/jpeg" });
        
        const hmUrl = await getHeatmap(file, parsedPrediction.predicted_class);
        setHeatmapSrc(hmUrl);
      } catch (err) {
        console.error("Heatmap loading failed:", err);
        setError("AI Visualization failed to load. The diagnostic data is still valid.");
      } finally {
        setIsHeatmapLoading(false);
      }
    };

    loadHeatmap();
  }, [router]);

  const handleExport = async () => {
    if (prediction) {
      await generatePDF("diagnostic-content", prediction, caseId);
    }
  };

  if (!prediction || !imageSrc) return null;

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
            onClick={() => {
              sessionStorage.removeItem("current_case_id");
              router.push("/");
            }}
            className="group flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-text-muted transition-colors hover:text-accent-green"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>New Analysis</span>
          </button>
          <div className="h-4 w-px bg-border-subtle" />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-muted">
             CASE_ID: {caseId}
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
                onClick={() => {
                  sessionStorage.removeItem("current_case_id");
                  router.push("/");
                }}
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

      <div className="mt-24 rounded-3xl border border-border-subtle bg-bg-secondary/30 p-12 text-center backdrop-blur-xl relative overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-64 bg-gradient-to-r from-transparent via-accent-green to-transparent" />
         <p className="text-xs font-medium italic text-text-muted max-w-2xl mx-auto leading-relaxed">
           Important Notice: The DermAI predictive system utilizes advanced neural networks to assist in clinical evaluation. 
           This result is not a final or medical diagnosis. A full bioptical evaluation by a board-certified dermatologist remains the clinical standard.
         </p>
         <button 
           onClick={() => {
             sessionStorage.removeItem("current_case_id");
             router.push("/");
           }}
           className="mt-10 inline-flex items-center space-x-3 text-xs font-black uppercase tracking-widest text-accent-green hover:text-white transition-colors group"
         >
           <RotateCcw className="h-4 w-4 transition-transform group-hover:rotate-180 duration-500" />
           <span>Restart Pipeline</span>
         </button>
      </div>

      <ABCDEModal 
        isOpen={isAuditOpen} 
        onClose={() => setIsAuditOpen(false)} 
        onComplete={(score) => setAuditScore(score)}
      />
    </div>
  );
}
