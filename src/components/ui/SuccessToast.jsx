/**
 * SuccessToast Component
 * Floating notification for successful actions.
 */
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function SuccessToast({ show, title, message, onClose }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-10 right-10 flex items-center gap-4 px-8 py-5 rounded-[2rem] bg-slate-900 text-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-[100] border border-slate-800 cursor-pointer"
          onClick={onClose}
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
             <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div>
             <p className="text-sm font-black italic tracking-tight">{title || "Operación Exitosa"}</p>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{message || "Sincronizado correctamente"}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
