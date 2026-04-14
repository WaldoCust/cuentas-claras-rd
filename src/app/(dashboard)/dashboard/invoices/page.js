"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, FilePlus2, Search, History, History as PaidIcon, Clock } from "lucide-react";
import Modal from "@/components/Modal";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import ProtectedAction from "@/components/auth/ProtectedAction";

// New Components & Services
import { getIssuedInvoices, createIssuedInvoice, updateInvoiceStatus } from "@/lib/data/invoices";
import InvoiceForm from "@/components/invoices/InvoiceForm";
import InvoiceList from "@/components/invoices/InvoiceList";
import EmptyState from "@/components/state/EmptyState";
import LoadingState from "@/components/state/LoadingState";
import ErrorState from "@/components/state/ErrorState";
import SuccessToast from "@/components/ui/SuccessToast";
import { TrendingUp } from "lucide-react";

function InvoiceStatCard({ label, value, icon: Icon, delay }) {
  return (
    <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ delay }}
       className="glass-card group p-6 rounded-[2rem] bg-white/70 border-white/60 shadow-xl shadow-slate-200/20"
    >
       <div className="flex justify-between items-center mb-6">
          <div className="p-4 rounded-2xl bg-slate-900 group-hover:bg-primary transition-colors flex items-center justify-center shadow-lg shadow-slate-900/10">
             <Icon className="w-5 h-5 text-white" />
          </div>
       </div>
       <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-[0.2em] mb-1">{label}</p>
       <p className="text-2xl font-black text-slate-900 italic tracking-tight">{value}</p>
    </motion.div>
  );
}

export default function InvoicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ status: '' });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successInfo, setSuccessInfo] = useState({ title: "", message: "" });
  
  const router = useRouter();

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getIssuedInvoices(filters);
      setInvoices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [filters]);

  const stats = useMemo(() => {
    const issued = invoices.filter(i => i.status === 'issued' || i.status === 'paid');
    const totalIssued = issued.reduce((sum, i) => sum + (parseFloat(i.total) || 0), 0);
    const pending = invoices.filter(i => i.status === 'issued').reduce((sum, i) => sum + (parseFloat(i.total) || 0), 0);
    
    return {
      monthly: totalIssued,
      pending: pending,
      ncfCount: 500 - issued.length // Simple mock incrementer
    };
  }, [invoices]);

  const filteredInvoices = useMemo(() => {
    if (!searchQuery) return invoices;
    const q = searchQuery.toLowerCase();
    return invoices.filter(i => 
       i.ncf_number?.toLowerCase().includes(q) || 
       i.client?.business_name.toLowerCase().includes(q)
    );
  }, [invoices, searchQuery]);

  const handleCreateInvoice = async (formData) => {
    try {
      await createIssuedInvoice(formData);
      setIsModalOpen(false);
      setSuccessInfo({ title: "Factura Emitida", message: "El comprobante fiscal ha sido generado y registrado." });
      setShowSuccess(true);
      fetchInvoices();
    } catch (err) {
      throw err;
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateInvoiceStatus(id, status);
      setSuccessInfo({ title: "Estado Actualizado", message: `La factura ha sido marcada como ${status}.` });
      setShowSuccess(true);
      fetchInvoices();
    } catch (err) {
      alert("Error al actualizar: " + err.message);
    }
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-slate-900 italic">Facturación <span className="text-primary not-italic">Electrónica</span></h2>
          <p className="text-slate-500 font-medium tracking-tight">Emisión y gestión de comprobantes fiscales electrónicos (e-CF) bajo estándares DGII.</p>
        </div>
        <ProtectedAction permission="invoice:create" hide>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 px-8 py-4 rounded-[1.5rem] bg-primary text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all text-center"
          >
            <FilePlus2 className="w-5 h-5" /> Nueva Factura
          </button>
        </ProtectedAction>
      </header>

      {/* Stats Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <InvoiceStatCard label="Emitidas (Histórico)" value={`RD$ ${stats.monthly.toLocaleString()}`} icon={History} delay={0.1} />
        <InvoiceStatCard label="Pendientes de Cobro" value={`RD$ ${stats.pending.toLocaleString()}`} icon={Clock} delay={0.2} />
        <InvoiceStatCard label="NCF Disponibles" value={stats.ncfCount} icon={Zap} delay={0.3} />
      </div>

      {/* Dashboard Area */}
      <section className="space-y-6">
         <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white/40 p-5 rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/10">
            <div className="relative group w-full md:w-96">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
               <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por NCF o Nombre de Cliente..." 
                  className="bg-white border-none rounded-2xl py-4 pl-12 pr-6 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 w-full shadow-sm"
               />
            </div>
            
            <div className="flex gap-2 p-1 bg-white/50 rounded-2xl border border-white/60">
               {['', 'draft', 'issued', 'paid', 'voided'].map(status => (
                 <button
                    key={status}
                    onClick={() => setFilters({ status })}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      filters.status === status ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
                    )}
                 >
                    {status === '' ? 'Todos' : status === 'paid' ? 'Pagados' : status === 'issued' ? 'Emitidos' : status === 'voided' ? 'Anulados' : 'Borradores'}
                 </button>
               ))}
            </div>
         </div>

         <div className="min-h-[400px]">
            {loading ? (
              <LoadingState message="Cargando historial de facturación..." />
            ) : error ? (
              <ErrorState message={error} onRetry={fetchInvoices} />
           ) : filteredInvoices.length === 0 ? (
             <EmptyState 
               title={searchQuery ? "Sin coincidencias" : "Facturación Vacía"} 
               message={searchQuery ? "No encontramos facturas con ese NCF o cliente." : "Comienza a emitir comprobantes fiscales electrónicos (e-CF) de manera profesional y rápida."}
               onAction={() => setIsModalOpen(true)}
               actionLabel="Nueva Factura Legal"
               icon={FilePlus2}
             />
            ) : (
              <InvoiceList 
                 invoices={filteredInvoices} 
                 onUpdateStatus={handleUpdateStatus} 
              />
            )}
         </div>
      </section>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Nueva Factura Fiscal"
      >
        <InvoiceForm 
          onSubmit={handleCreateInvoice}
          onCancel={() => setIsModalOpen(false)}
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
