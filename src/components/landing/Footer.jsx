"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-20 px-6 border-t border-slate-200/60 bg-white/50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900">
              CuentasClaras<span className="text-primary italic">RD</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            Hecho con ❤️ para la República Dominicana
          </p>
        </div>
        <div className="flex gap-12 text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">
          <Link href="/terms" className="hover:text-primary transition-colors">Términos</Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacidad</Link>
          <Link href="/contact" className="hover:text-primary transition-colors">Contacto</Link>
        </div>
      </div>
    </footer>
  );
}
