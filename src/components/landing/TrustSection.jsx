"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, UserCheck } from "lucide-react";

export default function TrustSection() {
  const points = [
    {
      icon: ShieldCheck,
      title: "Diseñado para normas DGII",
      description: "Genera tus reportes 606 y 607 siguiendo fielmente los formatos requeridos por la oficina virtual de la DGII."
    },
    {
      icon: Lock,
      title: "Seguridad y Privacidad",
      description: "Tus datos financieros viajan encriptados. No guardamos información de acceso a tus cuentas y nunca compartimos tus reportes."
    },
    {
      icon: UserCheck,
      title: "Cero tecnicismos",
      description: "Hablamos tu idioma. Olvida los términos complejos de contabilidad y enfócate en lo que importa: tu negocio."
    }
  ];

  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-black tracking-tight text-slate-900 mb-6"
          >
            Hecho para negocios dominicanos
          </motion.h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {points.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-6 items-start"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-900">
                <point.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-2">{point.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  {point.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
