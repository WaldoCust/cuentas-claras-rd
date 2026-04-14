"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

export default function FieldError({ error }) {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0, y: -5 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -5 }}
          className="overflow-hidden"
        >
          <div className="flex items-center gap-1.5 mt-1.5 ml-1">
             <AlertCircle className="w-3 h-3 text-rose-500" />
             <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest leading-none">
                {error}
             </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
