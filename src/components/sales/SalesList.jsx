"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Filter, Search, Download, Trash2, Calendar, FileText, ExternalLink, ShieldCheck, Tag, CreditCard, User, Globe, ListFilter } from "lucide-react";
import EliteDropdown from "@/components/ui/EliteDropdown";
import SegmentedControl from "@/components/ui/SegmentedControl";
import { cn } from "@/lib/utils";
import { REVENUE_CATEGORIES } from "@/lib/validation/sales";

export function SalesFilters({ filters, setFilters, clients = [] }) {
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <aside className="space-y-6">
      <div className="glass-card p-8 rounded-[2.5rem] bg-white border-white shadow-xl space-y-10 relative overflow-visible">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-2">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Filtrar Ventas</h3>
        </div>
        
        <div className="space-y-8">
          <EliteDropdown 
            label="Cliente"
            icon={User}
            placeholder="Todos los Clientes"
            options={clients.map(c => ({
              value: c.id,
              label: c.business_name
            }))}
            value={filters.clientId || ""}
            onChange={(val) => updateFilter('clientId', val)}
          />

          <EliteDropdown 
            label="Tipo de Ingreso (607)"
            icon={Tag}
            placeholder="Todas las Categorías"
            options={Object.entries(REVENUE_CATEGORIES).map(([code, label]) => ({
              value: code,
              label: label
            }))}
            value={filters.revenueType || ""}
            onChange={(val) => updateFilter('revenueType', val)}
          />

          <SegmentedControl 
            label="Estatus"
            options={[
              { value: "", label: "Todos" },
              { value: "issued", label: "Emitidas" },
              { value: "voided", label: "Anuladas" }
            ]}
            value={filters.status || ""}
            onChange={(val) => updateFilter('status', val)}
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

export function SalesList({ sales, onEdit, onArchive }) {
  if (sales.length === 0) return null;

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {sales.map((sale, index) => (
          <motion.div 
            layout
            key={sale.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card group p-6 rounded-[2.25rem] bg-white/70 border-white/60 shadow-xl shadow-slate-200/20 hover:scale-[1.01] transition-all hover:bg-white flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-6 flex-1">
              <div className="w-16 h-16 rounded-[1.5rem] bg-primary/10 flex flex-col items-center justify-center font-black text-primary text-xs italic shadow-inner">
                {sale.revenue_type || "01"}
              </div>
              <div className="space-y-1">
                 <div className="flex items-center gap-3">
                    <h4 className="text-lg font-black text-slate-900 tracking-tight italic">
                      {sale.client?.business_name || "Venta de Contado / Consumo Final"}
                    </h4>
                    {sale.source_type === 'invoice_linked' && (
                       <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-black uppercase tracking-tighter">Factura</span>
                    )}
                 </div>
                 <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span className="font-mono">{sale.ncf || "VENTA DIRECTA"}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                    <span>{REVENUE_CATEGORIES[sale.revenue_type] || "Ingresos Operativos"}</span>
                 </div>
              </div>
            </div>

            <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-50">
               <div className="text-right space-y-1">
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                    Fecha: {sale.date_emission}
                  </p>
                  <p className="text-xl font-black text-slate-900 italic tracking-tight">
                    RD$ {parseFloat(sale.amount_gross + (sale.amount_itbis || 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
               </div>
               
               <div className="flex gap-3">
                  <button 
                    onClick={() => onEdit(sale)}
                    className="p-3.5 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onArchive(sale.id)}
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
