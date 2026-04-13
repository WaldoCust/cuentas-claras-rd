"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical, CheckCircle, Ban, Eye, FileText, Download } from "lucide-react";
import InvoiceStatusBadge from "./InvoiceStatusBadge";
import { useState } from "react";
import { cn } from "@/lib/utils";
import ProtectedAction from "@/components/auth/ProtectedAction";

function InvoiceActionsMenu({ invoice, onUpdateStatus }) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { 
      id: 'paid', 
      label: 'Marcar como Pagada', 
      icon: CheckCircle, 
      show: invoice.status === 'issued',
      className: "text-emerald-600 hover:bg-emerald-50"
    },
    { 
      id: 'voided', 
      label: 'Anular Factura', 
      icon: Ban, 
      show: ['issued', 'pending_signature', 'draft'].includes(invoice.status),
      className: "text-red-500 hover:bg-red-50"
    }
  ];

  const visibleActions = actions.filter(a => a.show);

  if (visibleActions.length === 0) return null;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-[1.5rem] shadow-2xl z-20 p-2 overflow-hidden"
            >
              {visibleActions.map(action => (
                <ProtectedAction key={action.id} permission={action.id === 'voided' ? 'invoice:void' : 'invoice:sign'}>
                  <button 
                    onClick={() => { onUpdateStatus(invoice.id, action.id); setIsOpen(false); }}
                    className={cn(
                      "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-left",
                      action.className
                    )}
                  >
                    <action.icon className="w-4 h-4" /> {action.label}
                  </button>
                </ProtectedAction>
              ))}
              <div className="h-px bg-slate-50 my-2 px-2 mx-2" />
              <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all text-left">
                <Download className="w-4 h-4" /> Ver PDF
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function InvoiceList({ invoices, onUpdateStatus }) {
  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {invoices.map((invoice, index) => (
          <motion.div 
            layout
            key={invoice.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card group p-6 rounded-[2.25rem] bg-white/70 border-white/60 shadow-xl shadow-slate-200/20 hover:scale-[1.01] transition-all hover:bg-white flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-6 flex-1">
              <div className="w-16 h-16 rounded-[1.5rem] bg-slate-900 flex items-center justify-center font-black text-white text-xs italic shadow-lg shadow-slate-900/10">
                NCF
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                   <h4 className="text-lg font-black text-slate-900 tracking-tight italic">
                     {invoice.client?.business_name || "Cliente Desconocido"}
                   </h4>
                   <InvoiceStatusBadge status={invoice.status} />
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                   <span>NCF: {invoice.ncf_number || "PENDIENTE"}</span>
                   <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                   <span>Fecha: {invoice.date_emission}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-50">
               <div className="text-right space-y-1">
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Monto Total</p>
                  <p className="text-xl font-black text-slate-900 italic tracking-tight">
                    {invoice.currency} {invoice.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
               </div>
               
               <div className="flex gap-3">
                  <button className="p-3.5 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:bg-primary hover:text-white transition-all shadow-sm">
                    <Eye className="w-4 h-4" />
                  </button>
                  <InvoiceActionsMenu 
                    invoice={invoice} 
                    onUpdateStatus={onUpdateStatus} 
                  />
               </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
