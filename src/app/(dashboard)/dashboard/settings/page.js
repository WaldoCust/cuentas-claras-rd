"use client";

import { useState, useEffect, Suspense } from "react";
import { Settings, Shield, Bell, Cloud, CreditCard, ChevronRight, Save, Building2, ShieldCheck, Upload, FileCode, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "@/components/Modal";
import { useSearchParams, useRouter } from "next/navigation";
import ProtectedAction from "@/components/auth/ProtectedAction";
import RoleGate from "@/components/auth/RoleGate";
import { useAuth } from "@/components/providers/AuthProvider";

import { getProfile, updateProfile } from "@/lib/data/profile";

function SettingsContent() {
  const [activeModal, setActiveModal] = useState(null);
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { role } = useAuth();
 
  useEffect(() => {
    const setup = searchParams.get("setup");
    if (setup === "signature") {
      setActiveModal("signature");
    }
    
    // Fetch profile
    const fetchProfile = async () => {
      const data = await getProfile();
      if (data) setProfile(data);
    };
    fetchProfile();
  }, [searchParams]);

  const handleClose = () => setActiveModal(null);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData(e.target);
      const data = {
        rnc: formData.get("rnc"),
        business_name: formData.get("business_name"),
        address: formData.get("address")
      };
      await updateProfile(data);
      setProfile(prev => ({ ...prev, ...data }));
      handleClose();
    } catch (err) {
      alert("Error guardando el perfil: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    {
      id: "signature",
      title: "Firma Digital (e-CF)",
      description: "Carga tu certificado .p12 para facturación electrónica.",
      icon: ShieldCheck,
      color: "bg-blue-50 text-blue-600 border-blue-100",
      permission: "certificate:manage"
    },
    {
      id: "profile",
      title: "Perfil de Empresa",
      description: "Información fiscal y comercial de tu negocio.",
      icon: Building2,
      color: "bg-slate-50 text-slate-600 border-slate-100",
      permission: "settings:manage"
    },
    {
      id: "security",
      title: "Seguridad",
      description: "Actualiza tu contraseña y gestiona el acceso a tu cuenta.",
      icon: Shield,
      color: "bg-rose-50 text-rose-600 border-rose-100",
      permission: "settings:view"
    },
    {
      id: "notifications",
      title: "Notificaciones",
      description: "Alertas de vencimiento de ITBIS y facturaciones.",
      icon: Bell,
      color: "bg-amber-50 text-amber-600 border-amber-100",
      permission: "settings:view"
    },
    {
      id: "integrations",
      title: "Integraciones",
      description: "Sincroniza con Supabase, DGII y otros servicios.",
      icon: Cloud,
      color: "bg-purple-50 text-purple-600 border-purple-100",
      permission: "settings:manage"
    },
    {
      id: "subscription",
      title: "Suscripción",
      description: "Gestiona tu plan CuentasClaras Elite.",
      icon: CreditCard,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
      permission: "settings:manage"
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <header>
        <h2 className="text-3xl font-black tracking-tight mb-2 text-slate-900 italic">Central de <span className="text-primary not-italic">Configuración</span></h2>
        <p className="text-slate-500 font-medium">Gestiona las preferencias de tu cuenta y empresa con seguridad avanzada.</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {sections.map((section, i) => (
          <ProtectedAction key={section.id} permission={section.permission}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setActiveModal(section.id)}
              className="glass-card group p-6 rounded-[2rem] flex items-center justify-between cursor-pointer hover:border-primary/50 transition-all bg-white/40 active:scale-[0.98]"
            >
              <div className="flex items-center gap-6">
                <div className={`p-4 rounded-2xl border ${section.color} shadow-sm group-hover:scale-110 transition-transform`}>
                  <section.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 tracking-tight uppercase text-xs">{section.title}</h3>
                  <p className="text-sm text-slate-500 font-medium">{section.description}</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                <ChevronRight className="w-5 h-5" />
              </div>
            </motion.div>
          </ProtectedAction>
        ))}
      </div>

      <RoleGate permission="settings:manage">
        <div className="p-8 rounded-[2.5rem] bg-rose-50 border border-rose-100 mt-12">
          <h3 className="text-lg font-black text-rose-600 mb-2">Zona de Peligro</h3>
          <p className="text-sm text-rose-500 mb-6 font-medium">Acciones irreversibles que afectan tus datos fiscales históricos.</p>
          <button className="px-6 py-3 rounded-xl bg-white border border-rose-200 text-rose-600 font-black text-xs hover:bg-rose-600 hover:text-white transition-all uppercase tracking-widest">
            Eliminar Cuenta Permanentemente
          </button>
        </div>
      </RoleGate>

      {/* Modals and forms */}
      <Modal
        isOpen={activeModal === "signature"}
        onClose={handleClose}
        title="Configurar Firma Digital"
      >
        <div className="space-y-8">
          <div className="p-10 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50 text-center space-y-4 hover:border-primary/40 hover:bg-primary/5 transition-all group cursor-pointer relative overflow-hidden">
             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-primary" />
             </div>
             <div>
                <p className="text-sm font-black text-slate-900">Arrastra tu archivo .p12</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">O haz clic para buscar</p>
             </div>
             <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept=".p12,.pfx" />
          </div>

          <div className="space-y-4">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contraseña del Certificado</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
             </div>
             <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
                <p className="text-[10px] text-amber-700 font-bold leading-relaxed">
                   Tu llave privada se encripta localmente antes de ser procesada. CuentasClarasRD nunca almacena tu contraseña en texto plano.
                </p>
             </div>
          </div>

          <button 
            onClick={handleClose}
            className="w-full py-5 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/30 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform uppercase text-xs tracking-widest"
          >
            <ShieldCheck className="w-5 h-5" /> Validar y Activar e-CF
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === "profile"}
        onClose={handleClose}
        title="Perfil de Empresa"
      >
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">RNC Empresa</label>
              <input 
                name="rnc"
                type="text" 
                defaultValue={profile?.rnc || ""}
                placeholder="131-00000-1"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Comercial</label>
              <input 
                name="business_name"
                type="text" 
                defaultValue={profile?.business_name || ""}
                placeholder="Mi Negocio SRL"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dirección Fiscal</label>
            <textarea 
              name="address"
              rows={3}
              defaultValue={profile?.address || ""}
              placeholder="Calle, Número, Ciudad..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>
          <button 
            type="submit"
            disabled={saving}
            className="w-full py-5 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/30 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform uppercase text-xs tracking-widest mt-4 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={activeModal === "security"}
        onClose={handleClose}
        title="Actualizar Contraseña"
      >
        <form 
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const pass = formData.get("password");
            const confirm = formData.get("confirm");
            if (pass !== confirm) {
              alert("Las contraseñas no coinciden");
              return;
            }
            try {
              const { updatePassword } = await import("@/lib/data/settings");
              await updatePassword(pass);
              alert("Contraseña actualizada con éxito");
              handleClose();
            } catch (err) {
              alert("Error: " + err.message);
            }
          }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nueva Contraseña</label>
              <input 
                name="password"
                type="password" 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirmar Contraseña</label>
              <input 
                name="confirm"
                type="password" 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button 
            type="submit"
            className="w-full py-5 rounded-2xl bg-rose-600 text-white font-black shadow-xl shadow-rose-600/20 hover:scale-[1.02] transition-transform uppercase text-xs tracking-widest"
          >
            Actualizar Credenciales
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={activeModal && !["profile", "signature", "security"].includes(activeModal)}
        onClose={handleClose}
        title={sections.find(s => s.id === activeModal)?.title}
      >
        <div className="text-center py-12 space-y-6">
          <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto border border-primary/20">
             <Building2 className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Módulo en Desarrollo</h3>
            <p className="text-slate-500 font-medium max-w-xs mx-auto">
              Estamos trabajando para que puedas gestionar tus {sections.find(s => s.id === activeModal)?.title.toLowerCase()} con la mejor tecnología.
            </p>
          </div>
          <button 
            onClick={handleClose}
            className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black shadow-xl shadow-slate-900/20 hover:scale-[1.02] transition-transform uppercase text-xs tracking-widest"
          >
            Entendido
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
       <div className="animate-pulse space-y-8 max-w-4xl">
         <div className="h-10 w-48 bg-slate-200 rounded-xl" />
         <div className="h-6 w-full bg-slate-100 rounded-lg" />
         <div className="space-y-4">
           {[...Array(5)].map((_, i) => (
             <div key={i} className="h-24 w-full bg-slate-50 rounded-[2rem]" />
           ))}
         </div>
       </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}
