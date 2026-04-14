"use client";

import { ShieldCheck, Lock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TrustBadge({ type = "security", className }) {
  const configs = {
    security: {
      icon: ShieldCheck,
      text: "Conexión Segura (SSL)",
      color: "text-emerald-500 bg-emerald-50 border-emerald-100"
    },
    compliance: {
      icon: CheckCircle2,
      text: "Formato DGII 606/607",
      color: "text-primary bg-primary/5 border-primary/10"
    },
    privacy: {
      icon: Lock,
      text: "Datos Encriptados",
      color: "text-slate-500 bg-slate-50 border-slate-100"
    }
  };

  const config = configs[type] || configs.security;
  const Icon = config.icon;

  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-[0.05em]",
      config.color,
      className
    )}>
       <Icon className="w-3 h-3" />
       <span>{config.text}</span>
    </div>
  );
}
