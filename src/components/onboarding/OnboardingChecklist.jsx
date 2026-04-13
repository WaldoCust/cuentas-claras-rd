"use client";

import { motion } from "framer-motion";
import { Zap, PartyPopper, X } from "lucide-react";
import OnboardingStepCard from "./OnboardingStepCard";
import { useOnboarding } from "@/lib/onboarding/state";
import { useRouter } from "next/navigation";

export default function OnboardingChecklist() {
  const { steps, activeStep, completedCount, isAllCompleted, isDismissed, dismissOnboarding, loading } = useOnboarding();
  const router = useRouter();

  if (loading || isDismissed) return null;

  const handleStepClick = (id) => {
    switch(id) {
      case 1: router.push('/dashboard/settings'); break;
      case 2: router.push('/dashboard/purchases'); break;
      case 3: router.push('/dashboard/taxes'); break; // Assuming 606 export is here
      default: break;
    }
  };

  const currentStepData = steps.find(s => s.id === activeStep) || steps[2];

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-[3rem] p-8 border-primary/20 bg-white/80 shadow-2xl relative overflow-hidden mb-12"
    >
      <div className="flex flex-col lg:flex-row justify-between gap-12 relative z-10">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                {isAllCompleted ? <PartyPopper className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight italic">
                  {isAllCompleted ? "¡Felicidades!" : "Completa tu activación"}
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                  {isAllCompleted ? "Ya eres un experto en CuentasClarasRD" : `${completedCount} de ${steps.length} pasos completados`}
                </p>
              </div>
            </div>
            {!isAllCompleted && (
              <button 
                onClick={dismissOnboarding}
                className="p-2 text-slate-300 hover:text-slate-500 transition-colors"
                title="Ignorar onboarding"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
               <span>Progreso de activación</span>
               <span>{Math.round((completedCount / steps.length) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${(completedCount / steps.length) * 100}%` }}
                 className="h-full bg-primary"
               />
            </div>
          </div>

          {!isAllCompleted && (
            <div className="p-6 rounded-[2rem] bg-slate-900 text-white flex flex-col md:flex-row items-center gap-6">
               <div className="flex-1 text-center md:text-left">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 font-mono">Próximo paso</p>
                  <p className="text-lg font-black tracking-tight">{currentStepData.title}</p>
               </div>
               <button 
                  onClick={() => handleStepClick(activeStep)}
                  className="px-8 py-4 rounded-xl bg-white text-slate-900 text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform"
               >
                  Continuar
               </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-col lg:w-72 gap-3">
          {steps.map((step) => (
            <OnboardingStepCard 
              key={step.id}
              step={step}
              isActive={step.id === activeStep}
              isCompleted={step.completed}
              onClick={() => handleStepClick(step.id)}
            />
          ))}
        </div>
      </div>
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-full bg-primary/5 blur-[80px] pointer-events-none" />
    </motion.div>
  );
}
