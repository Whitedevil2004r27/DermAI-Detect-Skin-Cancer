"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileImage, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  className?: string;
}

export default function ImageUpload({ onFileSelect, className }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string } | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onFileSelect(file);
      setPreview(URL.createObjectURL(file));
      setFileInfo({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      });
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setFileInfo(null);
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative group flex flex-col items-center justify-center h-80 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-sm",
          isDragActive 
            ? "border-accent-green bg-accent-green/10" 
            : "border-border-visible bg-bg-secondary hover:bg-bg-hover hover:border-accent-green/50",
          preview ? "border-solid bg-bg-card p-4" : "p-12 text-center"
        )}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="relative h-full w-full flex flex-col items-center">
            <div className="relative h-[85%] w-full rounded-xl overflow-hidden shadow-2xl border border-white/10">
              <Image
                src={preview}
                alt="Upload preview"
                fill
                className="object-contain bg-black/40 p-2"
              />
              <button
                onClick={removeFile}
                className="absolute top-2 right-2 p-2 rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-accent-red transition-colors z-10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mt-4 flex items-center justify-between w-full px-2">
              <div className="flex items-center space-x-2 overflow-hidden">
                <FileImage className="h-4 w-4 text-accent-green shrink-0" />
                <span className="text-sm font-medium text-text-primary truncate">
                  {fileInfo?.name}
                </span>
                <span className="text-xs text-text-muted shrink-0">
                  ({fileInfo?.size})
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-accent-green bg-accent-green/10 px-2 py-0.5 rounded">
                Ready for Analysis
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-accent-green/20 blur-2xl rounded-full scale-150 animate-pulse-soft" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-accent-green/10 border border-accent-green/30">
                <Upload className="h-10 w-10 text-accent-green" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white tracking-tight">
                {isDragActive ? "Drop your image here" : "Upload Dermoscopy Image"}
              </h3>
              <p className="text-sm text-text-secondary max-w-xs mx-auto">
                Drag and drop your high-resolution lesion photo or click to browse files.
              </p>
            </div>

            <div className="mt-8 flex items-center space-x-4 bg-white/5 py-2 px-4 rounded-full border border-white/5">
               <div className="flex items-center space-x-1.5 opacity-60">
                 <ShieldCheck className="h-3.5 w-3.5 text-accent-green" />
                 <span className="text-[10px] font-mono tracking-wider uppercase text-text-muted">Clinical Mode Active</span>
               </div>
               <div className="h-4 w-[1px] bg-white/10" />
               <span className="text-[10px] font-mono tracking-wider uppercase text-text-muted">JPG • PNG • MAX 10MB</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
