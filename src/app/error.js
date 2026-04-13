"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCcw, Home, MessageSquare } from "lucide-react";
import Link from "next/link";
import { reportError } from "@/lib/monitoring/report-error";

/**
 * Global Error Boundary for Next.js App Router.
 * This component is the ultimate fallback for runtime exceptions.
 */
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Automatically report the crash to our internal monitoring
    reportError(error, "Global:AppErrorBoundary", { 
      message: error.message,
      digest: error.digest 
    });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white premium-gradient-bg">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-rose-500/5 rounded-full blur-[140px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full text-center relative z-10"
      >
        <div className="inline-flex p-6 rounded-[2.5rem] bg-rose-50 border border-rose-100 shadow-xl mb-10">
          <AlertCircle className="w-12 h-12 text-rose-500" />
        </div>
        
        <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-4 italic">
          Ocurrió un <span className="text-rose-500 not-italic">imprevisto</span>
        </h2>
        
        <p className="text-slate-500 font-medium mb-10 leading-relaxed max-w-md mx-auto">
          No te preocupes, tus datos fiscales están seguros. Estamos experimentando un problema técnico momentáneo.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <button
             onClick={() => reset()}
             className="px-8 py-4 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/30 flex items-center justify-center gap-3 hover:scale-[1.05] active:scale-95 transition-all"
           >
             <RefreshCcw className="w-5 h-5" /> Reintentar Operación
           </button>
           <Link
             href="/dashboard"
             className="px-8 py-4 rounded-2xl bg-white border border-slate-200 text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
           >
             <Home className="w-5 h-5" /> Volver al Inicio
           </Link>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-100">
           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-4">Código de Incidencia</p>
           <div className="bg-slate-50 p-4 rounded-2xl font-mono text-[9px] text-slate-400 break-all select-all">
              {error.digest || `ERR_${Math.random().toString(36).substring(7).toUpperCase()}`}
           </div>
           <button className="mt-6 flex items-center gap-2 mx-auto text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
              <MessageSquare className="w-4 h-4" /> Reportar a Soporte WhatsApp
           </button>
        </div>
      </motion.div>
    </div>
  );
}
