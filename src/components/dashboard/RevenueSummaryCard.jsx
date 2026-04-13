"use client";

import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

function BaseSummaryCard({ title, value, icon: Icon, colorClass, delay, count }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card group p-8 rounded-[2.5rem] bg-white border-white shadow-xl shadow-slate-200/20"
    >
      <div className="flex justify-between items-start mb-8">
        <div className={cn(
          "p-4 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/10 transition-transform group-hover:scale-110",
          colorClass
        )}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col items-end">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Volumen</span>
           <span className="text-xl font-black text-slate-900 italic leading-none">{count}</span>
        </div>
      </div>
      <div>
        <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1 ml-0.5">{title}</h3>
        <p className="text-3xl font-black tracking-tighter text-slate-900 italic">
          <span className="text-sm not-italic font-bold text-slate-400 align-top mr-1">RD$</span>
          {parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 0 })}
        </p>
      </div>
      
      <div className="mt-8 pt-6 border-t border-slate-50 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
         <Activity className="w-3 h-3 text-primary" />
         Sincronizado • Tiempo Real
      </div>
    </motion.div>
  );
}

export function RevenueSummaryCard({ data, delay = 0.1 }) {
  return (
    <BaseSummaryCard 
      title="Ingresos Consolidados"
      value={data.gross}
      count={data.count}
      icon={TrendingUp}
      colorClass="bg-slate-900 group-hover:bg-primary"
      delay={delay}
    />
  );
}

export function ExpenseSummaryCard({ data, delay = 0.2 }) {
  return (
    <BaseSummaryCard 
      title="Gastos Operativos (606)"
      value={data.gross}
      count={data.count}
      icon={ShoppingBag}
      colorClass="bg-slate-900 group-hover:bg-rose-500"
      delay={delay}
    />
  );
}
