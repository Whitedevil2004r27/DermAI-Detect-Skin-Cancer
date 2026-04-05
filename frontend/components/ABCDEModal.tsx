"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ChevronRight, ChevronLeft, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ABCDEModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
}

const STEPS = [
  {
    id: "A",
    title: "Asymmetry",
    question: "Does one half of the lesion look different from the other half?",
    description: "Benign moles are usually symmetrical.",
  },
  {
    id: "B",
    title: "Border",
    question: "Are the edges irregular, notched, or blurred?",
    description: "Melanomas often have poorly defined borders.",
  },
  {
    id: "C",
    title: "Color",
    question: "Does the lesion have multiple colors (brown, black, tan, white, red)?",
    description: "Varied pigmentation is a warning sign.",
  },
  {
    id: "D",
    title: "Diameter",
    question: "Is the lesion larger than 6mm (size of a pencil eraser)?",
    description: "Larger size often correlates with higher risk.",
  },
  {
    id: "E",
    title: "Evolving",
    question: "Has the lesion changed in size, shape, or color recently?",
    description: "Rapid evolution is the most critical indicator.",
  },
];

export default function ABCDEModal({
  isOpen,
  onClose,
  onComplete,
}: ABCDEModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  const handleAnswer = (val: boolean) => {
    const stepId = STEPS[currentStep].id;
    setAnswers({ ...answers, [stepId]: val });

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const score = Object.values({ ...answers, [stepId]: val }).filter(Boolean).length;
      onComplete(score);
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-border-subtle bg-bg-card shadow-2xl"
          >
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 h-1 w-full bg-bg-secondary">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-accent-green shadow-[0_0_10px_rgba(74,222,128,0.5)]"
              />
            </div>

            <div className="p-8 sm:p-12">
              <div className="mb-12 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-green/10 text-xl font-black text-accent-green shadow-inner">
                    {STEPS[currentStep].id}
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">
                      Clinical Audit
                    </h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                      ABCDE Criteria Checklist
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-text-muted hover:bg-bg-hover hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="min-h-[160px]"
                >
                  <h2 className="mb-4 text-2xl font-black text-white leading-tight">
                    {STEPS[currentStep].question}
                  </h2>
                  <p className="text-sm font-medium text-text-secondary leading-relaxed">
                    {STEPS[currentStep].description}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-12 grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAnswer(false)}
                  className="flex flex-col items-center justify-center space-y-3 rounded-3xl border border-border-subtle bg-bg-secondary p-8 transition-all hover:bg-bg-hover hover:-translate-y-1 group"
                >
                  <X className="h-8 w-8 text-text-muted group-hover:text-accent-red transition-colors" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">No</span>
                </button>
                <button
                  onClick={() => handleAnswer(true)}
                  className="flex flex-col items-center justify-center space-y-3 rounded-3xl border border-accent-green/20 bg-accent-green/5 p-8 transition-all hover:bg-accent-green/10 hover:-translate-y-1 group"
                >
                  <Check className="h-8 w-8 text-accent-green group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-accent-green">Yes</span>
                </button>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className={cn(
                    "flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest transition-colors",
                    currentStep === 0 ? "opacity-0 pointer-events-none" : "text-text-muted hover:text-white"
                  )}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <div className="flex items-center space-x-1.5">
                  {STEPS.map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-1.5 w-1.5 rounded-full transition-all duration-300",
                        i === currentStep ? "w-6 bg-accent-green" : i < currentStep ? "bg-accent-green/40" : "bg-bg-secondary"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
