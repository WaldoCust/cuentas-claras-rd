"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, Calculator, Download, Calendar, Info, ShieldCheck, TrendingUp, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDashboardSummary } from "@/lib/data/dashboard";
import LoadingState from "@/components/state/LoadingState";

export default function TaxesPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summary = await getDashboardSummary();
        setData(summary);
      } catch (err) {
        console.error("Error loading tax data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Agregando registros fiscales..." />;

  const summary = data?.details || { revenue: { gross: 0, itbis: 0 }, expenses: { gross: 0, itbis: 0 }, tax: { payable: 0 } };
  const payableITBIS = summary.tax.payable || 0;
  const incomeITBIS = summary.revenue.itbis || 0;
  const expenseITBIS = summary.expenses.itbis || 0;
  
  // Calculate a basic deductible percentage for the meter
  const deductiblePercent = incomeITBIS > 0 ? (Math.min(expenseITBIS / incomeITBIS, 1) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-slate-900 italic">Proyección <span className="text-primary not-italic">IT-1</span></h2>
          <p className="text-slate-500 font-medium">Análisis detallado de obligaciones fiscales y proyecciones de ITBIS en tiempo real.</p>
        </div>
        <button className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white border border-slate-200 text-slate-900 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
          <Download className="w-5 h-5 text-primary" /> Exportar Borrador IT-1
        </button>
      </header>

      {/* Tax Meter Section */}
      <section className="glass-card rounded-[3.5rem] p-12 overflow-hidden relative border-white/60 bg-white shadow-2xl">
         <div className="flex flex-col lg:flex-row justify-between items-center gap-16 relative z-10">
            <div className="space-y-8 flex-1">
               <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-950 text-[10px] font-black text-white uppercase tracking-[0.2em]">
                  <Calendar className="w-3 h-3 text-primary" /> Periodo Fiscal: Abril 2026
               </div>
               
               <div className="space-y-2">
                  <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest">Saldo Estimado a Pagar</h3>
                  <p className="text-6xl font-black text-slate-900 italic tracking-tighter">
                     <span className="text-3xl not-italic font-bold text-slate-400 align-top mr-2 leading-none">RD$</span>
                     {payableITBIS.toLocaleString('en-US', { minimumFractionDigits: 0 })}<span className="text-3xl">.{(payableITBIS % 1).toFixed(2).split('.')[1] || '00'}</span>
                  </p>
               </div>
               
               <p className="text-slate-500 text-sm max-w-sm font-medium leading-relaxed">
                  Basado en la conciliación automática de tus facturas enviadas y recibidas vía <span className="text-primary font-bold">e-CF</span>.
               </p>
               
               <div className="flex gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
                     <ShieldCheck className="w-4 h-4 text-emerald-500" />
                     <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Cumplimiento 100%</span>
                  </div>
               </div>
            </div>
            
            <div className="w-full lg:max-w-md space-y-10 p-10 rounded-[2.5rem] bg-slate-50/50 border border-slate-100 shadow-inner">
               <div className="space-y-4">
                  <div className="flex justify-between items-end">
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">ITBIS Facturado (Ventas)</p>
                        <p className="text-xl font-black text-slate-900 italic">RD$ {incomeITBIS.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                     </div>
                  </div>
                  <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden p-1 shadow-inner">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: incomeITBIS > 0 ? "100%" : "0%" }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className="h-full bg-slate-900 rounded-full shadow-lg"
                     />
                  </div>
               </div>
               
               <div className="space-y-4">
                  <div className="flex justify-between items-end">
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">ITBIS Adelantado (Compras)</p>
                        <p className="text-xl font-black text-slate-900 italic">RD$ {expenseITBIS.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                     </div>
                     <span className="text-xs font-black text-emerald-500 mb-1 italic">{deductiblePercent}% Deducible</span>
                  </div>
                  <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden p-1 shadow-inner">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${deductiblePercent}%` }}
                        transition={{ duration: 1.5, ease: "circOut", delay: 0.3 }}
                        className="h-full bg-primary rounded-full shadow-lg"
                     />
                  </div>
               </div>
            </div>
         </div>
         
         {/* Background Decor */}
         <div className="absolute top-0 right-0 w-[40%] h-full bg-primary/5 blur-[120px] pointer-events-none" />
         <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-slate-900/5 blur-[100px] pointer-events-none" />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <motion.div 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.2 }}
           className="glass-card group p-10 rounded-[3rem] bg-white/70 border-white shadow-xl space-y-8"
         >
            <div className="flex items-center gap-4">
               <div className="p-4 bg-slate-100 group-hover:bg-primary transition-colors rounded-[1.25rem] shadow-sm">
                  <Calculator className="w-6 h-6 text-slate-400 group-hover:text-white" />
               </div>
               <div>
                  <h4 className="text-lg font-black text-slate-900 italic">Coeficiente de <span className="text-primary not-italic">Proporción</span></h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Art. 349 Código Tributario</p>
               </div>
            </div>
            
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
               Ajustamos automáticamente tus adelantos basados en el porcentaje de ventas gravadas vs exentas reportadas en el 607.
            </p>
            
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 border-dashed flex justify-between items-center group-hover:bg-white transition-all">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coeficiente de Abril</span>
               <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                     <div className="h-full bg-primary w-full" />
                  </div>
                  <span className="text-sm font-black text-slate-900 italic">1.00 (100%)</span>
               </div>
            </div>
         </motion.div>

         <motion.div 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.3 }}
           className="glass-card group p-10 rounded-[3rem] bg-slate-950 border-slate-800 shadow-2xl space-y-8 relative overflow-hidden"
         >
            <div className="relative z-10 flex items-center gap-4">
               <div className="p-4 bg-primary/20 rounded-[1.25rem] border border-primary/30">
                  <TrendingUp className="w-6 h-6 text-primary" />
               </div>
               <div>
                  <h4 className="text-lg font-black text-white italic">Score de <span className="text-primary not-italic">Eficiencia</span></h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Sincronización DGII</p>
               </div>
            </div>
            
            <p className="relative z-10 text-sm text-slate-400 leading-relaxed font-medium">
               Tu eficiencia fiscal está optimizada. Hemos validado que el 100% de tus adelantos provienen de suplidores con RNC activo y sin incidencias fiscales.
            </p>
            
            <div className="relative z-10 flex gap-3 pt-2">
               <div className="px-5 py-2 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20">ÓPTIMO</div>
               <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors">Ver Detalles <ChevronRight className="w-3 h-3" /></button>
            </div>

            {/* Decor */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
         </motion.div>
      </div>
    </div>
  );
}
