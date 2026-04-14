"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-32 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-primary transition-colors mb-12 uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Inicio
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card bg-white rounded-[4rem] p-12 md:p-20 border-white shadow-2xl shadow-slate-200/20"
        >
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 mb-8 italic">Estamos aquí para ayudarte</h1>
          <p className="text-slate-500 text-lg mb-16 font-medium max-w-lg mx-auto leading-relaxed">
            ¿Tienes dudas sobre el 606 o necesitas ayuda configurando tu cuenta? Nuestro equipo en Santo Domingo responde rápido.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="p-10 rounded-[2.5rem] bg-slate-900 text-white flex flex-col items-center gap-6 shadow-2xl shadow-slate-900/20 group">
              <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <MessageSquare className="w-8 h-8" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">WhatsApp Soporte</p>
                <p className="text-xl font-black">Respuesta Instantánea</p>
              </div>
              <a 
                href="https://wa.me/18491234567" 
                className="w-full py-4 rounded-2xl bg-white text-slate-900 font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
              >
                Abrir Chat
              </a>
            </div>

            <div className="p-10 rounded-[2.5rem] bg-white border border-slate-100 flex flex-col items-center gap-6 hover:border-primary/30 transition-all group">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="w-8 h-8" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">E-mail</p>
                <p className="text-xl font-black text-slate-900">soporte@cuentasclaras.rd</p>
              </div>
              <a 
                href="mailto:soporte@cuentasclaras.rd" 
                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-slate-900/10"
              >
                Enviar Correo
              </a>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 text-slate-400 font-bold text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            Santo Domingo, República Dominicana
          </div>
        </motion.div>
      </div>
    </main>
  );
}
