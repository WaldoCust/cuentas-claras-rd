"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  confirmText = "Confirmar", 
  cancelText = "Cancelar",
  variant = "primary" 
}) {
  if (!isOpen) return null;

  const variants = {
    primary: {
      icon: Check,
      color: "bg-primary shadow-primary/20",
      button: "bg-primary hover:bg-primary/90 text-white shadow-primary/20"
    },
    danger: {
      icon: AlertTriangle,
      color: "bg-rose-500 shadow-rose-500/20",
      button: "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20"
    }
  };

  const current = variants[variant] || variants.primary;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 0.95 }}
           className="relative w-full max-w-md glass-card bg-white rounded-[2.5rem] p-10 shadow-3xl text-center overflow-hidden"
        >
          <div className={cn(
            "w-16 h-16 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 text-white shadow-xl",
            current.color
          )}>
            <current.icon className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-4 italic">{title}</h3>
          <p className="text-sm text-slate-500 font-medium leading-relaxed mb-10">
            {description}
          </p>

          <div className="flex gap-4">
             <button 
               onClick={onClose}
               className="flex-1 py-4 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-100 transition-all"
             >
                {cancelText}
             </button>
             <button 
               onClick={() => { onConfirm(); onClose(); }}
               className={cn(
                 "flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-lg",
                 current.button
               )}
             >
                {confirmText}
             </button>
          </div>

          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl text-slate-300 hover:text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
