import { 
  Upload, 
  Settings, 
  Cpu, 
  Layers, 
  Eye,
  Microscope,
  BrainCircuit,
  CheckCircle2,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

const pipelineSteps = [
  {
    title: "Image Ingestion",
    desc: "Clinicians upload dermoscopic images securely to the DermAI terminal. The system validates file integrity and prepares the binary stream for preprocessing.",
    icon: Upload,
    color: "bg-accent-blue/10 text-accent-blue border-accent-blue/20"
  },
  {
    title: "Neural Preprocessing",
    desc: "Images are standardized to 224x224 pixels and localized normalization is applied to ensure feature consistency across various lighting conditions.",
    icon: Settings,
    color: "bg-accent-purple/10 text-accent-purple border-accent-purple/20"
  },
  {
    title: "Deep Feature Extraction",
    desc: "The EfficientNet-B7 backbone analyzes thousands of morphological parameters, identifying patterns indicative of malignancy or benignity.",
    icon: Cpu,
    color: "bg-accent-green/10 text-accent-green border-accent-green/20"
  },
  {
    title: "Probabilistic Inference",
    desc: "A custom 7-way classification head generates absolute confidence scores, comparing the input against 10,015 validated clinical samples.",
    icon: Layers,
    color: "bg-accent-orange/10 text-accent-orange border-accent-orange/20"
  },
  {
    title: "Explainability Layer",
    desc: "Grad-CAM generates gradient-weighted activation maps to visualize exactly which pixels influenced the model&apos;s final prediction.",
    icon: Eye,
    color: "bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20"
  }
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center mb-24">
        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-accent-green mb-4 border-l-2 border-accent-green pl-4 inline-block">Architecture Guide</h2>
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl uppercase italic leading-tight">
          The <span className="text-accent-green">DermAI</span> Pipeline
        </h1>
        <p className="mt-8 text-lg font-medium leading-relaxed text-text-secondary">
          Deep dive into the internal mechanics of our diagnostic engine. 
          From raw pixel data to explainable clinical insights.
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-accent-green via-accent-purple to-transparent hidden md:block" />
        
        <div className="space-y-16">
          {pipelineSteps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col md:flex-row md:items-start group">
              <div className={cn(
                "relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl border transition-all duration-300 md:ml-0 group-hover:scale-110 shadow-2xl",
                step.color
              )}>
                <step.icon className="h-8 w-8" />
              </div>

              <div className="mt-6 md:mt-0 md:ml-16 flex-1">
                <div className="rounded-[2.5rem] border border-border-visible bg-bg-card p-10 transition-all hover:bg-bg-card/80 hover:border-white/10 shadow-2xl group/card">
                  <div className="flex items-center space-x-4 mb-6">
                    <span className="text-[10px] font-mono font-black uppercase tracking-widest text-text-muted">Phase_0{idx + 1}</span>
                    <div className="h-px w-12 bg-border-subtle group-hover/card:w-24 transition-all duration-500" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-6 tracking-tight uppercase italic">{step.title}</h3>
                  <p className="text-sm font-medium leading-relaxed text-text-secondary max-w-2xl">
                    {step.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-40 rounded-[3rem] border border-border-visible bg-bg-card p-12 lg:p-20 overflow-hidden relative shadow-2xl">
         <div className="absolute top-0 right-0 p-24 opacity-5 rotate-12">
           <BrainCircuit className="h-96 w-96 text-accent-green" />
         </div>

         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div>
             <h2 className="text-4xl font-black text-white mb-10 tracking-tight italic uppercase">
               Diagnostic <br /> <span className="text-accent-green underline underline-offset-8">Reliability.</span>
             </h2>
             <div className="space-y-10">
               <div className="flex items-start space-x-6">
                 <div className="h-12 w-12 shrink-0 rounded-[1.2rem] bg-accent-green/10 flex items-center justify-center border border-accent-green/20">
                   <Microscope className="h-6 w-6 text-accent-green" />
                 </div>
                 <div>
                   <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2 italic">Neural Scaling</h4>
                   <p className="text-xs font-medium text-text-secondary leading-relaxed">
                     EfficientNet-B7 scales depth and resolution uniformly, ensuring that fine dermatological structures (like network atypicality) are captured.
                   </p>
                 </div>
               </div>
               <div className="flex items-start space-x-6">
                 <div className="h-12 w-12 shrink-0 rounded-[1.2rem] bg-accent-purple/10 flex items-center justify-center border border-accent-purple/20">
                   <CheckCircle2 className="h-6 w-6 text-accent-purple" />
                 </div>
                 <div>
                   <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2 italic">Institutional Trust</h4>
                   <p className="text-xs font-medium text-text-secondary leading-relaxed">
                     By visualizing gradients, clinicians can verify that the model isn&apos;t overfitting to artifacts like surgical markers or stray hairs.
                   </p>
                 </div>
               </div>
             </div>
           </div>

           <div className="rounded-3xl bg-black/50 border border-border-subtle p-10 font-mono text-[11px] leading-7 text-accent-green/60 shadow-inner">
{/* Abstract Diagnostic Logic (Simplified) */}
<br />
<span className="text-accent-purple">async function</span> <span className="text-white">RunAnalysis</span>(pixel_buffer) &#123;
<br />
&nbsp;&nbsp;<span className="text-accent-purple">const</span> normalized = <span className="text-accent-blue">await</span> Preprocess(pixel_buffer);
<br />
&nbsp;&nbsp;<span className="text-accent-purple">const</span> [logits, attention] = <span className="text-accent-blue">await</span> Model.Inference(normalized);
<br />
&nbsp;&nbsp;
<br />
&nbsp;&nbsp;{/* Generate visual attribution */}
<br />
&nbsp;&nbsp;<span className="text-accent-purple">const</span> heatmap = GradCAM.Generate(attention, logits);
<br />
&nbsp;&nbsp;
<br />
&nbsp;&nbsp;<span className="text-accent-purple">return</span> &#123;
<br />
&nbsp;&nbsp;&nbsp;&nbsp;diagnosis: GetMaxProbability(logits),
<br />
&nbsp;&nbsp;&nbsp;&nbsp;confidence: Softmax(logits),
<br />
&nbsp;&nbsp;&nbsp;&nbsp;visualization: heatmap
<br />
&nbsp;&nbsp;&#125;;
<br />
&#125;
           </div>
         </div>
      </div>

      <div className="mt-24 max-w-4xl mx-auto rounded-3xl border border-accent-red/20 bg-accent-red/5 p-10 flex items-start space-x-6 shadow-xl">
         <Info className="h-8 w-8 text-accent-red shrink-0" />
         <p className="text-xs font-medium leading-relaxed text-accent-red/80 italic">
           Disclaimer: Every stage of the DermAI pipeline is optimized for academic research. 
           In clinical settings, these predictions must be synthesized with patient history 
           and dermatoscopic findings by a qualified board-certified professional.
         </p>
      </div>
    </div>
  );
}
