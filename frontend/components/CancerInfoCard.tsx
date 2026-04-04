"use client";

import { CANCER_INFO } from "@/lib/constants";
import { CancerInfo } from "@/types/prediction";
import { 
  Stethoscope, 
  Target, 
  Clock, 
  Activity, 
  ChevronRight,
  Info
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CancerInfoCardProps {
  classId: string;
}

export default function CancerInfoCard({ classId }: CancerInfoCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const info: CancerInfo = CANCER_INFO[classId];

  if (!info) return null;

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center space-x-3">
        <Info className="h-5 w-5 text-accent-green" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-white">
          Clinical Reference
        </h3>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-visible bg-bg-card shadow-lg">
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-white flex items-center">
              Overview
              <ChevronRight className="ml-1 h-4 w-4 text-accent-green" />
            </h4>
            <p className="text-sm leading-relaxed text-text-secondary">
              {info.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-white/5 p-4 border border-white/5">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-4 w-4 text-accent-green" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Prevalence</span>
              </div>
              <span className="text-sm font-semibold text-white">{info.prevalence}</span>
            </div>
            <div className="rounded-xl bg-white/5 p-4 border border-white/5">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="h-4 w-4 text-accent-green" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Status</span>
              </div>
              <span className="text-sm font-semibold text-white">{info.risk_level}</span>
            </div>
          </div>

          <div className="space-y-3">
             <div className="flex items-center space-x-2">
                <Stethoscope className="h-4 w-4 text-accent-green" />
                <h5 className="text-xs font-bold uppercase tracking-widest text-white">Common Symptoms</h5>
             </div>
             <ul className="grid grid-cols-1 gap-2">
               {info.symptoms.map((symptom, idx) => (
                 <li key={idx} className="flex items-start space-x-2 text-xs text-text-secondary">
                   <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent-green shrink-0" />
                   <span>{symptom}</span>
                 </li>
               ))}
             </ul>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-6 pt-2 border-t border-border-subtle"
              >
                <div className="space-y-2 mt-4">
                  <h5 className="text-xs font-bold uppercase tracking-widest text-white">Recommended Treatment</h5>
                  <p className="text-xs leading-relaxed text-text-secondary">
                    {info.treatment}
                  </p>
                </div>

                <div className="rounded-xl bg-accent-red/5 p-4 border border-accent-red/20 flex items-start space-x-3">
                  <Clock className="h-4 w-4 text-accent-red shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-accent-red">When to Seek Medical Advice</h5>
                    <p className="text-xs leading-relaxed text-accent-red/80 italic">
                      &quot;{info.when_to_see_doctor}&quot;
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-2 rounded-xl border border-border-visible text-[10px] font-bold uppercase tracking-widest text-text-secondary hover:bg-white/5 transition-colors"
          >
            {isExpanded ? "Show Less" : "Read Full Clinical Data"}
          </button>
        </div>
      </div>
    </div>
  );
}
