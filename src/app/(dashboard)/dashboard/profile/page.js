"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Building, MapPin, Hash, Save, CheckCircle2 } from "lucide-react";
import { getProfile, updateProfile } from "@/lib/data/profile";
import LoadingState from "@/components/state/LoadingState";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [profile, setProfile] = useState({
    business_name: "",
    rnc: "",
    address: "",
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getProfile();
        if (data) {
          setProfile(data);
        }
      } catch (err) {
        console.error("Profile Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(profile);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      alert("Error al guardar: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><LoadingState message="Obteniendo perfil fiscal..." /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header>
        <h2 className="text-4xl font-black tracking-tighter text-slate-900 italic">Perfil de <span className="text-primary not-italic">Negocio</span></h2>
        <p className="text-slate-500 font-medium">Configura los datos fiscales que aparecerán en tus reportes DGII.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-1 space-y-6">
          <div className="glass-card p-10 rounded-[2.5rem] bg-white border-white shadow-xl text-center group">
            <div className="w-24 h-24 rounded-[2rem] bg-slate-900 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-900/10 group-hover:bg-primary transition-colors">
              <Building className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-black text-xl italic tracking-tight text-slate-900">{profile.business_name || "Mi Negocio"}</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2">{profile.rnc || "RNC NO DEFINIDO"}</p>
          </div>
          
          <div className="glass-card p-8 rounded-[2rem] bg-primary/5 border-primary/20">
            <p className="text-[10px] font-black text-primary mb-3 uppercase tracking-[0.2em] italic">Estatus Fiscal</p>
            <p className="text-sm font-black text-slate-900 mb-2">Régimen Ordinario</p>
            <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase tracking-tight">
              Suscrito a la Ley 11-92 para facturación con ITBIS (18%).
            </p>
          </div>
        </div>

        <div className="md:col-span-2">
          <form onSubmit={handleSave} className="glass-card rounded-[3rem] p-10 space-y-8 bg-white/70 border-white shadow-2xl">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Razón Social</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input 
                    value={profile.business_name}
                    onChange={(e) => setProfile({...profile, business_name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-900"
                    placeholder="Ej: Santiago Vertical SRL"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">RNC o Cédula</label>
                <div className="relative">
                  <Hash className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input 
                    value={profile.rnc}
                    onChange={(e) => setProfile({...profile, rnc: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-900"
                    placeholder="Ej: 131-00000-0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dirección Fiscal</label>
                <div className="relative">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <textarea 
                    value={profile.address}
                    onChange={(e) => setProfile({...profile, address: e.target.value})}
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-900 resize-none"
                    placeholder="Sede central Santiago..."
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={saving}
              className="w-full py-5 rounded-[1.5rem] bg-primary text-white font-black shadow-xl shadow-primary/30 flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 uppercase text-xs tracking-widest"
            >
              <Save className="w-5 h-5" /> {saving ? "Sincronizando..." : "Actualizar Datos Fiscales"}
            </button>
          </form>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-10 right-10 flex items-center gap-4 px-8 py-5 rounded-[2rem] bg-slate-900 text-white shadow-2xl z-50 border border-slate-800"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
               <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
               <p className="text-sm font-black italic tracking-tight">Perfil Sincronizado</p>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Base de datos actualizada</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
