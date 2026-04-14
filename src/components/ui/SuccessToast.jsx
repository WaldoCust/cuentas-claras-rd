"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import { useEffect } from "react";

/**
 * Premium Success Toast for action confirmation.
 */
export default function SuccessToast({ show, title, message, onClose, duration = 4000 }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, onClose, duration]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] w-full max-w-md px-6"
        >
          <div className="bg-slate-900 border border-white/10 text-white p-6 rounded-[2.5rem] shadow-[0_32px_80px_rgba(0,0,0,0.5)] flex items-center gap-5 backdrop-blur-xl">
             <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-1">{title || "Confirmado"}</p>
                <p className="text-sm font-bold leading-tight truncate">{message}</p>
             </div>
             <button 
               onClick={onClose}
               className="p-3 hover:bg-white/10 rounded-xl transition-colors group"
             >
                <X className="w-5 h-5 text-slate-500 group-hover:text-white" />
             </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
