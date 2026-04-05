"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHistory } from "@/hooks/useHistory";
import { Activity } from "lucide-react";

export default function ResultRedirectPage() {
  const router = useRouter();
  const { history } = useHistory();

  useEffect(() => {
    if (history.length > 0) {
      // Redirect to the most recent result
      router.push(`/result/${history[0].id}`);
    } else {
      // No history, go back to start
      router.push("/");
    }
  }, [history, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary">
       <div className="text-center space-y-4">
          <Activity className="h-12 w-12 text-accent-green animate-spin mx-auto opacity-20" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Accessing Clinical History...</p>
       </div>
    </div>
  );
}
