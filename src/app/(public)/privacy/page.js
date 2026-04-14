"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPage() {
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
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-10 border border-emerald-100">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-8 italic">Política de Privacidad</h1>
          <p className="text-slate-500 mb-12 font-medium">Su información financiera es sagrada.</p>

          <div className="space-y-12 text-slate-600 leading-relaxed font-medium">
            <section>
              <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Protección de Datos</h2>
              <p>Encriptamos todos los datos sensibles (RNC, montos, facturas). Sus reportes generados solo son accesibles por usted y nadie más en nuestro equipo.</p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tighter">No Compartimos Información</h2>
              <p>CuentasClarasRD nunca venderá sus datos a terceros ni compartirá su información con la DGII de forma automática; usted tiene el control de descargar y subir sus propios archivos.</p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Privacidad de Recibos</h2>
              <p>Las imágenes de facturas que sube para procesamiento solo se guardan el tiempo necesario para extraer los datos mediante nuestra IA segura.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
