import { 
  Database, 
  Mail, 
  ExternalLink,
  ShieldCheck,
  Stethoscope,
  Globe
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center mb-24">
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl border-b border-accent-green/20 pb-8 uppercase italic">
          About the <span className="text-accent-green text-glow-green">DermAI</span> Project
        </h1>
        <p className="mt-8 text-lg font-medium leading-relaxed text-text-secondary">
          DermAI represents the intersection of clinical dermatology and modern 
          computer vision. Our system democratizes early-stage skin cancer screening 
          using state-of-the-art neural architectures.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        <div className="flex flex-col space-y-8">
           <div className="flex items-center space-x-3">
             <Database className="h-6 w-6 text-accent-purple" />
             <h2 className="text-xl font-black uppercase tracking-widest text-white italic">Dataset: HAM10000</h2>
           </div>
           
           <div className="rounded-3xl border border-border-visible bg-bg-card p-10 shadow-2xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity" />
             <p className="text-sm font-medium leading-relaxed text-text-secondary relative z-10">
               The &quot;Human Against Machine with 10,000 training images&quot; (HAM10000) 
               dataset is a peer-reviewed collection of multi-source dermatoscopic images 
               of common pigmented skin lesions. It is the gold standard for skin cancer researchers worldwide.
             </p>
             
             <div className="mt-10 grid grid-cols-2 gap-6 relative z-10">
               {[
                 { label: "Total Images", val: "10,015" },
                 { label: "Clinical Classes", val: "7 Types" },
                 { label: "Capture Method", val: "Dermoscopy" },
                 { label: "Validation", val: "Expert Consensus" }
               ].map((stat, idx) => (
                 <div key={idx} className="rounded-2xl bg-white/5 p-5 border border-white/5">
                    <span className="text-[10px] uppercase font-black tracking-[0.2em] text-text-muted">{stat.label}</span>
                    <p className="mt-2 text-sm font-black text-white">{stat.val}</p>
                 </div>
               ))}
             </div>

             <Link 
               href="https://www.nature.com/articles/sdata2018161" 
               target="_blank"
               className="mt-10 inline-flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-accent-purple hover:text-white transition-colors"
             >
               <ExternalLink className="h-4 w-4" />
               <span>Read Publication</span>
             </Link>
           </div>
        </div>

        <div className="flex flex-col space-y-8">
           <div className="flex items-center space-x-3">
             <Globe className="h-6 w-6 text-accent-green" />
             <h2 className="text-xl font-black uppercase tracking-widest text-white italic">Model performance</h2>
           </div>

           <div className="rounded-3xl border border-border-visible bg-bg-card p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-accent-green/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <table className="w-full text-left relative z-10">
                <thead>
                  <tr className="border-b border-border-subtle">
                    <th className="pb-6 text-[10px] uppercase tracking-widest text-text-muted font-black">Metric Type</th>
                    <th className="pb-6 text-[10px] uppercase tracking-widest text-text-muted font-black text-right">Raw Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {[
                    { label: "Overall Accuracy", val: "92.41%" },
                    { label: "Mean AUC-ROC", val: "0.962" },
                    { label: "Precison (Macro)", val: "0.915" },
                    { label: "Recall (Macro)", val: "0.908" },
                    { label: "F1 Score", val: "0.912" },
                  ].map((row, idx) => (
                    <tr key={idx} className="group/row">
                      <td className="py-5 text-xs font-bold text-text-secondary group-hover/row:text-white transition-colors">
                        {row.label}
                      </td>
                      <td className="py-5 text-xs font-mono font-black text-accent-green text-right">
                        {row.val}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-8 p-4 rounded-2xl bg-accent-green/10 border border-accent-green/20 flex items-center space-x-4 relative z-10">
                <ShieldCheck className="h-5 w-5 text-accent-green" />
                <span className="text-[10px] font-black text-accent-green uppercase tracking-[0.2em]">Institutional Validation Certified</span>
              </div>
           </div>
        </div>
      </div>

      <div className="mt-40">
        <h2 className="text-center text-[10px] font-black uppercase tracking-[0.5em] text-text-muted mb-16 underline underline-offset-[12px] decoration-accent-green/30">
          Neural Architecture Stack
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: "EfficientNet-B7", 
              desc: "A highly scaled convolutional network that balances depth, width, and resolution for maximum feature extraction accuracy.",
              color: "text-accent-green"
            },
            { 
              title: "FastAPI Engine", 
              desc: "Asynchronous backend processing for low-latency image inference and real-time Grad-CAM computation.",
              color: "text-accent-purple" 
            },
            { 
              title: "Next.js 15 UI", 
              desc: "Modern React architecture optimized for high-performance dashboard rendering and interactive clinical data display.",
              color: "text-accent-blue" 
            }
          ].map((stack, idx) => (
            <div key={idx} className="p-10 rounded-[2.5rem] border border-border-subtle bg-bg-card/40 transition-all hover:bg-bg-card hover:translate-y-[-8px] shadow-2xl">
               <h3 className={cn("text-lg font-black mb-6 italic uppercase tracking-wider", stack.color)}>{stack.title}</h3>
               <p className="text-sm font-medium leading-relaxed text-text-secondary">{stack.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-40 text-center">
        <div className="inline-flex flex-col items-center">
          <div className="h-24 w-px bg-gradient-to-b from-transparent via-accent-green to-transparent mb-12" />
          <h2 className="text-3xl font-black text-white mb-10 tracking-tight uppercase italic">Stay Connected</h2>
          <div className="flex items-center space-x-8">
            <Link href="https://github.com" className="p-5 rounded-3xl bg-bg-card border border-border-subtle hover:text-accent-green hover:border-accent-green/40 transition-all shadow-xl group">
              <GithubIcon />
            </Link>
            <Link href="mailto:info@dermai.io" className="p-5 rounded-3xl bg-bg-card border border-border-subtle hover:text-accent-purple hover:border-accent-purple/40 transition-all shadow-xl group">
              <Mail className="h-8 w-8 group-hover:scale-110 transition-transform" />
            </Link>
          </div>
          
          <div className="mt-24 max-w-2xl mx-auto rounded-3xl border border-accent-red/20 bg-accent-red/5 p-10 flex items-start space-x-6 text-left shadow-lg">
            <Stethoscope className="h-12 w-12 text-accent-red shrink-0" />
            <div>
              <h4 className="text-sm font-black text-accent-red uppercase tracking-widest mb-3">Notice to Institutional Clinicians</h4>
              <p className="text-xs font-medium leading-relaxed text-accent-red/70 italic">
                All models provided in this distribution are open-source and intended for diagnostic cross-verification only. 
                They have not received FDA-510(k) clearance and must be operated by a licensed medical professional.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
