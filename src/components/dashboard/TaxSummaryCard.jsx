"use client";

import { motion } from "framer-motion";
import { Receipt, Info, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TaxSummaryCard({ taxData }) {
  const { collected = 0, deductible = 0, payable = 0, credit = 0, status } = taxData || {};

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-[3rem] p-10 bg-slate-900 border-slate-800 shadow-2xl relative overflow-hidden group"
    >
      <div className="relative z-10 space-y-8">
        <div className="flex justify-between items-start">
          <div className="p-4 rounded-2xl bg-primary/20 border border-primary/30 shadow-lg flex items-center justify-center">
            <Receipt className="w-8 h-8 text-primary" />
          </div>
          <div className={cn(
             "px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest",
             status === 'liability' ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          )}>
             {status === 'liability' ? 'Liquidación Pendiente' : 'Balance a Favor'}
          </div>
        </div>

        <div>
          <h3 className="text-3xl font-black text-white tracking-tighter italic mb-1">
            RD$ {(status === 'liability' ? payable : credit).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Saldo ITBIS Calculado • {new Date().toLocaleString('default', { month: 'long' })}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Cobrado (Ventas)</p>
              <p className="text-sm font-black text-white">RD$ {collected.toLocaleString()}</p>
           </div>
           <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Deducible (606)</p>
              <p className="text-sm font-black text-emerald-400">RD$ {deductible.toLocaleString()}</p>
           </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex items-center gap-3">
           <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Info className="w-4 h-4 text-primary" />
           </div>
           <p className="text-[10px] text-slate-500 font-medium leading-tight">
             Este balance se deriva exclusivamente de facturas validadas y gastos deducibles.
           </p>
        </div>
      </div>

      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-all duration-1000" />
    </motion.div>
  );
}
