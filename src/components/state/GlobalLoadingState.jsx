"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Loader2 } from "lucide-react";

/**
 * Full-screen loading overlay for initial boot and critical transitions.
 */
export default function GlobalLoadingState({ message = "Iniciando Ecosistema Seguro..." }) {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-6 bg-white premium-gradient-bg">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center relative z-10"
      >
        <div className="inline-flex p-6 rounded-[2rem] bg-white border border-slate-100 shadow-2xl mb-12 relative overflow-hidden group">
          <ShieldCheck className="w-16 h-16 text-primary relative z-10" />
          <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
             className="absolute inset-0 bg-primary/5 rounded-full blur-xl scale-150"
          />
        </div>
        
        <h1 className="text-4xl font-black tracking-tighter mb-4 text-slate-900 italic">
          CuentasClaras<span className="text-primary not-italic">RD</span>
        </h1>
        
        <div className="flex flex-col items-center gap-4">
           <div className="flex items-center gap-3 px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-full shadow-sm">
             <Loader2 className="w-4 h-4 text-primary animate-spin" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
               {message}
             </span>
           </div>
           <p className="text-[10px] text-slate-300 font-extrabold uppercase tracking-widest mt-2 animate-pulse">
             Santiago de los Caballeros • Dominicana
           </p>
        </div>
      </motion.div>
    </div>
  );
}
