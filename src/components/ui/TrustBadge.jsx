"use client";

import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TrustBadge({ type = "compliance", className }) {
  const configs = {
    compliance: {
      icon: CheckCircle2,
      text: "Compatible con DGII",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100"
    },
    security: {
      icon: ShieldCheck,
      text: "Datos Protegidos",
      color: "bg-primary/5 text-primary border-primary/10"
    }
  };

  const config = configs[type] || configs.compliance;

  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest",
      config.color,
      className
    )}>
      <config.icon className="w-3 h-3" />
      {config.text}
    </div>
  );
}
