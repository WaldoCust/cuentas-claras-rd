"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Calendar, Zap, AlertCircle, FileText, ChevronRight, Info } from "lucide-react";
import { cn } from "@/lib/utils";

// New Components & Services
import { getDashboardSummary, getRecentActivity } from "@/lib/data/dashboard";
import TaxSummaryCard from "@/components/dashboard/TaxSummaryCard";
import { RevenueSummaryCard, ExpenseSummaryCard } from "@/components/dashboard/RevenueSummaryCard";
import LoadingState from "@/components/state/LoadingState";
import EmptyState from "@/components/state/EmptyState";
import TrustBadge from "@/components/ui/TrustBadge";

import { useRouter } from "next/navigation";

import OnboardingChecklist from "@/components/onboarding/OnboardingChecklist";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [activity, setActivity] = useState([]);

  const fetchData = async () => {
    try {
      const [sumData, actData] = await Promise.all([
        getDashboardSummary(),
        getRecentActivity()
      ]);
      setSummary(sumData);
      setActivity(actData);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><LoadingState message="Consolidando balances fiscales..." /></div>;

  return (
    <div className="space-y-12">
      <OnboardingChecklist />
      <header>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h2 className="text-4xl font-black tracking-tight mb-2 text-slate-900 italic">Estatus de <span className="text-primary not-italic">Operaciones</span></h2>
            <p className="text-slate-500 font-medium tracking-tight">Cruce automático de reporte 606 y 607 para liquidación de ITBIS.</p>
          </div>
          <div className="flex gap-3">
             <button className="px-6 py-4 rounded-2xl bg-white border border-slate-200 text-[10px] font-black text-slate-900 hover:bg-slate-50 transition-all uppercase tracking-widest shadow-sm">Descargar Histórico</button>
             <button className="px-6 py-4 rounded-2xl bg-primary text-white text-[10px] font-black hover:bg-primary/90 transition-all uppercase tracking-widest shadow-xl shadow-primary/20">Configurar Alertas</button>
          </div>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Tax Engine Visualization */}
        <div className="lg:col-span-1">
           <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cálculo en Tiempo Real</span>
              <div className="group relative">
                <Info className="w-3 h-3 text-slate-300 cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-white text-[8px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                  Calculado como (ITBIS Ventas) - (ITBIS Adelantado). Alineado con formularios IT-1.
                </div>
              </div>
           </div>
           <TaxSummaryCard taxData={summary?.details?.tax} />
        </div>
        
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ingresos Brutos</span>
                 <TrustBadge type="security" />
              </div>
              <RevenueSummaryCard data={summary?.details?.revenue} />
           </div>
           <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gastos Validados</span>
                 <TrustBadge type="compliance" />
              </div>
              <ExpenseSummaryCard data={summary?.details?.expenses} />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 glass-card rounded-[3rem] p-10 bg-white/70 border-white/60 shadow-2xl relative overflow-hidden"
        >
          <div className="flex justify-between items-center mb-10 relative z-10">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Libro de <span className="text-primary italic">Actividad</span></h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Sincronizado con base de datos fiscal</p>
            </div>
            <div className="flex gap-2">
               <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400">En Tiempo Real</span>
            </div>
          </div>
          
          <div className="space-y-2 relative z-10">
            {activity.length === 0 ? (
              <EmptyState title="Sin actividad" message="No se han registrado facturas o compras recientemente." />
            ) : (
              <AnimatePresence mode="popLayout">
                {activity.map((item, i) => (
                  <motion.div 
                    layout
                    key={item.id} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group flex items-center justify-between p-6 rounded-[2rem] hover:bg-white transition-all border border-transparent hover:border-slate-100 hover:shadow-xl hover:shadow-slate-200/20"
                  >
                    <div className="flex items-center gap-6">
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-all group-hover:rotate-6",
                        item.direction === 'issued' ? "bg-emerald-50 text-emerald-500" : "bg-primary/10 text-primary"
                      )}>
                        {item.direction === 'issued' ? <TrendingUp className="w-7 h-7" /> : <Zap className="w-7 h-7" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                           <p className="text-sm font-black text-slate-900">{item.direction === 'issued' ? "Ingreso Facturado" : "Gasto Corporativo"}</p>
                           <span className="text-[8px] font-black px-1.5 py-0.5 bg-slate-100 rounded text-slate-400 uppercase tracking-widest">{item.ncf?.slice(0,3)}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">NCF: {item.ncf} • {new Date(item.date_emission || item.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-slate-900 tracking-tight italic">RD$ {parseFloat(item.amount_gross + (item.amount_itbis || 0)).toLocaleString()}</p>
                      <p className={cn(
                        "text-[9px] font-black uppercase tracking-widest mt-1",
                        item.direction === 'issued' ? 'text-emerald-500' : 'text-slate-400'
                      )}>
                        {item.direction === 'issued' ? 'Cobrado' : 'Deducible'}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col gap-6"
        >
          <div className="glass-card rounded-[3rem] p-10 relative overflow-hidden bg-slate-900 border-slate-800 shadow-2xl group">
            <div className="relative z-10">
              <div className="p-4 w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 shadow-lg mb-8 flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-primary animate-pulse" />
              </div>
              <h3 className="text-2xl font-black mb-3 text-white tracking-tight italic">Cierre <span className="text-primary not-italic">Mensual</span></h3>
              <p className="text-sm text-slate-400 mb-10 leading-relaxed font-medium">
                Tu posición de ITBIS para el mes de {summary?.details?.period} está lista para reportar a la DGII.
              </p>
              <div className="space-y-3 mb-10">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-black uppercase">Integridad de Datos</span>
                    <span className="text-[10px] text-emerald-400 font-black uppercase">100% Validado</span>
                 </div>
                 <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-primary" />
                 </div>
              </div>
              <button 
                 onClick={() => router.push('/dashboard/taxes')}
                 className="w-full py-5 rounded-2xl bg-primary text-white font-black text-[10px] shadow-xl shadow-primary/30 hover:scale-[1.02] transition-transform active:scale-95 uppercase tracking-[0.2em] flex items-center justify-center gap-3"
              >
                Auditar Reporte IT-1 <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="glass-card rounded-[2.5rem] p-8 border border-slate-100 bg-white shadow-xl flex items-center gap-6">
             <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg">
                <FileText className="w-7 h-7 text-white" />
             </div>
             <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total Comprobantes</p>
                <div className="flex items-center gap-2">
                   <p className="text-xl font-black text-slate-900 italic tracking-tight">{summary?.ncf_count || 0}</p>
                   <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Documentos en Periodo</p>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
