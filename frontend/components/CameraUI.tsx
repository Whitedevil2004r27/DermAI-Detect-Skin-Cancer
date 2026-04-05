"use client";

import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, RefreshCcw, X, Check, Zap, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface CameraUIProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (image: string) => void;
}

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "environment", // Use back camera on mobile
};

export default function CameraUI({ isOpen, onClose, onCapture }: CameraUIProps) {
  const webcamRef = useRef<Webcam>(null);
  const [imgData, setImgData] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImgData(imageSrc);
      setFlash(true);
      setTimeout(() => setFlash(false), 200);
    }
  }, [webcamRef]);

  const handleRetake = () => setImgData(null);
  const handleConfirm = () => {
    if (imgData) {
      onCapture(imgData);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex flex-col bg-black lg:p-12"
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-6">
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 rounded-full bg-accent-green animate-pulse" />
              <h3 className="text-xs font-black uppercase tracking-widest text-white">
                Dermoscopy Capture
              </h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-full bg-white/10 p-2.5 text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center overflow-hidden lg:rounded-[3rem] lg:border lg:border-white/10">
            {/* Flash Effect */}
            <AnimatePresence>
              {flash && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-white"
                />
              )}
            </AnimatePresence>

            {!imgData ? (
              <>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="h-full w-full object-cover"
                />
                
                {/* Lens Overlay */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                   <div className="relative h-64 w-64 border-2 border-dashed border-accent-green/50 rounded-full flex items-center justify-center shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                      <div className="absolute h-4 w-4 border-l-2 border-t-2 border-accent-green -left-1 -top-1" />
                      <div className="absolute h-4 w-4 border-r-2 border-t-2 border-accent-green -right-1 -top-1" />
                      <div className="absolute h-4 w-4 border-l-2 border-b-2 border-accent-green -left-1 -bottom-1" />
                      <div className="absolute h-4 w-4 border-r-2 border-b-2 border-accent-green -right-1 -bottom-1" />
                   </div>
                </div>

                <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center space-y-6">
                  <div className="flex items-center space-x-1.5 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-md">
                    <Info className="h-3 w-3 text-accent-green" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Center lesion in circle for focus</span>
                  </div>
                  <button
                    onClick={capture}
                    className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white p-1 transition-transform hover:scale-105 active:scale-95"
                  >
                    <div className="h-full w-full rounded-full bg-white shadow-xl" />
                  </button>
                </div>
              </>
            ) : (
              <div className="relative h-full w-full">
                <img
                  src={imgData}
                  alt="Captured"
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-12 left-0 right-0 flex items-center justify-center space-x-6">
                  <button
                    onClick={handleRetake}
                    className="flex items-center space-x-2 rounded-2xl border border-white/10 bg-black/40 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md transition-all hover:bg-black/60"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    <span>Retake</span>
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex items-center space-x-2 rounded-2xl border border-accent-green/20 bg-accent-green px-8 py-3 text-[10px] font-black uppercase tracking-widest text-black shadow-xl transition-all hover:scale-105"
                  >
                    <Check className="h-4 w-4" />
                    <span>Confirm</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
