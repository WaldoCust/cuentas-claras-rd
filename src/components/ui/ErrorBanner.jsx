/**
 * ErrorBanner Component
 * High-visibility banner for critical section errors or blocking states.
 */
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

export default function ErrorBanner({ message, onClose }) {
  if (!message) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="overflow-hidden mb-8"
      >
        <div className="p-5 rounded-[1.5rem] bg-rose-50 border border-rose-100 flex items-start gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-rose-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-black text-rose-900 uppercase tracking-widest mb-1 italic">Atención Fiscal</h4>
            <p className="text-[10px] text-rose-700 font-bold leading-relaxed uppercase tracking-tight">
              {message}
            </p>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-2 hover:bg-rose-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-rose-400" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
