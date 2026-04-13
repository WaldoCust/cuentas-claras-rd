"use client";

import { Lock, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SecurityNotice({ message, className }) {
  return (
    <div className={cn(
      "p-4 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4 items-start",
      className
    )}>
      <div className="p-2 rounded-xl bg-white shadow-sm flex-shrink-0">
        <Lock className="w-4 h-4 text-slate-400" />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Privacidad y Seguridad</span>
          <Info className="w-3 h-3 text-slate-300" />
        </div>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          {message || "Tus datos financieros se procesan con encriptación de nivel bancario. No compartimos tu información con terceros."}
        </p>
      </div>
    </div>
  );
}
