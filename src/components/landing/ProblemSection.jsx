"use client";

import { motion } from "framer-motion";
import { AlertCircle, Clock, Ban } from "lucide-react";

export default function ProblemSection() {
  const problems = [
    {
      icon: Clock,
      title: "Hacer el 606 manual toma horas",
      description: "Digitar facturas una por una en Excel es una pérdida de tiempo que podrías usar en tu negocio."
    },
    {
      icon: AlertCircle,
      title: "Errores pueden costarte dinero",
      description: "Un error en un RNC o NCF puede causar multas de la DGII o rechazos en tus deducciones."
    },
    {
      icon: Ban,
      title: "Depender de otros te retrasa",
      description: "No esperes a fin de mes para saber cuánto vas a pagar de ITBIS. Ten el control total desde hoy."
    }
  ];

  return (
    <section className="py-32 px-6 bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-6"
          >
            ¿Cansado de Excel y errores con la DGII?
          </motion.h2>
          <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
            Cumplir con tus obligaciones fiscales no debería ser un dolor de cabeza mensual.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-10 rounded-[3rem] border-white bg-white/60 shadow-xl shadow-slate-200/40 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                <problem.icon className="w-32 h-32" />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-8 border border-red-100">
                <problem.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black mb-4 text-slate-900">{problem.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
