"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PricingPreview() {
  return (
    <section id="pricing" className="py-32 px-6 bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="glass-card rounded-[4rem] p-12 md:p-20 relative overflow-hidden flex flex-col lg:flex-row items-center gap-16 border-white bg-white/60 shadow-2xl shadow-slate-200/20">
          <div className="flex-1 text-left relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-8"
            >
              Precio Transparente
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl font-black tracking-tight text-slate-900 mb-8 leading-tight"
            >
              Empieza desde <br />
              <span className="text-primary italic">RD$ 300 / mes</span>
            </motion.h2>
            <p className="text-slate-500 text-lg font-medium mb-12 max-w-md">
              Sin contratos complicados. Paga solo por lo que usas y escala a medida que tu negocio crece.
            </p>
            <ul className="space-y-4 mb-12">
              {["Hasta 10 facturas mensuales", "Reporte 606 automático", "Almacenamiento en la nube", "Soporte vía WhatsApp"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full lg:w-[400px] relative z-10">
            <div className="glass-card bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl shadow-slate-900/30 text-center space-y-10 border-white/10">
              <div className="space-y-4">
                 <p className="text-[10px] uppercase font-black tracking-[0.3em] opacity-60">Plan Emprendedor</p>
                 <div className="flex flex-col gap-1">
                    <h3 className="text-6xl font-black italic">RD$ 300</h3>
                    <p className="text-sm opacity-60 font-medium tracking-widest uppercase">Por Mes</p>
                 </div>
              </div>
              <div className="space-y-6 pt-4 border-t border-white/5">
                <Link 
                  href="/signup" 
                  className="w-full py-5 rounded-[2rem] bg-primary text-white font-black text-sm shadow-2xl flex items-center justify-center gap-3 hover:scale-[1.05] transition-transform uppercase tracking-widest shadow-primary/30"
                >
                  Empezar ahora <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-[10px] opacity-40 uppercase tracking-widest font-bold">Sin tarjetas de crédito inicialmente</p>
              </div>
            </div>
          </div>

          {/* Background Decor */}
          <div className="absolute top-0 right-0 w-[40%] h-full bg-primary/5 blur-[120px] pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
