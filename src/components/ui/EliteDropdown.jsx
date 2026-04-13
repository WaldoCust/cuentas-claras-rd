"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EliteDropdown({ 
  options, 
  value, 
  onChange, 
  placeholder = "Seleccionar...", 
  label,
  icon: Icon,
  className,
  dropdownClassName
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("space-y-2", className)} ref={containerRef}>
      {label && (
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 flex items-center justify-between px-5 transition-all duration-300",
            isOpen ? "ring-2 ring-primary/20 bg-white shadow-xl" : "hover:bg-white hover:border-slate-200",
            !selectedOption && "text-slate-400"
          )}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {Icon && <Icon className="w-5 h-5 text-slate-300 flex-shrink-0" />}
            <span className="text-sm font-bold text-slate-900 truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 5, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "absolute z-[100] w-full mt-2 glass-card rounded-2xl border-white overflow-hidden shadow-2xl p-1.5",
                dropdownClassName
              )}
            >
              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {options.length === 0 ? (
                  <div className="px-4 py-8 text-center space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Sin opciones disponibles</p>
                    <p className="text-[8px] text-slate-300 font-bold uppercase tracking-tight">Verifique su conexión o filtros</p>
                  </div>
                ) : (
                  options.map((option, index) => (
                    <motion.div
                      key={option.value}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onChange(option.value);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-xs font-bold group text-left",
                          value === option.value 
                            ? "bg-primary text-white shadow-lg shadow-primary/20" 
                            : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                        )}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {option.icon && <option.icon className={cn("w-4 h-4 flex-shrink-0", value === option.value ? "text-white" : "text-slate-400 group-hover:text-primary")} />}
                          <span className="truncate">{option.label}</span>
                        </div>
                        {value === option.value && <Check className="w-3.5 h-3.5 flex-shrink-0 ml-2" />}
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
