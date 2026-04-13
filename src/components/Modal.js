"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           onClick={onClose}
           className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div
           initial={{ opacity: 0, scale: 0.95, y: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.95, y: 20 }}
           className="relative w-full max-w-2xl bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl overflow-hidden overflow-y-auto max-h-[92vh]"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 italic tracking-tight">{title}</h3>
            <button 
              onClick={onClose}
              className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors group"
            >
              <X className="w-5 h-5 md:w-6 md:h-6 text-slate-400 group-hover:text-slate-900 transition-colors" />
            </button>
          </div>
          <div className="space-y-6">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
