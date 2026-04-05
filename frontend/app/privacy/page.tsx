"use client";

import { Shield, Lock, EyeOff, Server } from "lucide-react";

export default function PrivacyPage() {
  const points = [
    {
      title: "Data Anonymization",
      description: "DermAI employs differential privacy protocols. All uploaded images are stripped of metadata (EXIF) and anonymized before being processed by the EfficientNet-B7 engine.",
      icon: EyeOff
    },
    {
      title: "Encrypted Transmission",
      description: "Every byte of clinical data is transmitted via industry-standard TLS 1.3 encryption. We use end-to-end secure tunnels between the frontend and our Hugging Face backend infrastructure.",
      icon: Lock
    },
    {
      title: "Storage Policy",
      description: "Under our current research framework, uploaded images are processed in-memory and are not persisted on our servers unless the user explicitly opts into the 'Clinical Contribution' program.",
      icon: Server
    }
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-20">
      <div className="text-center mb-16">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-accent-blue/10 mb-6 drop-shadow-2xl">
          <Shield className="h-8 w-8 text-accent-blue" />
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight sm:text-5xl">Privacy Policy</h1>
        <p className="text-text-secondary mt-6 text-lg max-w-2xl mx-auto leading-relaxed">
          How we protect your clinical data and maintain diagnostic confidentiality in the age of AI.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {points.map((point) => (
          <div key={point.title} className="group rounded-3xl border border-border-subtle bg-bg-card p-10 shadow-2xl backdrop-blur-md transition-all hover:border-accent-blue/30">
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-8">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-accent-blue/5 border border-accent-blue/10 text-accent-blue group-hover:scale-110 transition-transform">
                <point.icon className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">{point.title}</h3>
                <p className="text-text-secondary leading-relaxed text-base">
                  {point.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 p-8 rounded-3xl bg-bg-secondary border border-border-subtle text-center">
        <h4 className="text-white font-bold mb-2">Have questions about your data?</h4>
        <p className="text-sm text-text-muted mb-6">Our Data Protection Officer (DPO) is available for consultation regarding institutional HIPAA compliance.</p>
        <button className="text-accent-blue font-black uppercase tracking-widest text-xs hover:underline">
          Contact Privacy Team
        </button>
      </div>
    </div>
  );
}
