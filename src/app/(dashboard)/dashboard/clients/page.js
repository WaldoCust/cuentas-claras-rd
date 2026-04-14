"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShieldCheck, Zap } from "lucide-react";
import Modal from "@/components/Modal";
import { cn } from "@/lib/utils";
import { getClients, createClient, updateClient, archiveClient, syncClientsFromInvoices } from "@/lib/data/clients";

// New Components
import ClientForm from "@/components/clients/ClientForm";
import ClientList from "@/components/clients/ClientList";
import ClientFilters from "@/components/clients/ClientFilters";
import EmptyState from "@/components/state/EmptyState";
import LoadingState from "@/components/state/LoadingState";
import ErrorState from "@/components/state/ErrorState";
import SuccessToast from "@/components/ui/SuccessToast";
import { UserPlus } from "lucide-react";

export default function ClientsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successInfo, setSuccessInfo] = useState({ title: "", message: "" });
  
  const [filters, setFilters] = useState({
    status: 'active',
    type: ''
  });

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClients(filters);
      setClients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [filters]);

  const filteredClients = useMemo(() => {
    if (!searchQuery) return clients;
    const q = searchQuery.toLowerCase();
    return clients.filter(c => 
      c.business_name.toLowerCase().includes(q) || 
      c.rnc_or_cedula.includes(q)
    );
  }, [clients, searchQuery]);

  const handleOpenCreate = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingClient) {
        await updateClient(editingClient.id, formData);
        setSuccessInfo({ title: "Perfil Actualizado", message: "Los datos del cliente se han sincronizado correctamente." });
      } else {
        await createClient(formData);
        setSuccessInfo({ title: "Cliente Registrado", message: "El nuevo cliente ha sido añadido a tu cartera." });
      }
      setIsModalOpen(false);
      setShowSuccess(true);
      fetchClients();
    } catch (err) {
      throw err; // Form component will handle showing the error
    }
  };

  const handleArchive = async (id) => {
    try {
      await archiveClient(id);
      fetchClients();
    } catch (err) {
      alert("Error al archivar: " + err.message);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await syncClientsFromInvoices();
      if (result.count > 0) {
        alert(`Se han sincronizado ${result.count} clientes nuevos.`);
        fetchClients();
      } else {
        alert("No se encontraron clientes nuevos para sincronizar.");
      }
    } catch (err) {
      alert("Error al sincronizar: " + err.message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-slate-900 italic">Central de <span className="text-primary not-italic">Clientes</span></h2>
          <p className="text-slate-500 font-medium tracking-tight">Gestión avanzada de cartera comercial, historial de facturación y score de riesgo fiscal.</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={handleSync}
             disabled={syncing}
             className={cn(
               "flex items-center gap-3 px-6 py-4 rounded-[1.5rem] bg-white border border-slate-200 text-slate-900 font-black text-[10px] uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all",
               syncing && "opacity-50 cursor-not-allowed"
             )}
           >
             <Zap className={cn("w-4 h-4 text-primary", syncing && "animate-pulse")} /> 
             {syncing ? "Sincronizando..." : "Sincronizar Historial"}
           </button>
           <button 
             onClick={handleOpenCreate}
             className="flex items-center gap-3 px-8 py-4 rounded-[1.5rem] bg-primary text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all text-center"
           >
             <UserPlus className="w-5 h-5" /> Registrar Nuevo
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-4">
           <ClientFilters filters={filters} setFilters={setFilters} />
         </div>

         <div className="lg:col-span-8 space-y-6">
            <div className="glass-card rounded-[2.5rem] p-5 flex items-center gap-5 bg-white shadow-xl shadow-slate-200/20 border-white group relative overflow-hidden">
               <Search className="w-5 h-5 text-slate-400 ml-4 group-focus-within:text-primary transition-colors" />
               <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Búsqueda Inteligente por RNC, Nombre o Documento..." 
                  className="bg-transparent border-none text-sm font-bold focus:outline-none w-full text-slate-900 placeholder:text-slate-300 py-3"
               />
               <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-white pointer-events-none" />
            </div>

            <div className="space-y-4">
               {loading ? (
                 <LoadingState message="Consultando cartera de clientes..." />
               ) : error ? (
                 <ErrorState message={error} onRetry={fetchClients} />
               ) : filteredClients.length === 0 ? (
                 <ClientEmptyState 
                    type={searchQuery ? "search" : "empty"} 
                    onAction={searchQuery ? null : handleOpenCreate} 
                    actionLabel="Registrar Primer Cliente"
                 />
               ) : (
                 <ClientList 
                    clients={filteredClients} 
                    onEdit={handleOpenEdit} 
                    onArchive={handleArchive} 
                 />
               )}
            </div>
         </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingClient ? "Editar Perfil de Cliente" : "Nuevo Cliente en Cartera"}
      >
        <ClientForm 
          client={editingClient}
          onSubmit={handleSubmit}
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
