"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PricingPreview() {
  return (
    <section id="pricing" className="py-32 px-6 bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="glass-card rounded-[4rem] p-12 md:p-20 relative overflow-hidden flex flex-col lg:flex-row items-center gap-16 border-white bg-white/60 shadow-2xl shadow-slate-200/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full relative z-10">
            {/* Starter Plan */}
            <div className="glass-card bg-white/80 rounded-[3rem] p-10 border-slate-100 flex flex-col hover:border-primary/30 transition-all active:scale-[0.98]">
              <div className="space-y-4 mb-8">
                 <p className="text-[10px] uppercase font-black tracking-[0.3em]" style={{ color: '#475569' }}>Starter</p>
                 <div className="flex flex-col">
                    <h3 className="text-4xl font-black italic text-slate-900">RD$ 0</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Gratis Siempre</p>
                 </div>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {["Hasta 5 facturas", "Clientes limitados", "Ingreso Manual"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-[11px] font-bold text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="w-full py-4 rounded-2xl bg-slate-100 text-slate-900 font-black text-[10px] uppercase tracking-widest text-center hover:bg-slate-200 transition-all">
                Probar Gratis
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="glass-card bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-slate-900/30 flex flex-col scale-105 border-primary/20 relative">
              <div className="absolute top-6 right-8 px-3 py-1 bg-primary rounded-full text-[8px] font-black uppercase tracking-widest">Popular</div>
              <div className="space-y-4 mb-8">
                 <p className="text-[10px] uppercase font-black tracking-[0.3em]" style={{ color: 'rgba(255,255,255,0.7)' }}>Pro</p>
                 <div className="flex flex-col">
                    <h3 className="text-4xl font-black italic" style={{ color: 'white' }}>RD$ 750</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Por Mes</p>
                 </div>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {["Clientes Ilimitados", "Exportación 606/607", "Dashboard Fiscal", "Soporte Prioritario"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-[11px] font-bold opacity-90">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="w-full py-4 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest text-center shadow-xl shadow-primary/30 hover:scale-[1.05] transition-transform">
                Obtener Pro
              </Link>
            </div>

            {/* Contable Plan */}
            <div className="glass-card bg-white/80 rounded-[3rem] p-10 border-slate-100 flex flex-col hover:border-primary/30 transition-all active:scale-[0.98]">
              <div className="space-y-4 mb-8">
                 <p className="text-[10px] uppercase font-black tracking-[0.3em]" style={{ color: '#475569' }}>Contable</p>
                 <div className="flex flex-col">
                    <h3 className="text-4xl font-black italic text-slate-900">RD$ 2,000</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Por Mes</p>
                 </div>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {["Multi-Empresas", "Alto Volumen (OCR)", "API de Consulta", "Contable Dedicado"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-[11px] font-bold text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="w-full py-4 rounded-2xl bg-slate-100 text-slate-900 font-black text-[10px] uppercase tracking-widest text-center hover:bg-slate-200 transition-all">
                Contactar Ventas
              </Link>
            </div>
          </div>

          {/* Background Decor */}
          <div className="absolute top-0 right-0 w-[40%] h-full bg-primary/5 blur-[120px] pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
