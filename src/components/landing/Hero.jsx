"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative pt-48 pb-32 px-6 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white border border-slate-100 shadow-xl shadow-slate-200/20 mb-12"
        >
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Simple • Rápido • Seguro</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="text-6xl md:text-[8rem] font-black tracking-tighter mb-10 leading-[0.85]"
          style={{ color: '#0f172a' }}
        >
          Reportes 606/607 <br />
          <span className="glow-text drop-shadow-sm italic" style={{ color: 'var(--primary)' }}>en minutos, no horas.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto text-xl font-medium mb-16 leading-relaxed"
          style={{ color: '#475569' }}
        >
          Simplifica tu trabajo contable y evita errores con la DGII. La plataforma elite diseñada para el mercado fiscal dominicano.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row items-center justify-center gap-8"
        >
          <Link 
            href="/signup" 
            className="group px-10 py-5 rounded-[2rem] bg-slate-900 text-white font-black text-lg shadow-2xl shadow-slate-900/20 flex items-center gap-4 hover:scale-[1.05] transition-all hover:bg-primary hover:shadow-primary/30"
          >
            Empezar Gratis <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="#how-it-works"
            className="text-sm font-black text-slate-400 hover:text-primary transition-colors flex items-center gap-2 uppercase tracking-widest"
          >
            Ver demo rápida
          </Link>
        </motion.div>

        {/* Product Preview Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", damping: 25 }}
          className="mt-24 relative max-w-5xl mx-auto"
        >
          <div className="glass-card rounded-[3rem] p-3 border-white shadow-2xl shadow-primary/5 bg-white/40">
            <div className="bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-inner aspect-video relative group">
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="flex flex-col items-center gap-4 text-slate-400">
                    <Zap className="w-16 h-16 opacity-20" />
                    <p className="text-xs font-black uppercase tracking-widest opacity-40">Demo de Procesamiento Automático</p>
                 </div>
              </div>
              <img 
                src="/cuentas_claras_dashboard_mockup.png" 
                alt="606 Automation Preview"
                className="w-full h-full object-cover opacity-80"
              />
            </div>
          </div>
          
          {/* Status Floating Card */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute -top-8 -right-8 glass-card p-6 rounded-3xl shadow-2xl border-white hidden lg:block bg-white/80"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado de Reporte</p>
                <p className="text-sm font-black text-slate-900">606 Validado y Listo</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
