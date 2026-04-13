"use client";

import { motion } from "framer-motion";
import { DollarSign, History, Tag, TrendingUp, AlertCircle } from "lucide-react";

function MetricCard({ label, value, icon: Icon, color, delay }) {
  return (
    <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ delay }}
       className="glass-card group p-6 rounded-[2rem] bg-white border-white shadow-xl shadow-slate-200/20"
    >
       <div className="flex justify-between items-center mb-6">
          <div className={`p-4 rounded-2xl ${color} flex items-center justify-center shadow-lg shadow-slate-900/10`}>
             <Icon className="w-5 h-5 text-white" />
          </div>
          <TrendingUp className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
       </div>
       <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-[0.2em] mb-1">{label}</p>
       <p className="text-2xl font-black text-slate-900 italic tracking-tight">{value}</p>
    </motion.div>
  );
}

export default function SalesSummaryCards({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <MetricCard 
        label="Total Ventas (Periodo)" 
        value={`RD$ ${stats.total.toLocaleString()}`} 
        icon={DollarSign} 
        color="bg-slate-900"
        delay={0.1} 
      />
      <MetricCard 
        label="ITBIS por Pagar" 
        value={`RD$ ${stats.itbis.toLocaleString()}`} 
        icon={Tag} 
        color="bg-primary"
        delay={0.2} 
      />
      <MetricCard 
        label="Transacciones" 
        value={stats.count} 
        icon={History} 
        color="bg-slate-900"
        delay={0.3} 
      />
    </div>
  );
}
