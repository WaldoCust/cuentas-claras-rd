"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Search, Bell, User, Menu, X } from "lucide-react";
import { AuthProvider } from "@/components/providers/AuthProvider";

import OnboardingModal from "@/components/onboarding/OnboardingModal";
import TrustBadge from "@/components/ui/TrustBadge";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Simple breadcrumb logic
  const pathParts = pathname.split("/").filter(Boolean);
  const currentPathName = pathParts[pathParts.length - 1] || "Dashboard";
  const formattedPath = currentPathName.charAt(0).toUpperCase() + currentPathName.slice(1);

  return (
    <AuthProvider>
      <div className="flex min-h-screen premium-gradient-bg relative">
        <OnboardingModal />
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[45] lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Fixed Sidebar with props */}
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        {/* Main Content Area */}
        <main className="flex-1 lg:pl-[410px] min-h-screen flex flex-col transition-all duration-300">
          {/* Top Header Bar */}
          <header className="h-20 px-6 md:px-10 flex items-center justify-between sticky top-0 z-40 bg-white/10 backdrop-blur-md border-b border-white/20">
            <div className="flex items-center gap-3 md:gap-4">
               {/* Mobile Toggle Button */}
               <button 
                 onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                 className="p-2.5 rounded-xl bg-white md:bg-transparent border border-slate-100 md:border-transparent lg:hidden shadow-sm md:shadow-none"
               >
                 {isSidebarOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-900" />}
               </button>

               <div className="hidden sm:flex items-center gap-2">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Portal</span>
                 <ChevronRight className="w-3 h-3 text-slate-300" />
               </div>
               <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">{formattedPath}</span>
               
               <TrustBadge type="compliance" className="hidden xl:flex ml-4" />
            </div>

            <div className="flex items-center gap-6">
               <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400">
                  <Search className="w-4 h-4" />
                  <span className="text-xs font-bold">Buscar...</span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 ml-4">⌘K</span>
               </div>
               
               <button className="relative p-2 text-slate-400 hover:text-primary transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
               </button>

               <div className="h-10 w-px bg-slate-200 mx-2" />

               <div className="flex items-center gap-3 pl-2">
                  <div className="text-right hidden sm:block">
                     <p className="text-xs font-black text-slate-900 leading-none">Admin Usuario</p>
                     <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-tight mt-1">Nivel Elite</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/10 cursor-pointer hover:scale-105 transition-transform">
                     <User className="text-white w-5 h-5" />
                  </div>
               </div>
            </div>
          </header>

          {/* Dynamic Page Content */}
          <section className="flex-1 px-4 py-8 md:p-10 overflow-x-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </section>

          {/* Footer info snippet */}
          <footer className="px-10 py-6 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] border-t border-slate-100 flex justify-between">
             <span>CuentasClaras RD v1.1 • Santiago de los Caballeros</span>
             <span className="text-emerald-500">Servidores Optimizados</span>
          </footer>
        </main>
      </div>
    </AuthProvider>
  );
}
