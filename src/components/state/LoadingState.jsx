"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function LoadingState({ message = "Cargando datos fiscales..." }) {
  return (
    <div className="h-64 flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
      </div>
      <p className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 italic animate-pulse">
        {message}
      </p>
    </div>
  );
}
