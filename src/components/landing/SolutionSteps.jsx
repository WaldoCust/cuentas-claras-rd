"use client";

import { motion } from "framer-motion";
import { Upload, Cpu, Download } from "lucide-react";

export default function SolutionSteps() {
  const steps = [
    {
      icon: Upload,
      title: "Sube tu factura",
      description: "Toma una foto o sube el PDF de tu factura de gastos."
    },
    {
      icon: Cpu,
      title: "IA extrae los datos",
      description: "Nuestro sistema identifica RNC, NCF, montos e ITBIS automáticamente."
    },
    {
      icon: Download,
      title: "Descarga tu 606",
      description: "Genera el archivo listo para subir a la Oficina Virtual de la DGII."
    }
  ];

  return (
    <section id="how-it-works" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-6"
          >
            Cómo funciona
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-6"
          >
            Tu reporte listo en 3 simples pasos
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[2.5rem] left-[15%] right-[15%] h-[2px] bg-slate-100 -z-10" />
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-3xl bg-white border-2 border-slate-100 shadow-xl flex items-center justify-center mb-8 relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center shadow-lg">
                  {index + 1}
                </div>
                <step.icon className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-black mb-4 text-slate-900">{step.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed max-w-[250px]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
