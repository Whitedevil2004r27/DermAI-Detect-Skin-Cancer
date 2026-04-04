"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface SampleImagesProps {
  onSelect: (imageUrl: string) => void;
}

const SAMPLES = [
  { id: "mel", label: "Melanoma", url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=200&h=200&fit=crop" },
  { id: "bcc", label: "Basal Cell", url: "https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=200&h=200&fit=crop" },
  { id: "nv", label: "Nevus", url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=200&h=200&fit=crop" },
  { id: "akiec", label: "Actinic", url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop" },
  { id: "df", label: "Dermatofibroma", url: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=200&h=200&fit=crop" },
  { id: "bkl", label: "Keratosis", url: "https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=200&h=200&fit=crop" },
];

export default function SampleImages({ onSelect }: SampleImagesProps) {
  return (
    <div className="w-full">
      <div className="mb-4 flex items-center space-x-2">
        <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Test with Samples</span>
        <div className="h-[1px] flex-1 bg-border-subtle" />
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
        {SAMPLES.map((sample) => (
          <button
            key={sample.id}
            onClick={() => onSelect(sample.url)}
            className="group relative aspect-square rounded-xl overflow-hidden border border-border-subtle transition-all hover:border-accent-green/50 active:scale-95"
          >
            <Image
              src={sample.url}
              alt={sample.label}
              fill
              className="object-cover opacity-60 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="absolute bottom-1 left-0 right-0 text-[8px] font-bold uppercase tracking-tighter text-white opacity-0 group-hover:opacity-100 transition-all">
              {sample.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
