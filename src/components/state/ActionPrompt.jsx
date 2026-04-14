"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function ActionPrompt({ title, message, actionLabel, onAction }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 rounded-[2.5rem] bg-primary/10 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-8 group"
    >
       <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
             <Zap className="w-7 h-7" />
          </div>
          <div>
             <h4 className="text-lg font-black text-slate-900 tracking-tight italic uppercase">{title}</h4>
             <p className="text-xs text-slate-500 font-medium tracking-tight mt-1">{message}</p>
          </div>
       </div>
       <button 
         onClick={onAction}
         className="w-full md:w-auto px-8 py-5 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-colors shadow-xl shadow-slate-900/10"
       >
         {actionLabel}
       </button>
    </motion.div>
  );
}
