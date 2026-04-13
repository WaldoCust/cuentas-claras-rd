/**
 * FieldError Component
 * Displays an inline validation error message with elite aesthetic.
 */
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

export default function FieldError({ error }) {
  if (!error) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="flex items-center gap-1.5 mt-2 ml-1"
      >
        <AlertCircle className="w-3 h-3 text-primary" />
        <span className="text-[9px] font-black text-primary uppercase tracking-wider">
          {error}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
