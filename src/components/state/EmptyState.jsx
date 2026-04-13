"use client";

import { motion } from "framer-motion";
import { FolderOpen, Plus } from "lucide-react";

export default function EmptyState({ 
  icon: Icon = FolderOpen, 
  title = "No hay registros", 
  message = "Aún no se ha detectado información para esta categoría.",
  actionLabel,
  onAction
}) {
  return (
    <div className="py-24 text-center space-y-8 relative">
      <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto border border-slate-100 shadow-inner group-hover:scale-105 transition-transform">
        <Icon className="w-10 h-10 text-slate-200" />
      </div>
      <div className="space-y-2">
        <h4 className="text-xl font-black text-slate-900 italic tracking-tight">{title}</h4>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
          {message}
        </p>
      </div>
      {actionLabel && (
        <button 
          onClick={onAction}
          className="px-8 py-4 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-slate-900/10"
        >
          <Plus className="w-4 h-4 inline-block mr-2 -mt-0.5" /> {actionLabel}
        </button>
      )}
    </div>
  );
}
