"use client";

import { Scale, ShieldCheck, AlertCircle, FileCheck } from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      title: "1. Accuracy of AI Insights",
      content: "The DermAI platform utilizes the EfficientNet-B7 neural network to analyze pigmented skin lesions. While our internal validation shows high diagnostic confidence, the output provided by the system is for research and educational support only. It does NOT constitute a final medical diagnosis.",
      icon: ShieldCheck
    },
    {
      title: "2. User Responsibility",
      content: "Users are responsible for ensuring high-quality image capture. Poor lighting, blurriness, or low resolution significantly impact the model's performance. DermAI is not liable for misclassifications resulting from substandard input data.",
      icon: AlertCircle
    },
    {
      title: "3. Clinical Validation",
      content: "All AI-generated results must be reviewed and synthesized by a board-certified dermatologist. This tool is designed to assist, not replace, clinical judgment. Automated alerts should trigger immediate professional consultation.",
      icon: FileCheck
    }
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-20">
      <div className="text-center mb-16">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-accent-green/10 mb-6 drop-shadow-2xl">
          <Scale className="h-8 w-8 text-accent-green" />
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight sm:text-5xl">Terms of Service</h1>
        <p className="text-text-secondary mt-6 text-lg max-w-2xl mx-auto leading-relaxed">
          Operational framework and legal boundaries for the DermAI clinical assistance platform.
        </p>
      </div>

      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title} className="rounded-3xl border border-border-subtle bg-bg-card p-10 shadow-2xl backdrop-blur-md transition-all hover:bg-bg-hover">
            <div className="flex items-start space-x-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-bg-secondary border border-border-subtle">
                <section.icon className="h-6 w-6 text-text-muted" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-4">{section.title}</h3>
                <p className="text-text-secondary leading-8 text-[15px]">
                  {section.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center text-text-muted text-sm italic">
        Last updated: April 06, 2026. For institutional inquiries, contact legal@dermai.tech
      </div>
    </div>
  );
}
