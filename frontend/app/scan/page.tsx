"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import SampleImages from "@/components/SampleImages";
import { predictImage } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Search, ArrowLeft, Zap } from "lucide-react";
import Link from "next/link";
import CameraUI from "@/components/CameraUI";
import { useHistory } from "@/hooks/useHistory";
import { cn } from "@/lib/utils";

export default function ScanPage() {
  const router = useRouter();
  const { addToHistory } = useHistory();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

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
        const newId = addToHistory(prediction, base64);
        router.push(`/result/${newId}`);
      };
      reader.readAsDataURL(file);
    } catch (err: unknown) {
      console.error(err);
      let errorMessage = "Analysis failed. Please ensure your image is clear and try again.";
      
      if (err && typeof err === "object" && "response" in err) {
        const errorWithResponse = err as { response?: { data?: { detail?: string } } };
        if (errorWithResponse.response?.data?.detail) {
          errorMessage = errorWithResponse.response.data.detail;
        }
      }
      
      setError(errorMessage);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary py-24 px-6 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#4ade800a_0%,transparent_50%)]" />
      
      <div className="max-w-3xl mx-auto relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center space-x-2 text-text-muted hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-xs font-bold uppercase tracking-widest">Back to Dashboard</span>
        </Link>
        
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-lg bg-accent-green/10 border border-accent-green/20">
              <Zap className="h-5 w-5 text-accent-green" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Diagnostic Scan</h1>
          </div>
          <p className="text-text-secondary font-medium">
            Upload a dermoscopic image or take a live photo. Our AI will analyze morphological structures 
            to provide a preliminary risk assessment.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl border border-border-visible bg-bg-card/50 p-8 shadow-2xl backdrop-blur-xl border-accent-green/10"
        >
          <div className="flex items-center justify-between mb-8 px-2">
             <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-500/50" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
              <div className="h-3 w-3 rounded-full bg-green-500/50" />
              <span className="ml-4 text-[10px] font-mono text-text-muted uppercase tracking-[0.3em] font-bold">
                SCANNER_ACTIVE
              </span>
             </div>
             <button 
              onClick={() => setIsCameraOpen(true)}
              className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-accent-green hover:opacity-80 transition-opacity"
             >
              <Camera className="h-3 w-3" />
              <span>Take Photo</span>
             </button>
          </div>

          <ImageUpload onFileSelect={handleUpload} className={isAnalyzing ? "opacity-30 pointer-events-none" : ""} />

          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 flex flex-col items-center space-y-4"
              >
                <div className="h-1 w-full bg-bg-secondary rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-accent-green shadow-[0_0_15px_rgba(74,222,128,0.5)]"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 15 }}
                  />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-green animate-pulse">
                  Neural Engine Processing...
                </span>
              </motion.div>
            )}

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
          transition={{ delay: 0.3 }}
          className={cn("mt-12", isAnalyzing && "opacity-50 pointer-events-none")}
        >
          <SampleImages onSelect={handleUpload} />
        </motion.div>
      </div>

      <CameraUI 
        isOpen={isCameraOpen} 
        onClose={() => setIsCameraOpen(false)} 
        onCapture={(img) => handleUpload(img)} 
      />
    </div>
  );
}
