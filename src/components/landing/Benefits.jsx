"use client";

import { motion } from "framer-motion";
import { Sparkles, BarChart3, History, ShieldCheck } from "lucide-react";

export default function Benefits() {
  const benefits = [
    {
      icon: Sparkles,
      title: "Generación automática de 606",
      description: "Nuestra IA extrae los datos de tus facturas y rellena el reporte 606 sin errores humanos."
    },
    {
      icon: BarChart3,
      title: "Clasificación inteligente",
      description: "El sistema clasifica tus gastos según las categorías de la DGII de forma automática."
    },
    {
      icon: History,
      title: "Historial organizado",
      description: "Mantén todas tus facturas digitalizadas y organizadas por mes, fáciles de encontrar."
    },
    {
      icon: ShieldCheck,
      title: "Preparado para DGII",
      description: "Genera archivos validados que cumplen con todas las normas vigentes de la DGII."
    }
  ];

  return (
    <section className="py-32 px-6 bg-slate-900 text-white overflow-hidden relative">
      {/* Decorative Orbs */}
      <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-12"
            >
              Beneficios Clave
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-black tracking-tight mb-8 leading-tight"
            >
              Todo lo que necesitas <br />
              <span className="text-primary italic">en un solo lugar.</span>
            </motion.h2>
            <p className="text-slate-400 text-xl font-medium mb-12 leading-relaxed">
              Diseñado específicamente para pequeños negocios y freelancers en República Dominicana.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-6">
                  <benefit.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black mb-3">{benefit.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
