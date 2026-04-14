"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Download, CheckCircle2, Wand2, Camera, AlertCircle, Loader2 } from "lucide-react";
import Modal from "@/components/Modal";

// New Components & Services
import { getPurchases, createPurchase, archivePurchase } from "@/lib/data/purchases";
import { getProfile } from "@/lib/data/profile";
import { generate606Text, download606File } from "@/lib/export/606.js";
import { formatFiscalPeriod } from "@/lib/validation/purchases";
import { PurchaseList, PurchaseFilters } from "@/components/purchases/PurchaseList";
import PurchaseForm from "@/components/purchases/PurchaseForm";
import PurchaseImportReview from "@/components/purchases/PurchaseImportReview";
import LoadingState from "@/components/state/LoadingState";
import ErrorState from "@/components/state/ErrorState";
import EmptyState from "@/components/state/EmptyState";
import ActionPrompt from "@/components/state/ActionPrompt";
import { useOnboarding } from "@/lib/onboarding/state";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import SecurityNotice from "@/components/ui/SecurityNotice";
import ErrorBanner from "@/components/ui/ErrorBanner";
import SuccessToast from "@/components/ui/SuccessToast";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PurchasesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("manual"); // manual, review
  const [showSuccess, setShowSuccess] = useState(false);
  const [successInfo, setSuccessInfo] = useState({ title: "", message: "" });
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [bannerError, setBannerError] = useState(null);
  
  const [purchases, setPurchases] = useState([]);
  const [profile, setProfile] = useState(null);
  const [filters, setFilters] = useState({});
  const [confirmArchive, setConfirmArchive] = useState({ open: false, id: null });
  const [confirmExport, setConfirmExport] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setBannerError(null);
    try {
      const [purchasesData, profileData] = await Promise.all([
        getPurchases(filters),
        getProfile()
      ]);
      setPurchases(purchasesData);
      setProfile(profileData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const stats = useMemo(() => {
    const active = purchases.filter(p => p.status !== 'archived');
    return {
      total: active.reduce((acc, p) => acc + (parseFloat(p.amount_gross) || 0), 0),
      itbis: active.reduce((acc, p) => acc + (parseFloat(p.amount_itbis) || 0), 0),
      count: active.length
    };
  }, [purchases]);

  const { completeStep3 } = useOnboarding();

  const executeExport = () => {
    try {
      setBannerError(null);
      const period = formatFiscalPeriod(new Date().toISOString());
      const content = generate606Text(profile.rnc, period, purchases);
      download606File(content, `606_${period}_EXPORT.txt`);
      completeStep3();
      setConfirmExport(false);
      setSuccessInfo({
        title: "Reporte Generado",
        message: "El archivo 606 ha sido descargado exitosamente."
      });
      setShowSuccess(true);
    } catch (err) {
      setConfirmExport(false);
      setBannerError(err.message);
    }
  };

  const handleExport = () => {
    if (!profile?.rnc) {
      setBannerError("Debes completar tu RNC en el perfil para exportar 606.");
      return;
    }
    setConfirmExport(true);
  };

  const handleScan = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    setBannerError(null);
    const reader = new FileReader();
    reader.onloadend = async () => {
      setPreviewImage(reader.result);
      try {
        const response = await fetch("/api/vision/parse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: reader.result }),
        });
        
        const data = await response.json();
        if (data.error) throw new Error(data.error);

        setReviewData({
          supplier_name: data.supplier_name,
          rnc_target: data.rnc_supplier,
          ncf: data.ncf,
          date_emission: data.date,
          amount_gross: data.amount_gross,
          amount_itbis: data.amount_itbis,
          revenue_type: data.expense_type || data.revenue_type || "02",
          source_type: "ai_parsed"
        });
        setActiveTab("review");
        setIsModalOpen(true);
      } catch (err) {
        setBannerError("Error al escanear: " + err.message);
      } finally {
        setScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const onSavePurchase = async (formData) => {
    try {
      await createPurchase({
        ...formData,
        source_type: formData.source_type || "manual"
      });
      setIsModalOpen(false);
      setReviewData(null);
      setPreviewImage(null);
      setSuccessInfo({
        title: "Registro Sincronizado",
        message: formData.id ? "Gasto actualizado exitosamente." : "Nuevo gasto registrado en el 606."
      });
      setShowSuccess(true);
      fetchData();
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      throw err;
    }
  };

  const executeArchive = async () => {
    if (!confirmArchive.id) return;
    try {
      await archivePurchase(confirmArchive.id);
      setConfirmArchive({ open: false, id: null });
      setSuccessInfo({
        title: "Registro Archivado",
        message: "El movimiento ha sido movido al histórico."
      });
      setShowSuccess(true);
      fetchData();
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setBannerError(err.message);
    }
  };

  const handleArchive = (id) => {
    setConfirmArchive({ open: true, id });
  };

  return (
    <div className="space-y-12">
      <ConfirmationModal 
        isOpen={confirmExport}
        onClose={() => setConfirmExport(false)}
        onConfirm={executeExport}
        title="¿Generar reporte 606?"
        description="Se descargará un archivo de texto (.txt) con el formato oficial requerido por la DGII. Asegúrate de que todos los datos del periodo estén correctos."
        confirmText="Generar Reporte"
      />

      <ConfirmationModal 
        isOpen={confirmArchive.open}
        onClose={() => setConfirmArchive({ open: false, id: null })}
        onConfirm={executeArchive}
        variant="danger"
        title="¿Archivar registro?"
        description="El registro se moverá al archivo histórico. Podrás consultarlo después, pero no aparecerá en tus balances activos."
        confirmText="Archivar"
      />

      <header className="flex flex-col gap-8">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 italic">
            Reporte <span className="text-primary not-italic">606 (Compras)</span>
          </h2>
          <p className="text-slate-500 font-medium tracking-tight text-sm md:text-base">
            Captura con IA y exportación validada.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={handleExport}
            className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white border border-slate-200 text-slate-900 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
          >
            <Download className="w-5 h-5 text-primary" /> Exportar 606
          </button>
          
          <label className={cn(
            "flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border border-slate-900 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-slate-900/10 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer",
            scanning && "opacity-50 pointer-events-none"
          )}>
            {scanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
            {scanning ? "Analizando..." : "Escanear"}
            <input type="file" accept="image/*" onChange={handleScan} className="hidden" />
          </label>

          <button 
            onClick={() => { setActiveTab("manual"); setIsModalOpen(true); }}
            className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all text-center"
          >
            <Plus className="w-5 h-5" /> Nuevo Gasto
          </button>
        </div>
      </header>

      <ErrorBanner message={bannerError} onClose={() => setBannerError(null)} />
      
      <SecurityNotice message="Utilizamos una conexión segura para procesar tus facturas." />

      {/* Stats Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-card group p-6 rounded-[2rem] bg-white border-white shadow-xl shadow-slate-200/20">
           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Total Periodo</p>
           <p className="text-xl md:text-2xl font-black text-slate-900 italic tracking-tighter">RD$ {stats.total.toLocaleString()}</p>
        </div>
        <div className="glass-card group p-6 rounded-[2rem] bg-emerald-50 border-emerald-100 shadow-xl shadow-slate-200/20">
           <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mb-1">Adelanto ITBIS</p>
           <p className="text-xl md:text-2xl font-black text-emerald-700 italic tracking-tighter">RD$ {stats.itbis.toLocaleString()}</p>
        </div>
        <div className="glass-card group p-6 rounded-[2rem] bg-slate-900 border-slate-800 shadow-xl shadow-slate-200/20 sm:col-span-2 lg:col-span-1">
           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Registros Validados</p>
           <p className="text-xl md:text-2xl font-black text-white italic tracking-tighter">{stats.count}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <PurchaseFilters filters={filters} setFilters={setFilters} />
        </div>

        <div className="lg:col-span-8 min-h-[500px]">
           {loading ? (
             <LoadingState message="Sincronizando registros de gastos..." />
           ) : error ? (
             <ErrorState message={error} onRetry={fetchData} />
           ) : purchases.length === 0 ? (
             <div className="space-y-8">
               <EmptyState 
                 title="Sin reportes 606" 
                 message="Todavía no has registrado compras. Puedes subir una foto de tu factura o ingresarla manualmente para empezar a deducir ITBIS."
                 onAction={() => { setActiveTab("manual"); setIsModalOpen(true); }}
                 actionLabel="Nuevo Gasto Manual"
                 icon={ShoppingBag}
               />
               <ActionPrompt 
                 title="Captura Rápida"
                 message="¿Tienes una factura a mano? Súbela y nuestra IA extraerá el RNC y los montos por ti."
                 actionLabel="Escanear Factura"
                 onAction={() => document.querySelector('input[type="file"]')?.click()}
               />
             </div>
           ) : (
             <PurchaseList 
               purchases={purchases} 
               onArchive={handleArchive}
             />
           )}
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setReviewData(null); setPreviewImage(null); }}
        title={activeTab === "review" ? "Validación de Captura IA" : "Nuevo Registro Fiscal 606"}
        maxWidth={activeTab === "review" ? "max-w-6xl" : "max-w-2xl"}
      >
        {activeTab === "review" && reviewData ? (
          <PurchaseImportReview 
            parsedData={reviewData}
            image={previewImage}
            onConfirm={onSavePurchase}
            onCancel={() => { setIsModalOpen(false); setReviewData(null); }}
          />
        ) : (
          <PurchaseForm 
            onSubmit={onSavePurchase}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </Modal>

      <SuccessToast 
        show={showSuccess} 
        title={successInfo.title}
        message={successInfo.message}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}

function Loader({ className }) {
  return (
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      className={className}
    >
      <Wand2 className="w-full h-full" />
    </motion.div>
  );
}
