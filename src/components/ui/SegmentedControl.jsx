"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SegmentedControl({ 
  options, 
  value, 
  onChange, 
  label,
  className,
  containerClassName
}) {
  return (
    <div className={cn("space-y-3", containerClassName)}>
      {label && (
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">
          {label}
        </label>
      )}
      <div className={cn(
        "relative w-full p-1.5 bg-slate-100/50 backdrop-blur-sm rounded-[1.5rem] flex gap-1 border border-slate-100 shadow-inner overflow-hidden",
        className
      )}>
        {options.map((option) => {
          const isActive = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "relative flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 z-10",
                isActive ? "text-white" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="segmented-active"
                  className="absolute inset-0 bg-slate-900 rounded-xl z-0 shadow-lg shadow-slate-900/10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
