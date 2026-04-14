"use client";

import { motion } from "framer-motion";
import { FolderOpen, ArrowRight, Plus } from "lucide-react";

export default function EmptyState({ 
  title, 
  message, 
  actionLabel, 
  onAction, 
  icon: Icon = FolderOpen 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-16 rounded-[3rem] bg-slate-50 border-2 border-dashed border-slate-200 text-center"
    >
      <div className="w-20 h-20 rounded-[2rem] bg-white shadow-xl flex items-center justify-center mb-8 border border-slate-100">
         <Icon className="w-10 h-10 text-slate-300" />
      </div>
      
      <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight italic">
        {title}
      </h3>
      
      <p className="max-w-xs text-slate-500 font-medium text-sm leading-loose mb-10">
        {message}
      </p>

      {actionLabel && (
        <button
          onClick={onAction}
          className="group px-10 py-5 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20 hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-3"
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </motion.div>
  );
}
