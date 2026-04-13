"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MoreVertical, Archive, Edit3, ShieldAlert } from "lucide-react";
import { formatIdentity } from "@/lib/validation/clients";
import { cn } from "@/lib/utils";
import { useState } from "react";

function ClientActionsMenu({ client, onEdit, onArchive }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-3.5 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
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
              className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-[1.5rem] shadow-2xl z-20 p-2 overflow-hidden"
            >
              <button 
                onClick={() => { onEdit(client); setIsOpen(false); }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-primary transition-all text-left"
              >
                <Edit3 className="w-4 h-4" /> Editar Perfil
              </button>
              <button 
                onClick={() => { onArchive(client.id); setIsOpen(false); }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all text-left"
              >
                <Archive className="w-4 h-4" />
                {client.status === 'archived' ? 'Restaurar' : 'Archivar Cliente'}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ClientList({ clients, onEdit, onArchive }) {
  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {clients.map((client, index) => (
          <motion.div 
            layout
            key={client.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card group p-6 rounded-[2.25rem] flex items-center justify-between bg-white/70 border-white/60 shadow-xl shadow-slate-200/20 hover:scale-[1.01] transition-all hover:bg-white"
          >
            <div className="flex items-center gap-6">
              <div className={cn(
                "w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-white text-xl shadow-lg transition-colors italic",
                client.status === 'archived' ? 'bg-slate-300' : 'bg-slate-900 group-hover:bg-primary shadow-slate-900/10'
              )}>
                {client.business_name[0]}
              </div>
              <div>
                <h4 className={cn(
                  "text-lg font-black tracking-tight italic transition-colors",
                  client.status === 'archived' ? 'text-slate-400' : 'text-slate-900 group-hover:text-primary'
                )}>
                  {client.business_name}
                </h4>
                <div className="flex items-center gap-3 mt-1.5 text-[10px] font-extrabold uppercase tracking-widest">
                   <span className="text-slate-400">
                     {client.document_type || 'RNC'}: {formatIdentity(client.rnc_or_cedula, client.document_type)}
                   </span>
                   <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                   <span className={cn(
                     "px-2 py-0.5 rounded-md border",
                     client.fiscal_type === "Crédito Fiscal" 
                       ? "text-primary border-primary/10 bg-primary/5" 
                       : "text-slate-400 border-slate-100 bg-slate-50"
                   )}>
                      {client.fiscal_type}
                   </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-10">
              <div className="hidden lg:flex flex-col items-end">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5">Cumplimiento</p>
                <div className="flex items-center gap-2">
                   <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(s => (
                         <div key={s} className={cn("w-1.5 h-1.5 rounded-full", s <= 4 ? "bg-emerald-500" : "bg-slate-200")} />
                      ))}
                   </div>
                   <span className="text-xs font-black text-emerald-600 uppercase italic">
                     {client.behavior || 'Óptima'}
                   </span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button className="p-3.5 rounded-2xl bg-slate-50 text-slate-400 hover:bg-primary hover:text-white transition-all shadow-sm">
                  <Mail className="w-4 h-4" />
                </button>
                <ClientActionsMenu 
                  client={client} 
                  onEdit={onEdit} 
                  onArchive={onArchive} 
                />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
