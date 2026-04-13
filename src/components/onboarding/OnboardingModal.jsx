"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap, ArrowRight, X, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useOnboarding } from "@/lib/onboarding/state";

export default function OnboardingModal() {
  const { isAllCompleted, completedCount, loading } = useOnboarding();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!loading && completedCount === 0) {
      // Show modal only if they haven't started yet
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [loading, completedCount]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="glass-card rounded-[4rem] bg-white w-full max-w-2xl overflow-hidden relative shadow-[0_32px_120px_rgba(0,0,0,0.3)] shadow-primary/20"
        >
          {/* Decorative Top */}
          <div className="h-48 bg-slate-900 relative flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-primary/10 blur-[80px]" />
             <div className="w-20 h-20 rounded-[2.5rem] bg-primary flex items-center justify-center text-white shadow-2xl shadow-primary/40 relative z-10 rotate-12">
                <Zap className="w-10 h-10 fill-white" />
             </div>
             
             <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-8 right-8 p-2 text-white/40 hover:text-white transition-colors z-20"
             >
                <X className="w-6 h-6" />
             </button>
          </div>

          <div className="p-12 md:p-16 text-center">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-6 italic">
              ¡Bienvenido a <span className="text-primary not-italic">CuentasClarasRD!</span>
            </h2>
            <p className="text-slate-500 text-lg font-medium mb-12 leading-relaxed">
              Estamos felices de ayudarte a automatizar tu contabilidad. Para empezar con el pie derecho, te guiaremos a través de 3 simples pasos.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
               {[
                 { t: "1. Perfil", d: "Configura tu RNC" },
                 { t: "2. Factura", d: "Sube tu gasto" },
                 { t: "3. Reporte", d: "Genera el 606" }
               ].map((item, i) => (
                 <div key={i} className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-black uppercase text-primary mb-1">{item.t}</p>
                    <p className="text-xs font-bold text-slate-600">{item.d}</p>
                 </div>
               ))}
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              className="group w-full py-6 rounded-[2.5rem] bg-slate-900 text-white font-black text-lg shadow-2xl flex items-center justify-center gap-4 hover:bg-primary transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-widest"
            >
              Empezar guía rápida <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-8 flex items-center justify-center gap-2">
               <ShieldCheck className="w-4 h-4" /> Tus datos están seguros con nosotros
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
