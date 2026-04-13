"use client";

import { motion } from "framer-motion";
import { Search, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

/**
 * Custom 404 Page (Not Found).
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white premium-gradient-bg">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center relative z-10"
      >
        <div className="inline-flex p-6 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl mb-10">
          <Search className="w-12 h-12 text-slate-300" />
        </div>
        
        <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-4 italic">
          Extravío de <span className="text-primary not-italic">Ruta</span>
        </h2>
        
        <p className="text-slate-500 font-medium mb-10 leading-relaxed max-w-xs mx-auto text-sm">
          El módulo o documento que estás buscando no existe o ha sido movido a una nueva categoría.
        </p>

        <div className="flex flex-col gap-3">
           <Link
             href="/dashboard"
             className="px-8 py-5 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-3 hover:scale-[1.05] active:scale-95 transition-all"
           >
             <Home className="w-5 h-5" /> Retornar al Control
           </Link>
           <button
             onClick={() => window.history.back()}
             className="px-8 py-4 rounded-2xl bg-white border border-slate-100 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
           >
             <ArrowLeft className="w-4 h-4" /> Volver Atrás
           </button>
        </div>

        <div className="mt-20">
           <p className="text-[10px] text-slate-300 font-extrabold uppercase tracking-[0.3em]">
             CuentasClaras RD • Santiago
           </p>
        </div>
      </motion.div>
    </div>
  );
}
