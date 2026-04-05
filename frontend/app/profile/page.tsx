"use client";

import { useSession } from "next-auth/react";
import { Mail, ShieldCheck, Activity, Clock, FileText, Settings, LogOut } from "lucide-react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-4">
        <div className="rounded-3xl border border-border-subtle bg-bg-card p-8 text-center shadow-2xl backdrop-blur-md max-w-md w-full">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-red/10">
            <ShieldCheck className="h-8 w-8 text-accent-red" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
          <p className="text-text-secondary mb-8">Please sign in to view your clinical profile and diagnostic history.</p>
          <a
            href="/login"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-accent-green px-6 py-4 text-sm font-black uppercase tracking-widest text-black transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Analyses", value: "124", icon: Activity, color: "text-accent-green" },
    { label: "Confidence", value: "98.2%", icon: ShieldCheck, color: "text-accent-blue" },
    { label: "Recent", value: "12m ago", icon: Clock, color: "text-accent-purple" },
  ];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Sidebar/Identity */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-3xl border border-border-subtle bg-bg-card p-8 shadow-2xl backdrop-blur-md">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6 h-32 w-32 overflow-hidden rounded-full ring-4 ring-accent-green/20">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-accent-green/10 text-4xl font-black text-accent-green">
                    {session.user?.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              <h1 className="text-2xl font-bold text-white">{session.user?.name}</h1>
              <p className="text-sm font-medium text-text-muted mt-1 flex items-center justify-center gap-2 uppercase tracking-widest">
                <ShieldCheck className="h-4 w-4 text-accent-green" />
                Verified Practitioner
              </p>
              
              <div className="mt-8 grid w-full grid-cols-3 gap-2">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center rounded-2xl bg-bg-secondary p-3 border border-border-subtle/50">
                    <stat.icon className={cn("h-4 w-4 mb-2", stat.color)} />
                    <span className="text-sm font-bold text-white">{stat.value}</span>
                    <span className="text-[10px] font-medium text-text-muted uppercase tracking-tighter">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 space-y-2">
               <div className="flex items-center space-x-3 rounded-2xl bg-bg-secondary p-4 border border-border-subtle/30">
                  <Mail className="h-4 w-4 text-text-muted" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-text-muted">Email Address</span>
                    <span className="text-xs font-bold text-white truncate max-w-[180px]">{session.user?.email}</span>
                  </div>
               </div>
            </div>
          </div>

          <button
            onClick={() => signOut()}
            className="flex w-full items-center justify-center space-x-3 rounded-3xl border border-accent-red/20 bg-accent-red/5 px-6 py-4 text-sm font-bold text-accent-red transition-all hover:bg-accent-red/10"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out Session</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-border-subtle bg-bg-card p-10 shadow-2xl backdrop-blur-md min-h-[500px]">
             <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight">Clinical Activity</h2>
                  <p className="text-text-secondary mt-2">Monitor your diagnostic history and model engagement.</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bg-secondary border border-border-subtle hover:scale-105 transition-all text-text-secondary cursor-pointer">
                   <Settings className="h-5 w-5" />
                </div>
             </div>

             {/* Placeholder Content */}
             <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="group relative flex items-center justify-between rounded-3xl border border-border-subtle/50 bg-bg-secondary/40 p-6 transition-all hover:bg-bg-hover hover:-translate-y-1">
                     <div className="flex items-center space-x-5">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-green/10 text-accent-green">
                           <FileText className="h-7 w-7" />
                        </div>
                        <div>
                           <h4 className="font-bold text-white">Diagnostic Report #2140{i}</h4>
                           <p className="text-sm text-text-secondary mt-1">EfficientNet-B7 Inference • High Confidence Result</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <span className="text-xs font-black uppercase tracking-widest text-text-muted block mb-1">Apr 0{i}, 2026</span>
                        <span className="inline-flex items-center rounded-full bg-accent-green/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-accent-green">Validated</span>
                     </div>
                  </div>
                ))}
                
                <div className="flex items-center justify-center py-12">
                   <div className="text-center max-w-xs">
                      <p className="text-sm text-text-muted leading-relaxed">
                        End of diagnostic history. Use the <strong className="text-white">Live Scan</strong> terminal to generate new automated reports.
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
