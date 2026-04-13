"use client";

import { motion } from "framer-motion";
import { Wand2, AlertCircle, CheckCircle2 } from "lucide-react";
import PurchaseForm from "./PurchaseForm";

export default function PurchaseImportReview({ parsedData, image, onConfirm, onCancel }) {
  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      {/* Receipt Preview */}
      <div className="flex-1 space-y-4">
         <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-primary/10">
               <Wand2 className="w-5 h-5 text-primary" />
            </div>
            <div>
               <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight italic">Previsión de IA</h4>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Confirma los datos extraídos</p>
            </div>
         </div>
         <div className="relative rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl bg-slate-50 group aspect-[3/4]">
            {image && (
              <img 
                src={image} 
                alt="Receipt Capture" 
                className="w-full h-full object-contain"
              />
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/60 to-transparent p-6 pt-12">
               <div className="flex items-center gap-2 text-white">
                 <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">Documento Analizado</span>
               </div>
            </div>
         </div>
         <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0" />
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tight leading-relaxed">
              La IA ha detectado los montos y el NCF. Por favor, revisa la categoría de gasto antes de guardar.
            </p>
         </div>
      </div>

      {/* Confirmation Form */}
      <div className="flex-[1.5] glass-card rounded-[3rem] p-8 bg-white/60 border-white shadow-xl overflow-y-auto">
         <PurchaseForm 
            initialData={parsedData}
            onSubmit={onConfirm}
            onCancel={onCancel}
         />
      </div>
    </div>
  );
}
