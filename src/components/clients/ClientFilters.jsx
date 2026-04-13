"use client";

import { Filter, ShieldCheck, Trash2, Globe, Users } from "lucide-react";
import SegmentedControl from "@/components/ui/SegmentedControl";
import EliteDropdown from "@/components/ui/EliteDropdown";
import { cn } from "@/lib/utils";

export default function ClientFilters({ filters, setFilters }) {
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <aside className="space-y-6">
      <div className="glass-card p-8 rounded-[2.5rem] bg-white border-white shadow-xl space-y-10 relative overflow-visible">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-2">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Filtrar Cartera</h3>
        </div>
        
        <div className="space-y-8">
          <SegmentedControl 
            label="Estatus del Registro"
            options={[
              { value: "active", label: "Activos" },
              { value: "archived", label: "Archivados" }
            ]}
            value={filters.status || "active"}
            onChange={(val) => updateFilter('status', val)}
          />

          <EliteDropdown 
            label="Modalidad Fiscal"
            icon={Globe}
            placeholder="Todas las Modalidades"
            options={[
              { value: "", label: "Todas las Modalidades" },
              { value: "Consumo Final", label: "Consumo Final (B02)" },
              { value: "Crédito Fiscal", label: "Crédito Fiscal (B01)" },
              { value: "Especial", label: "Registro Especial" }
            ]}
            value={filters.type || ""}
            onChange={(val) => updateFilter('type', val)}
          />

          <button 
             onClick={() => setFilters({ status: 'active', type: '' })}
             className="w-full py-4 rounded-2xl bg-white border border-dashed border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all mt-4"
          >
             Restablecer Filtros
          </button>
        </div>
      </div>

      <div className="glass-card p-8 rounded-[2rem] bg-emerald-50 border-emerald-100 flex items-center gap-5">
         <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
         </div>
         <div>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight leading-none mb-1">DATA VERIFY</p>
            <p className="text-xs font-black text-slate-900 italic">Validación RNC Activa</p>
         </div>
      </div>
    </aside>
  );
}
