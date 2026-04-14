"use client";

import { useState } from "react";
import { Building2, Hash, Calendar, DollarSign, Save, Loader2, AlertCircle, CreditCard, ShoppingBag, Info, Wallet } from "lucide-react";
import EliteDropdown from "@/components/ui/EliteDropdown";
import FieldError from "@/components/forms/FieldError";
import { cn } from "@/lib/utils";
import { EXPENSE_CATEGORIES } from "@/lib/validation/purchases";
import { validateForm } from "@/lib/validation/core";
import { normalizePayload } from "@/lib/validation/normalize";

export default function PurchaseForm({ initialData, onSubmit, onCancel, loading: externalLoading }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    supplier_name: initialData?.supplier_name || "",
    rnc_target: initialData?.rnc_target || "",
    ncf: initialData?.ncf || "",
    document_date: initialData?.date_emission || initialData?.document_date || initialData?.date || new Date().toISOString().split('T')[0],
    amount_gross: initialData?.amount_gross || 0,
    amount_itbis: initialData?.amount_itbis || 0,
    expense_type: initialData?.expense_type || initialData?.revenue_type || "02",
    payment_method: initialData?.payment_method || "Transferencia",
    is_deductible: initialData?.is_deductible !== undefined ? initialData.is_deductible : true,
    notes: initialData?.notes || ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: val };
      
      // Auto-calculate ITBIS if amount changes (and it's a manual entry)
      if (name === 'amount_gross' && initialData?.source_type !== "ai_parsed") {
        const amount = parseFloat(value) || 0;
        newData.amount_itbis = parseFloat((amount * 0.18).toFixed(2));
      }
      
      return newData;
    });

    // Clear error on change
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

    // Final full validation
    const validationFields = ['supplier_name', 'rnc_target', 'ncf', 'document_date', 'amount_gross', 'amount_itbis'];
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
        supplier_name: 'string',
        rnc_target: 'rnc',
        ncf: 'ncf',
        document_date: 'string',
        amount_gross: 'number',
        amount_itbis: 'number',
        expense_type: 'string',
        payment_method: 'string',
        is_deductible: 'boolean',
        notes: 'string'
      });

      await onSubmit({
        ...normalized,
        date_emission: normalized.document_date
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre del Suplidor</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
              <input 
                name="supplier_name"
                value={formData.supplier_name}
                onChange={handleChange}
                className={cn(
                  "w-full bg-slate-50 border rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 transition-all",
                  fieldErrors.supplier_name ? "border-red-300 focus:ring-red-100" : "border-slate-100 focus:ring-primary/20"
                )}
                placeholder="Nombre de la empresa"
              />
            </div>
            <FieldError error={fieldErrors.supplier_name} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">RNC Suplidor</label>
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
              <input 
                name="rnc_target"
                value={formData.rnc_target}
                onChange={handleChange}
                className={cn(
                  "w-full bg-slate-50 border rounded-2xl py-4 pl-12 pr-6 text-sm font-mono font-black text-slate-900 focus:outline-none focus:ring-2 transition-all",
                  fieldErrors.rnc_target ? "border-red-300 focus:ring-red-100" : "border-slate-100 focus:ring-primary/20"
                )}
                placeholder="000000000"
              />
            </div>
            <FieldError error={fieldErrors.rnc_target} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Número de NCF</label>
            <div className="relative">
              <Info className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
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
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fecha de Comprobante</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
              <input 
                name="document_date"
                type="date"
                value={formData.document_date}
                onChange={handleChange}
                className={cn(
                  "w-full bg-slate-50 border rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 transition-all",
                  fieldErrors.document_date ? "border-red-300 focus:ring-red-100" : "border-slate-100 focus:ring-primary/20"
                )}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <FieldError error={fieldErrors.document_date} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center block">Monto Bruto</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                name="amount_gross"
                type="number"
                step="0.01"
                value={formData.amount_gross}
                onChange={handleChange}
                className={cn(
                  "w-full bg-slate-900 border rounded-2xl py-4 pl-10 pr-4 text-sm font-black text-white focus:outline-none focus:ring-2 transition-all text-center",
                  fieldErrors.amount_gross ? "border-red-300 focus:ring-red-100" : "border-slate-800 focus:ring-primary/40"
                )}
              />
            </div>
            <FieldError error={fieldErrors.amount_gross} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center block">ITBIS (Facturado)</label>
            <input 
              name="amount_itbis"
              type="number"
              step="0.01"
              value={formData.amount_itbis}
              onChange={handleChange}
              className={cn(
                "w-full bg-slate-50 border rounded-2xl py-4 px-4 text-sm font-black text-slate-900 focus:outline-none focus:ring-2 transition-all text-center",
                fieldErrors.itbis ? "border-red-300 focus:ring-red-100" : "border-slate-100 focus:ring-primary/20"
              )}
            />
            <FieldError error={fieldErrors.itbis} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1 text-center block">Total Pagado</label>
            <div className="w-full bg-primary/5 border border-primary/20 rounded-2xl py-4 px-4 text-sm font-black text-slate-900 text-center">
              RD$ {(parseFloat(formData.amount_gross) + parseFloat(formData.amount_itbis || 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <FieldError error={fieldErrors.total} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EliteDropdown 
            label="Categoría de Gasto (606)"
            icon={ShoppingBag}
            options={Object.entries(EXPENSE_CATEGORIES).map(([code, label]) => ({
              value: code,
              label: `${label} (${code})`
            }))}
            value={formData.expense_type}
            onChange={(val) => setFormData(p => ({ ...p, expense_type: val }))}
          />

          <EliteDropdown 
            label="Medio de Pago"
            icon={CreditCard}
            options={[
              { value: "Transferencia", label: "Transferencia Bancaria", icon: Building2 },
              { value: "Tarjeta", label: "Tarjeta de Crédito/Débito", icon: CreditCard },
              { value: "Efectivo", label: "Efectivo", icon: Wallet },
              { value: "Check", label: "Cheque", icon: Wallet }
            ]}
            value={formData.payment_method}
            onChange={(val) => setFormData(p => ({ ...p, payment_method: val }))}
          />
        </div>

        <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-[1.5rem] border border-emerald-100">
           <input 
              id="is_deductible"
              name="is_deductible"
              type="checkbox"
              checked={formData.is_deductible}
              onChange={handleChange}
              className="w-6 h-6 rounded-lg text-emerald-600 focus:ring-emerald-500 border-emerald-200"
           />
           <label htmlFor="is_deductible" className="text-xs font-black text-emerald-700 uppercase tracking-tight italic">
             Este gasto es deducible para ITBIS / ISR
           </label>
        </div>
      </div>

      <div className="flex gap-4 pt-4 border-t border-slate-100">
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 py-5 rounded-2xl bg-white border border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
        >
          Cancelar
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
              {initialData?.id ? "Actualizar Gasto" : "Registrar en 606"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
