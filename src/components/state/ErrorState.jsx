"use client";

import { motion } from "framer-motion";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function ErrorState({ 
  message = "Ocurrió un error al sincronizar con el backend.", 
  onRetry 
}) {
  return (
    <div className="py-24 text-center space-y-8">
      <div className="w-20 h-20 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-center justify-center mx-auto animate-bounce shadow-lg shadow-rose-500/10">
        <AlertCircle className="w-10 h-10 text-rose-500" />
      </div>
      <div className="space-y-2">
        <h4 className="text-xl font-black text-rose-900 tracking-tight">Error de Conexión</h4>
        <p className="text-sm text-slate-500 max-w-xs mx-auto font-medium">
          {message}
        </p>
      </div>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-8 py-4 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2 mx-auto"
        >
          <RefreshCcw className="w-4 h-4" /> Reintentar Sincronización
        </button>
      )}
    </div>
  );
}
