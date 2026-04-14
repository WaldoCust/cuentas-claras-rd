"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Download, FilePlus2, CheckCircle2 } from "lucide-react";
import Modal from "@/components/Modal";

// New Components & Services
import { getSales, createSale, updateSale, archiveSale } from "@/lib/data/sales";
import { getClients } from "@/lib/data/clients";
import { getProfile } from "@/lib/data/profile";
import { generate607Text, download607File } from "@/lib/export/607.js";
import { formatFiscalPeriod } from "@/lib/validation/purchases"; // Using same utility
import { SalesList, SalesFilters } from "@/components/sales/SalesList";
import SaleForm from "@/components/sales/SaleForm";
import SalesSummaryCards from "@/components/sales/SalesSummaryCards";
import LoadingState from "@/components/state/LoadingState";
import ErrorState from "@/components/state/ErrorState";
import EmptyState from "@/components/state/EmptyState";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import SecurityNotice from "@/components/ui/SecurityNotice";
import ErrorBanner from "@/components/ui/ErrorBanner";
import SuccessToast from "@/components/ui/SuccessToast";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SalesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bannerError, setBannerError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successInfo, setSuccessInfo] = useState({ title: "", message: "" });
  
  const [sales, setSales] = useState([]);
  const [clients, setClients] = useState([]);
  const [profile, setProfile] = useState(null);
  const [filters, setFilters] = useState({});
  const [confirmArchive, setConfirmArchive] = useState({ open: false, id: null });
  const [confirmExport, setConfirmExport] = useState(false);
  const [editingSale, setEditingSale] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setBannerError(null);
    try {
      const [salesData, clientsData, profileData] = await Promise.all([
        getSales(filters),
        getClients(),
        getProfile()
      ]);
      setSales(salesData);
      setClients(clientsData);
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
    const active = sales.filter(s => s.status !== 'voided');
    return {
      total: active.reduce((acc, s) => acc + (parseFloat(s.amount_gross) || 0), 0),
      itbis: active.reduce((acc, s) => acc + (parseFloat(s.amount_itbis) || 0), 0),
      count: active.length
    };
  }, [sales]);

  const executeExport = () => {
    try {
      setBannerError(null);
      const period = formatFiscalPeriod(new Date().toISOString());
      const content = generate607Text(profile.rnc, period, sales);
      download607File(content, `607_${period}_EXPORT.txt`);
      setConfirmExport(false);
      setSuccessInfo({
        title: "Reporte 607 Generado",
        message: "Archivo descargado y validado exitosamente."
      });
      setShowSuccess(true);
    } catch (err) {
      setConfirmExport(false);
      setBannerError(err.message);
    }
  };

  const handleExport = () => {
    if (!profile?.rnc) {
      setBannerError("Debes completar tu RNC en el perfil para exportar 607.");
      return;
    }
    setConfirmExport(true);
  };

  const onSaveSale = async (formData) => {
    try {
      if (editingSale) {
        await updateSale(editingSale.id, formData);
        setSuccessInfo({ title: "Venta Actualizada", message: "Los cambios se guardaron correctamente." });
      } else {
        await createSale(formData);
        setSuccessInfo({ title: "Venta Registrada", message: "La factura ha sido sincronizada con el 607." });
      }
      setIsModalOpen(false);
      setEditingSale(null);
      setShowSuccess(true);
      fetchData();
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      throw err;
    }
  };

  const handleEdit = (sale) => {
    setEditingSale(sale);
    setIsModalOpen(true);
  };

  const executeArchive = async () => {
    if (!confirmArchive.id) return;
    try {
      await archiveSale(confirmArchive.id);
      setConfirmArchive({ open: false, id: null });
      setSuccessInfo({ title: "Registro Anulado", message: "La factura ha sido marcada como anulada." });
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
        title="¿Generar reporte 607?"
        description="Se descargará el archivo de texto (.txt) listo para subir a la oficina virtual de la DGII. Verifica que todas tus ventas del mes estén registradas."
        confirmText="Generar Reporte"
      />

      <ConfirmationModal 
        isOpen={confirmArchive.open}
        onClose={() => setConfirmArchive({ open: false, id: null })}
        onConfirm={executeArchive}
        variant="danger"
        title="¿Anular registro de venta?"
        description="Esta acción marcará la factura como anulada. Para propósitos del 607, las facturas anuladas deben ser reportadas pero no suman al total de ingresos."
        confirmText="Anular Factura"
      />

      <header className="flex flex-col gap-8">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 italic">
            Gestión de <span className="text-primary not-italic">Ventas (607)</span>
          </h2>
          <p className="text-slate-500 font-medium tracking-tight text-sm md:text-base">
            Registro de ingresos y exportación fiscal validada.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
           <button 
             onClick={handleExport}
             className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white border border-slate-200 text-slate-900 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
           >
              <Download className="w-5 h-5 text-primary" /> Exportar 607
           </button>
           <button 
             onClick={() => { setEditingSale(null); setIsModalOpen(true); }}
             className="flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all text-center"
           >
             <Plus className="w-5 h-5" /> Registrar Venta
           </button>
        </div>
      </header>

      <ErrorBanner message={bannerError} onClose={() => setBannerError(null)} />

      <SecurityNotice message="Tus registros de ventas están protegidos. Generamos el archivo 607 respetando estrictamente la estructura técnica de la DGII." />

      <SalesSummaryCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <SalesFilters filters={filters} setFilters={setFilters} clients={clients} />
        </div>

        <div className="lg:col-span-8 min-h-[500px]">
           {loading ? (
             <LoadingState message="Sincronizando operaciones de venta..." />
           ) : error ? (
             <ErrorState message={error} onRetry={fetchData} />
           ) : sales.length === 0 ? (
             <EmptyState 
               title="Sin reportes 607" 
               message="Registra tus ventas e ingresos para generar automáticamente el reporte 607. También puedes ver aquí las facturas legales que emitas."
               onAction={() => setIsModalOpen(true)}
               actionLabel="Cargar Primera Venta"
               icon={TrendingUp}
             />
           ) : (
             <SalesList 
               sales={sales} 
               onEdit={handleEdit}
               onArchive={handleArchive}
             />
           )}
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingSale(null); }}
        title={editingSale ? "Editar Registro de Venta" : "Registrar Venta (607)"}
      >
        <SaleForm 
          initialData={editingSale}
          onSubmit={onSaveSale}
          onCancel={() => { setIsModalOpen(false); setEditingSale(null); }}
        />
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
