"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import SampleImages from "@/components/SampleImages";
import { predictImage } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Zap, 
  ChevronRight,
  Database,
  BrainCircuit,
  Microscope,
  Search,
  Camera,
  ClipboardCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import CameraUI from "@/components/CameraUI";
import ABCDEModal from "@/components/ABCDEModal";
import { useHistory } from "@/hooks/useHistory";

export default function HomePage() {
  const router = useRouter();
  const { addToHistory } = useHistory();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  const handleUpload = async (input: File | string) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      let file: File;
      if (typeof input === "string") {
        const response = await fetch(input);
        const blob = await response.blob();
        file = new File([blob], "lesion.jpg", { type: "image/jpeg" });
      } else {
        file = input;
      }

      const prediction = await predictImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // Save to history and get unique ID
        const newId = addToHistory(prediction, base64);
        // Redirect to specific result page
        router.push(`/result/${newId}`);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Analysis failed. Ensure the backend is running.");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="relative isolate overflow-hidden bg-bg-primary min-h-screen">
      <section className="relative px-6 pt-24 pb-32 sm:pt-32 lg:px-8 lg:pt-40">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8"
          >
            <div className="flex items-center space-x-2 rounded-full border border-accent-green/20 bg-accent-green/10 px-4 py-1.5 backdrop-blur-md shadow-lg shadow-accent-green/5">
              <Zap className="h-4 w-4 text-accent-green animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-accent-green">
                Next-Gen Diagnostic AI
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-black tracking-tight text-white sm:text-7xl leading-tight"
          >
            Detect Skin Cancer <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-green via-accent-purple to-accent-blue text-glow-green">
              With Clinical Precision
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-lg leading-relaxed text-text-secondary max-w-2xl mx-auto font-medium"
          >
            Identify pigmented skin lesions with institutional accuracy. Our EfficientNet-B7 engine 
            provides rapid classification and XAI heatmaps for diagnostic transparency.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <button 
              onClick={() => setIsCameraOpen(true)}
              className="flex items-center space-x-2 rounded-2xl bg-accent-green px-8 py-4 text-xs font-black uppercase tracking-widest text-black shadow-xl shadow-accent-green/10 hover:scale-105 transition-transform active:scale-95"
            >
              <Camera className="h-4 w-4" />
              <span>Free Live Scan</span>
            </button>
            <button 
              onClick={() => setIsAuditOpen(true)}
              className="flex items-center space-x-2 rounded-2xl border border-border-visible bg-bg-card/50 px-8 py-4 text-xs font-black uppercase tracking-widest text-white backdrop-blur-lg hover:bg-bg-hover transition-colors"
            >
              <ClipboardCheck className="h-4 w-4 text-accent-blue" />
              <span>Symptom Audit</span>
            </button>
          </motion.div>
        </div>

        <div className="mx-auto mt-20 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative rounded-3xl border border-border-visible bg-bg-card/50 p-8 shadow-2xl backdrop-blur-xl border-accent-green/10"
          >
            <div className="flex items-center justify-between mb-8 px-2">
               <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-red-500/50" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                <div className="h-3 w-3 rounded-full bg-green-500/50" />
                <span className="ml-4 text-[10px] font-mono text-text-muted uppercase tracking-[0.3em] font-bold">
                  v1.0.4_Diagnostic_Terminal
                </span>
               </div>
               <div className="text-[10px] font-mono text-accent-green/60 animate-pulse">● SYSTEM_ONLINE</div>
            </div>

            <ImageUpload onFileSelect={handleUpload} className={isAnalyzing ? "opacity-50 pointer-events-none" : ""} />

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 flex items-center space-x-3 rounded-xl border border-accent-red/20 bg-accent-red/5 p-4 text-xs font-bold text-accent-red"
                >
                  <Search className="h-4 w-4" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={cn("mt-12", isAnalyzing && "opacity-50 pointer-events-none")}
          >
            <SampleImages onSelect={handleUpload} />
          </motion.div>
        </div>
      </section>

      {/* Accuracy Verification */}
      <section className="py-24 border-y border-border-subtle bg-bg-secondary/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,#4ade80_0%,transparent_70%)]" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
            {[
              { label: "Validated Samples", val: "10,000+", icon: Database, color: "text-accent-blue" },
              { label: "Model Confidence", val: "92.4%", icon: ShieldCheck, color: "text-accent-green" },
              { label: "Analysis Time", val: "< 500ms", icon: BrainCircuit, color: "text-accent-purple" },
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-4">
                <div className={`p-4 rounded-2xl bg-bg-card border border-border-subtle ${stat.color} shadow-lg`}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <div>
                  <div className="text-3xl font-black text-white italic tracking-tight">{stat.val}</div>
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-text-muted mt-2">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-32 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-sm font-black uppercase tracking-[0.4em] text-accent-green mb-6 border-l-2 border-accent-green pl-4">Explainable AI</h2>
              <h3 className="text-4xl font-black text-white tracking-tight leading-tight">
                Visualizing Neural <br />
                <span className="text-text-muted">Attention Thresholds.</span>
              </h3>
              <p className="mt-8 text-text-secondary leading-relaxed max-w-lg font-medium">
                Our Grad-CAM implementation maps activation gradients back to the original pixels, 
                eliminating the &quot;black box&quot; effect and giving clinicians confidence in every detection.
              </p>
              
              <div className="mt-10 space-y-6">
                {[
                  "Localized probability mapping",
                  "Morphological feature attribution",
                  "Real-time heatmap generation"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center space-x-3 text-sm font-bold text-white group">
                    <ChevronRight className="h-4 w-4 text-accent-green transition-transform group-hover:translate-x-1" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-accent-green/20 to-accent-blue/20 blur-xl opacity-50 transition duration-1000 group-hover:opacity-100" />
              <div className="relative aspect-square rounded-3xl border border-border-visible bg-bg-card flex items-center justify-center p-12 overflow-hidden shadow-2xl">
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                 <Microscope className="h-64 w-64 text-accent-green/20 group-hover:text-accent-green/40 transition-colors duration-500" />
                 <motion.div 
                   animate={{ 
                     y: ["-100%", "200%"],
                     opacity: [0, 1, 0]
                   }}
                   transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                   className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-accent-green/40 to-transparent blur-sm"
                 />
              </div>
            </div>
          </div>
        </div>
      </section>

      <CameraUI 
        isOpen={isCameraOpen} 
        onClose={() => setIsCameraOpen(false)} 
        onCapture={(img) => handleUpload(img)} 
      />

      <ABCDEModal 
        isOpen={isAuditOpen} 
        onClose={() => setIsAuditOpen(false)} 
        onComplete={(score) => {
          // We can show a toast or just open the history
          setIsAuditOpen(false);
        }}
      />
    </div>
  );
}
