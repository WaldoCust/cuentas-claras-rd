"use client";

import { useState, useEffect } from "react";
import { 
  User, Hash, Calendar, DollarSign, Save, Loader2, 
  AlertCircle, Building2, Tag, Info, UserCircle2
} from "lucide-react";
import EliteDropdown from "@/components/ui/EliteDropdown";
import FieldError from "@/components/forms/FieldError";
import { cn } from "@/lib/utils";
import { REVENUE_CATEGORIES } from "@/lib/validation/sales";
import { getClients } from "@/lib/data/clients";
import { validateForm } from "@/lib/validation/core";
import { normalizePayload } from "@/lib/validation/normalize";

export default function SaleForm({ initialData, onSubmit, onCancel, loading: externalLoading }) {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    client_id: initialData?.client_id || "",
    ncf: initialData?.ncf || "",
    date_emission: initialData?.date_emission || new Date().toISOString().split('T')[0],
    amount_gross: initialData?.amount_gross || 0,
    amount_itbis: initialData?.amount_itbis || 0,
    revenue_type: initialData?.revenue_type || "01",
    notes: initialData?.notes || "",
    source_type: initialData?.source_type || "manual"
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getClients();
        setClients(data);
      } catch (err) {
        console.error("Error loading clients:", err);
      }
    };
    fetchClients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      if (name === 'amount_gross') {
        const amount = parseFloat(value) || 0;
        newData.amount_itbis = parseFloat((amount * 0.18).toFixed(2));
      }
      
      return newData;
    });

    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const validationFields = ['date_emission', 'amount_gross', 'amount_itbis'];
    if (formData.ncf) validationFields.push('ncf');

    const { isValid, errors } = validateForm({
      ...formData,
      subtotal: formData.amount_gross,
      itbis: formData.amount_itbis,
      total: parseFloat(formData.amount_gross) + parseFloat(formData.amount_itbis)
    }, validationFields);

    if (!isValid) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const normalized = normalizePayload(formData, {
        client_id: 'string',
        ncf: 'ncf',
        date_emission: 'string',
        amount_gross: 'number',
        amount_itbis: 'number',
        revenue_type: 'string',
        notes: 'string',
        source_type: 'string'
      });

      await onSubmit({
        ...normalized,
        total: normalized.amount_gross + normalized.amount_itbis
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 py-4">
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-[10px] font-black uppercase tracking-widest">
           <AlertCircle className="w-5 h-5 flex-shrink-0" />
           {error}
        </div>
      )}

      <div className="space-y-6">
        <EliteDropdown 
          label="Seleccionar Cliente"
          icon={UserCircle2}
          placeholder="-- Cliente de Contado / Consumo Final --"
          options={clients.map(c => ({
            value: c.id,
            label: `${c.business_name} (${c.rnc_or_cedula})`,
            icon: Building2
          }))}
          value={formData.client_id}
          onChange={(val) => setFormData(p => ({ ...p, client_id: val }))}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Número de NCF (Opcional)</label>
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
              <input 
                name="ncf"
                maxLength={11}
                value={formData.ncf}
                onChange={handleChange}
                className={cn(
                  "w-full bg-slate-50 border rounded-2xl py-4 pl-12 pr-6 text-sm font-mono font-black text-slate-900 focus:outline-none focus:ring-2 transition-all",
                  fieldErrors.ncf ? "border-red-300 focus:ring-red-100" : "border-slate-100 focus:ring-primary/20"
                )}
                placeholder="B0100000001"
              />
            </div>
            <FieldError error={fieldErrors.ncf} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fecha de Venta</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
              <input 
                name="date_emission"
                type="date"
                value={formData.date_emission}
                onChange={handleChange}
                className={cn(
                  "w-full bg-slate-50 border rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 transition-all",
                  fieldErrors.date_emission ? "border-red-300 focus:ring-red-100" : "border-slate-100 focus:ring-primary/20"
                )}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <FieldError error={fieldErrors.date_emission} />
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-slate-900 shadow-2xl space-y-6">
          <div className="flex justify-between items-center pb-6 border-b border-white/10">
             <h4 className="text-xs font-black text-white uppercase tracking-widest">Desglose de Ingresos</h4>
             <Tag className="w-5 h-5 text-primary" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center block">Subtotal (Neto)</label>
               <input 
                 name="amount_gross"
                 type="number"
                 step="0.01"
                 value={formData.amount_gross}
                 onChange={handleChange}
                 className={cn(
                   "w-full bg-white/5 border rounded-2xl py-4 px-6 text-lg font-black text-white focus:outline-none focus:ring-2 text-center",
                   fieldErrors.amount_gross ? "border-red-300 focus:ring-red-100" : "border-white/10 focus:ring-primary/40"
                 )}
                 placeholder="0.00"
               />
               <FieldError error={fieldErrors.amount_gross} />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center block">ITBIS (Facturado)</label>
               <div className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-lg font-black text-primary text-center">
                 {formData.amount_itbis.toLocaleString('en-US', { minimumFractionDigits: 2 })}
               </div>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1 text-center block">Total Venta</label>
               <div className="w-full bg-primary/10 border border-primary/20 rounded-2xl py-4 px-4 text-lg font-black text-white text-center">
                 RD$ {(parseFloat(formData.amount_gross) + parseFloat(formData.amount_itbis || 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
               </div>
               <FieldError error={fieldErrors.total} />
            </div>
          </div>
        </div>

        <EliteDropdown 
          label="Tipo de Ingreso (607)"
          icon={Tag}
          options={Object.entries(REVENUE_CATEGORIES).map(([code, label]) => ({
            value: code,
            label: `${label} (${code})`
          }))}
          value={formData.revenue_type}
          onChange={(val) => setFormData(p => ({ ...p, revenue_type: val }))}
        />
      </div>

      <div className="flex gap-4 pt-4 border-t border-slate-100">
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 py-5 rounded-2xl bg-white border border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
        >
          Descartar
        </button>
        <button 
          type="submit"
          disabled={loading || externalLoading}
          className="flex-[2] py-5 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          {loading || externalLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" /> 
              {formData.source_type === 'invoice_linked' ? "Actualizar Venta" : "Registrar Venta Directa"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
