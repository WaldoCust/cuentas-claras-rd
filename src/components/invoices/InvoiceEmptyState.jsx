"use client";

import { FileText, FilePlus2, SearchX } from "lucide-react";
import { motion } from "framer-motion";

export default function InvoiceEmptyState({ type = "empty", onAction, actionLabel }) {
  const configs = {
    empty: {
      icon: FileText,
      title: "Sin Facturas Emitidas",
      message: "Tu historial fiscal está listo para recibir el primer comprobante electrónico. Empieza a facturar con validez legal.",
      buttonIcon: FilePlus2
    },
    search: {
      icon: SearchX,
      title: "Búsqueda sin resultados",
      message: "No hemos encontrado facturas que coincidan con los criterios aplicados. Prueba con otro NCF o Cliente.",
      buttonIcon: null
    }
  };

  const config = configs[type];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-[3rem] p-20 flex flex-col items-center text-center space-y-8 bg-white/40 border-white/60 shadow-xl"
    >
      <div className="w-24 h-24 rounded-[2.5rem] bg-slate-900 flex items-center justify-center shadow-2xl shadow-slate-900/20">
         <config.icon className="w-10 h-10 text-white" />
      </div>
      
      <div className="space-y-3 max-w-sm">
         <h4 className="text-2xl font-black text-slate-900 italic tracking-tight">{config.title}</h4>
         <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
           {config.message}
         </p>
      </div>

      {onAction && (
        <button 
          onClick={onAction}
          className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:scale-[1.05] transition-all"
        >
          {config.buttonIcon && <config.buttonIcon className="w-4 h-4" />}
          {actionLabel || "Nueva Factura"}
        </button>
      )}
    </motion.div>
  );
}
