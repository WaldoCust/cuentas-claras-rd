"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-slate-200/40 bg-white/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter italic" style={{ color: '#0f172a' }}>
            CuentasClaras<span style={{ color: 'var(--primary)', fontStyle: 'normal' }}>RD</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-widest" style={{ color: '#475569' }}>
          <a href="#how-it-works" className="hover:text-primary transition-colors">Cómo funciona</a>
          <a href="#pricing" className="hover:text-primary transition-colors">Precios</a>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-black text-slate-600 hover:text-primary transition-colors">ENTRAR</Link>
          <Link 
            href="/signup" 
            className="px-8 py-3 rounded-2xl bg-primary text-white text-xs font-black shadow-xl shadow-primary/30 hover:scale-[1.05] transition-all uppercase tracking-widest"
          >
            Empezar Gratis
          </Link>
        </div>
      </div>
    </nav>
  );
}
