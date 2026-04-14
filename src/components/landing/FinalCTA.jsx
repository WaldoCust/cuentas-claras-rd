"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card rounded-[4rem] p-12 md:p-24 bg-primary text-white text-center relative overflow-hidden shadow-[0_32px_80px_rgba(59,130,246,0.3)] border-white/20">
          {/* Background Decor */}
          <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-white/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-slate-900/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 space-y-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-black uppercase tracking-[0.2em]"
            >
              <Sparkles className="w-4 h-4" /> Pruébalo gratis
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]"
            >
              Organiza tu negocio <br />
              <span className="italic">hoy mismo</span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-white/80 text-xl font-medium max-w-xl mx-auto"
            >
              Únete a cientos de emprendedores dominicanos que ya simplificaron su relación con la DGII.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="pt-6"
            >
              <Link 
                href="/signup" 
                className="inline-flex items-center gap-4 px-12 py-6 rounded-[2.5rem] bg-white text-primary font-black text-xl shadow-2xl hover:scale-[1.05] transition-transform uppercase tracking-widest"
              >
                Crear mi Cuenta <ArrowRight className="w-6 h-6" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
