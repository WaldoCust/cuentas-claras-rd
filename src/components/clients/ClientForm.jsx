"use client";

import { useState } from "react";
import { User, Phone, Mail, MapPin, Hash, Building2, AlertCircle, Save, Loader2 } from "lucide-react";
import { validateForm } from "@/lib/validation/core";
import { normalizeRNC } from "@/lib/validation/normalize";
import FieldError from "@/components/forms/FieldError";
import { cn } from "@/lib/utils";

export default function ClientForm({ client, onSubmit, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    business_name: client?.business_name || "",
    rnc_or_cedula: client?.rnc_or_cedula || "",
    fiscal_type: client?.fiscal_type || "Crédito Fiscal",
    document_type: client?.document_type || "RNC",
    phone: client?.phone || "",
    email: client?.email || "",
    address: client?.address || "",
    notes: client?.notes || ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when typing
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

    // Validate Form
    const { isValid, errors } = validateForm(formData, ['business_name', 'rnc_or_cedula']);
    if (!isValid) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      await onSubmit({
        ...formData,
        rnc_or_cedula: normalizeRNC(formData.rnc_or_cedula)
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
        <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-xs font-black uppercase tracking-widest">
           <AlertCircle className="w-5 h-5 flex-shrink-0" />
           {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Razón Social / Nombre</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input 
                name="business_name"
                value={formData.business_name}
                onChange={handleChange}
                className={cn(
                  "w-full bg-slate-50 border rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 transition-all",
                  fieldErrors.business_name ? "border-red-300 focus:ring-red-100" : "border-slate-100 focus:ring-primary/20"
                )}
                placeholder="Nombre legal del negocio"
              />
            </div>
            <FieldError error={fieldErrors.business_name} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">RNC o Cédula</label>
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input 
                name="rnc_or_cedula"
                value={formData.rnc_or_cedula}
                onChange={handleChange}
                className={cn(
                  "w-full bg-slate-50 border rounded-2xl py-4 pl-12 pr-6 text-sm font-mono font-black text-slate-900 focus:outline-none focus:ring-2 transition-all",
                  fieldErrors.rnc_or_cedula ? "border-red-300 focus:ring-red-100" : "border-slate-100 focus:ring-primary/20"
                )}
                placeholder="000-00000-0"
              />
            </div>
            <FieldError error={fieldErrors.rnc_or_cedula} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Modalidad Fiscal</label>
            <select 
              name="fiscal_type"
              value={formData.fiscal_type}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            >
              <option value="Crédito Fiscal">Crédito Fiscal (B01)</option>
              <option value="Consumo Final">Consumo Final (B02)</option>
              <option value="Especial">Registro Especial</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo Documento</label>
            <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl border border-slate-100">
               {['RNC', 'Cédula'].map(t => (
                 <button
                   key={t}
                   type="button"
                   onClick={() => setFormData(p => ({ ...p, document_type: t }))}
                   className={cn(
                     "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                     formData.document_type === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                   )}
                 >
                   {t}
                 </button>
               ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Teléfono</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="809-000-0000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input 
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="cliente@ejemplo.com"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dirección Comercial</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-5 w-5 h-5 text-slate-300" />
            <textarea 
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              placeholder="Calle, Número, Ciudad..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Notas Internas</label>
          <textarea 
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={2}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            placeholder="Observaciones sobre el cliente..."
          />
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
          disabled={loading}
          className="flex-[2] py-5 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" /> 
              {client ? "Actualizar Registro" : "Registrar Cliente"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
