"use client";

import { useState, useEffect } from "react";
import { User, Calendar, DollarSign, Hash, Save, Send, Loader2, AlertCircle, Building2, UserCircle2 } from "lucide-react";
import { getClients } from "@/lib/data/clients";
import { validateInvoiceTotals, NCF_TYPES, checkProfileReadiness } from "@/lib/validation/invoices";
import { getProfile } from "@/lib/data/profile";
import EliteDropdown from "@/components/ui/EliteDropdown";
import { cn } from "@/lib/utils";

export default function InvoiceForm({ onSubmit, onCancel, initialData }) {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [readiness, setReadiness] = useState({ isReady: true, missing: [] });

  const [formData, setFormData] = useState({
    client_id: initialData?.client_id || "",
    date_emission: initialData?.date_emission || new Date().toISOString().split('T')[0],
    due_date: initialData?.due_date || "",
    subtotal: initialData?.subtotal || 0,
    itbis: initialData?.itbis || 0,
    total: initialData?.total || 0,
    ncf_type: initialData?.ncf_type || "01",
    ncf_number: initialData?.ncf_number || "",
    currency: initialData?.currency || "DOP",
    notes: initialData?.notes || ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsData, profileData] = await Promise.all([
          getClients(),
          getProfile()
        ]);
        setClients(clientsData);
        setProfile(profileData);
        setReadiness(checkProfileReadiness(profileData));
      } catch (err) {
        console.error("Error loading form dependencies:", err);
      }
    };
    fetchData();
  }, []);

  const calculateTotals = (sub) => {
    const itbis = sub * 0.18;
    const total = sub + itbis;
    setFormData(prev => ({ 
      ...prev, 
      subtotal: sub,
      itbis: parseFloat(itbis.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    }));
  };

  const handleSubtotalChange = (e) => {
    const val = parseFloat(e.target.value) || 0;
    calculateTotals(val);
  };

  const handleSubmit = async (e, targetStatus = 'issued') => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // If attempting to issue, check profile readiness
    if (targetStatus === 'issued' && !readiness.isReady) {
      setError(`No puedes emitir facturas legales. Faltan datos en tu perfil: ${readiness.missing.join(", ")}`);
      setLoading(false);
      return;
    }

    if (!formData.client_id) {
       setError("Debes seleccionar un cliente");
       setLoading(false);
       return;
    }

    try {
      await onSubmit({
        ...formData,
        status: targetStatus
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-8 py-4">
      {error && (
        <div className="p-4 rounded-[1.5rem] bg-red-50 border border-red-100 flex items-start gap-4 text-red-600 text-[10px] font-black uppercase tracking-widest leading-relaxed">
           <AlertCircle className="w-5 h-5 flex-shrink-0" />
           <span>{error}</span>
        </div>
      )}

      {/* Profile Warning */}
      {!readiness.isReady && (
        <div className="p-6 rounded-[2rem] bg-amber-50 border border-amber-100 space-y-3">
           <div className="flex items-center gap-3 text-amber-600">
              <AlertCircle className="w-5 h-5" />
              <h5 className="text-[10px] font-black uppercase tracking-widest">Emisión Bloqueada</h5>
           </div>
           <p className="text-xs text-slate-500 font-medium">
             Solo podrás guardar esta factura como **Borrador** hasta que completes los datos obligatorios (RNC, Dirección) en tu perfil de empresa.
           </p>
        </div>
      )}

      <div className="space-y-6">
        {/* Client Selection */}
        <EliteDropdown 
          label="Seleccionar Cliente"
          icon={UserCircle2}
          placeholder="-- Seleccionar de la cartera --"
          options={clients.map(c => ({
            value: c.id,
            label: `${c.business_name} (${c.rnc_or_cedula})`,
            icon: Building2
          }))}
          value={formData.client_id}
          onChange={(val) => setFormData(p => ({ ...p, client_id: val }))}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Issue Date */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fecha de Emisión</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input 
                type="date"
                value={formData.date_emission}
                onChange={(e) => setFormData(p => ({ ...p, date_emission: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Fiscal Type */}
          <EliteDropdown 
            label="Tipo de Comprobante"
            options={Object.entries(NCF_TYPES).map(([code, label]) => ({
              value: code,
              label: `${label} (B${code})`,
              icon: Hash
            }))}
            value={formData.ncf_type}
            onChange={(val) => setFormData(p => ({ ...p, ncf_type: val }))}
          />
        </div>

        {/* Amounts */}
        <div className="p-8 rounded-[2.5rem] bg-slate-900 shadow-2xl space-y-6">
          <div className="flex justify-between items-center pb-6 border-b border-white/10">
             <h4 className="text-xs font-black text-white uppercase tracking-widest">Resumen Financiero</h4>
             <DollarSign className="w-5 h-5 text-primary" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subtotal (Neto)</label>
               <input 
                 type="number"
                 step="0.01"
                 value={formData.subtotal}
                 onChange={handleSubtotalChange}
                 className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-lg font-black text-white focus:outline-none focus:ring-2 focus:ring-primary/40 text-center"
                 placeholder="0.00"
               />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center block">ITBIS (18%)</label>
               <div className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-lg font-black text-primary text-center">
                 {formData.itbis.toLocaleString('en-US', { minimumFractionDigits: 2 })}
               </div>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1 text-center block">Total Facturado</label>
               <div className="w-full bg-primary/10 border border-primary/20 rounded-2xl py-4 px-6 text-lg font-black text-white text-center">
                 {formData.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Concepto o Notas Internas</label>
          <textarea 
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            placeholder="Ej: Honorarios profesionales por servicios de consultoría..."
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4 border-t border-slate-100">
         <button 
           type="button"
           onClick={onCancel}
           className="px-8 py-5 rounded-2xl bg-white border border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
         >
           Descartar
         </button>
         
         <div className="flex-1 flex gap-4">
            <button 
              type="button"
              onClick={(e) => handleSubmit(e, 'draft')}
              disabled={loading}
              className="flex-1 py-5 rounded-2xl bg-white border border-slate-900 text-slate-900 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Guardar Borrador</>}
            </button>
            <button 
              type="submit"
              onClick={(e) => handleSubmit(e, 'issued')}
              disabled={loading || !readiness.isReady}
              className={cn(
                "flex-[1.5] py-5 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3",
                (!readiness.isReady || loading) && "opacity-50 cursor-not-allowed grayscale"
              )}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Emitir Factura Legal</>}
            </button>
         </div>
      </div>
    </form>
  );
}
