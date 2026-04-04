"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Maximize2, Layers, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HeatmapOverlayProps {
  originalImage: string;
  heatmapImage: string | null;
  isLoading?: boolean;
}

export default function HeatmapOverlay({
  originalImage,
  heatmapImage,
  isLoading = false,
}: HeatmapOverlayProps) {
  const [viewMode, setViewMode] = useState<"side" | "overlay">("side");

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Layers className="h-5 w-5 text-accent-purple" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">
            AI Attention Analysis
          </h3>
        </div>
        
        <div className="flex bg-bg-secondary rounded-lg p-1 border border-border-subtle p-1">
          <button
            onClick={() => setViewMode("side")}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
              viewMode === "side" ? "bg-accent-purple text-white shadow-lg" : "text-text-muted hover:text-text-secondary"
            )}
          >
            Side-by-Side
          </button>
          <button
            onClick={() => setViewMode("overlay")}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
              viewMode === "overlay" ? "bg-accent-purple text-white shadow-lg" : "text-text-muted hover:text-text-secondary"
            )}
          >
            Overlay
          </button>
        </div>
      </div>

      <div className={cn(
        "relative grid min-h-[320px] gap-6 transition-all duration-500",
        viewMode === "side" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
      )}>
        {/* Original Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-black/40 group">
          <Image
            src={originalImage}
            alt="Original skin lesion"
            fill
            className="object-contain p-2"
          />
          <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 text-[10px] uppercase font-bold tracking-widest text-white backdrop-blur-md">
            Original
          </div>
        </div>

        {/* Heatmap Image Container */}
        <div className={cn(
          "relative aspect-square overflow-hidden rounded-2xl border border-accent-purple/20 bg-black/40",
          viewMode === "overlay" ? "absolute inset-0 z-10 opacity-50 pointer-events-none" : ""
        )}>
           {!heatmapImage || isLoading ? (
             <div className="flex h-full w-full flex-col items-center justify-center space-y-4 bg-bg-card/80 animate-pulse">
               <div className="h-12 w-12 rounded-full border-2 border-accent-purple/30 border-t-accent-purple animate-spin" />
               <span className="text-xs font-mono text-accent-purple tracking-widest uppercase">
                 Generating Grad-CAM Map...
               </span>
             </div>
           ) : (
             <>
               <Image
                 src={heatmapImage}
                 alt="Grad-CAM analysis"
                 fill
                 className="object-contain p-2"
               />
               <div className="absolute bottom-4 right-4 rounded-full bg-accent-purple/60 px-3 py-1 text-[10px] uppercase font-bold tracking-widest text-white backdrop-blur-md">
                 AI Attention
               </div>
             </>
           )}
        </div>
      </div>

      <div className="flex items-start space-x-3 rounded-xl border border-accent-purple/20 bg-accent-purple/5 p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent-purple" />
        <p className="text-xs leading-5 text-text-secondary">
          Highlighted regions (red/yellow) indicate areas that significantly influenced the AI's diagnosis. 
          Use the <strong>Overlay</strong> mode for precise structural alignment with the lesion morphology.
        </p>
      </div>
    </div>
  );
}
