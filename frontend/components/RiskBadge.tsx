import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info, Skull, ShieldAlert } from "lucide-react";

interface RiskBadgeProps {
  level: string;
  className?: string;
}

export default function RiskBadge({ level, className }: RiskBadgeProps) {
  const getBadgeConfig = (risk: string) => {
    switch (risk.toUpperCase()) {
      case "CRITICAL":
        return {
          label: "Critical Risk",
          color: "bg-accent-red/10 text-accent-red border-accent-red/30",
          icon: <Skull className="h-3 w-3" />,
        };
      case "HIGH":
        return {
          label: "High Risk",
          color: "bg-accent-orange/10 text-accent-orange border-accent-orange/30",
          icon: <ShieldAlert className="h-3 w-3" />,
        };
      case "MODERATE":
        return {
          label: "Moderate Risk",
          color: "bg-accent-yellow/10 text-accent-yellow border-accent-yellow/30",
          icon: <AlertCircle className="h-3 w-3" />,
        };
      case "LOW":
        return {
          label: "Low Risk",
          color: "bg-accent-blue/10 text-accent-blue border-accent-blue/30",
          icon: <Info className="h-3 w-3" />,
        };
      case "BENIGN":
        return {
          label: "Benign",
          color: "bg-accent-green/10 text-accent-green border-accent-green/30",
          icon: <CheckCircle2 className="h-3 w-3" />,
        };
      default:
        return {
          label: "Undetermined",
          color: "bg-text-muted/10 text-text-muted border-border-subtle",
          icon: <Info className="h-3 w-3" />,
        };
    }
  };

  const config = getBadgeConfig(level);

  return (
    <div
      className={cn(
        "flex items-center space-x-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        config.color,
        className
      )}
    >
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
}
