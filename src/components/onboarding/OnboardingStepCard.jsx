"use client";

import { CheckCircle2, Circle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OnboardingStepCard({ step, isActive, isCompleted, onClick }) {
  return (
    <div 
      className={cn(
        "flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer",
        isActive ? "bg-white border-primary shadow-lg shadow-primary/5 scale-[1.02]" : "bg-slate-50 border-slate-100 opacity-60 hover:opacity-100",
        isCompleted && "bg-emerald-50/50 border-emerald-100 opacity-100"
      )}
      onClick={onClick}
    >
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
        isCompleted ? "bg-emerald-500 text-white" : isActive ? "bg-primary text-white" : "bg-slate-200 text-slate-400"
      )}>
        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-xs font-black">{step.id}</span>}
      </div>
      
      <div className="flex-1">
        <p className={cn(
          "text-xs font-black uppercase tracking-tight",
          isCompleted ? "text-emerald-700" : isActive ? "text-slate-900" : "text-slate-400"
        )}>
          {step.title}
        </p>
      </div>

      {isActive && !isCompleted && <ChevronRight className="w-4 h-4 text-primary animate-pulse" />}
    </div>
  );
}
