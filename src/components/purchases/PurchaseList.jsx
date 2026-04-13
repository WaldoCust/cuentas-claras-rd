"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical, Search, Filter, Download, Trash2, Calendar, FileText, ExternalLink, ShieldCheck, ShoppingBag, Laptop, User } from "lucide-react";
import EliteDropdown from "@/components/ui/EliteDropdown";
import SegmentedControl from "@/components/ui/SegmentedControl";
import { cn } from "@/lib/utils";
import { EXPENSE_CATEGORIES } from "@/lib/validation/purchases";

export function PurchaseFilters({ filters, setFilters }) {
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <aside className="space-y-6">
      <div className="glass-card p-8 rounded-[2.5rem] bg-white border-white shadow-xl space-y-10 relative overflow-visible">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-2">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Filtrar Gastos</h3>
        </div>
        
        <div className="space-y-8">
          <EliteDropdown 
            label="Tipo de Gasto (606)"
            icon={ShoppingBag}
            placeholder="Todas las Categorías"
            options={Object.entries(EXPENSE_CATEGORIES).map(([code, label]) => ({
              value: code,
              label: label
            }))}
            value={filters.category || ""}
            onChange={(val) => updateFilter('category', val)}
          />

          <SegmentedControl 
            label="Origen del Dato"
            options={[
              { value: "", label: "Todos" },
              { value: "ai_parsed", label: "AI Parsed" },
              { value: "manual", label: "Manual" }
            ]}
            value={filters.source || ""}
            onChange={(val) => updateFilter('source', val)}
          />

          <button 
             onClick={() => setFilters({})}
             className="w-full py-4 rounded-2xl bg-white border border-dashed border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all mt-4"
          >
             Restablecer Filtros
          </button>
        </div>
      </div>
    </aside>
  );
}

export function PurchaseList({ purchases, onEdit, onArchive }) {
  if (purchases.length === 0) return null;

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {purchases.map((purchase, index) => (
          <motion.div 
            layout
            key={purchase.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card group p-6 rounded-[2.25rem] bg-white/70 border-white/60 shadow-xl shadow-slate-200/20 hover:scale-[1.01] transition-all hover:bg-white flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-6 flex-1">
              <div className="w-16 h-16 rounded-[1.5rem] bg-slate-900 border-4 border-white flex flex-col items-center justify-center shadow-lg shadow-slate-900/10">
                 <span className="text-[8px] font-black text-slate-400 uppercase leading-none">NCF</span>
                 <span className="text-xs font-black text-white italic tracking-tighter mt-0.5">
                   {purchase.ncf?.slice(0, 3)}
                 </span>
              </div>
              <div className="space-y-1">
                 <div className="flex items-center gap-3">
                    <h4 className="text-lg font-black text-slate-900 tracking-tight italic">
                      {purchase.supplier_name || purchase.target_name || "Suplidor Desconocido"}
                    </h4>
                    {purchase.is_deductible && (
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    )}
                 </div>
                 <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>RNC: {purchase.rnc_target}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                    <span>{EXPENSE_CATEGORIES[purchase.revenue_type] || "Gasto General"}</span>
                 </div>
              </div>
            </div>

            <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-50">
               <div className="text-right space-y-1">
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                    Fecha: {purchase.date_emission}
                  </p>
                  <p className="text-xl font-black text-slate-900 italic tracking-tight">
                    RD$ {parseFloat(purchase.amount_gross + (purchase.amount_itbis || 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
               </div>
               
               <div className="flex gap-3">
                  <button className="p-3.5 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:bg-primary hover:text-white transition-all shadow-sm">
                    <FileText className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onArchive(purchase.id)}
                    className="p-3.5 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
               </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
