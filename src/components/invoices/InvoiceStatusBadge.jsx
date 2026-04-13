"use client";

import { cn } from "@/lib/utils";
import { Clock, CheckCircle2, AlertCircle, Ban, Send } from "lucide-react";

const STATUS_CONFIG = {
  draft: {
    label: "Borrador",
    icon: Clock,
    className: "text-slate-400 bg-slate-50 border-slate-100"
  },
  issued: {
    label: "Emitida",
    icon: Send,
    className: "text-blue-600 bg-blue-50 border-blue-100"
  },
  paid: {
    label: "Pagada",
    icon: CheckCircle2,
    className: "text-emerald-600 bg-emerald-50 border-emerald-100"
  },
  voided: {
    label: "Anulada",
    icon: Ban,
    className: "text-red-600 bg-red-50 border-red-100"
  },
  rejected: {
    label: "Rechazada",
    icon: AlertCircle,
    className: "text-amber-600 bg-amber-50 border-amber-100"
  }
};

export default function InvoiceStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  const Icon = config.icon;

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest",
      config.className
    )}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}
