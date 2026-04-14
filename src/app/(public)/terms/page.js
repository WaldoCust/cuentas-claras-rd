"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-primary transition-colors mb-12 uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Inicio
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card bg-white rounded-[3rem] p-12 md:p-20 border-white shadow-2xl shadow-slate-200/20"
        >
          <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-8 italic">Términos de Servicio</h1>
          <p className="text-slate-500 mb-12 font-medium">Última actualización: 13 de Abril, 2026</p>

          <div className="space-y-12 text-slate-600 leading-relaxed font-medium">
            <section>
              <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tighter">1. Aceptación del Servicio</h2>
              <p>Al acceder a CuentasClarasRD, usted acepta cumplir con nuestros términos diseñados para garantizar la transparencia y seguridad de su contabilidad dominicana.</p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tighter">2. Uso de la Plataforma</h2>
              <p>Esta herramienta está destinada a la automatización de reportes 606 y 607. Es responsabilidad del usuario verificar la veracidad de los datos antes de su envío a la DGII.</p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tighter">3. Limitación de Responsabilidad</h2>
              <p>CuentasClarasRD no es una firma de contadores. Somos un software de automatización. El cumplimiento legal final sigue siendo responsabilidad del contribuyente.</p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tighter">4. Suscripciones</h2>
              <p>Los planes Pro y Contable se facturan mensualmente. Puede cancelar su renovación en cualquier momento desde su panel de ajustes.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
