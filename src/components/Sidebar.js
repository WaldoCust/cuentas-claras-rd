"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, 
  Receipt, 
  ShoppingCart, 
  Users, 
  Settings, 
  LayoutDashboard,
  ShieldCheck,
  Zap,
  LogOut,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Facturación (e-CF)", href: "/dashboard/invoices", icon: Zap },
  { name: "Compras (606)", href: "/dashboard/purchases", icon: ShoppingCart },
  { name: "Ventas (607)", href: "/dashboard/sales", icon: Receipt },
  { name: "Impuestos (IT-1)", href: "/dashboard/taxes", icon: BarChart3 },
  { name: "Clientes", href: "/dashboard/clients", icon: Users },
];

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";

export default function Sidebar({ isOpen }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen w-full max-w-[310px] lg:max-w-[410px] p-4 md:p-6 z-50 transition-transform duration-300 transform lg:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="h-full flex flex-col glass-card rounded-[2.5rem] border-white/60 shadow-2xl relative">
        {/* Brand Header */}
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="text-primary w-10 h-10" />
            <div>
               <h1 className="text-xl font-black tracking-tighter text-slate-900 italic">CuentasClaras<span className="text-primary not-italic">RD</span></h1>
               <div className="flex items-center gap-1.5 pt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SISTEMA ACTIVO</span>
               </div>
            </div>
          </div>
        </div>

        {/* Navigation Wrapper */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-hide">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group text-sm font-black uppercase tracking-tight whitespace-nowrap",
                  isActive ? "text-white" : "text-slate-500 hover:text-primary"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-primary shadow-lg shadow-primary/30 rounded-2xl z-0"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <item.icon className={cn(
                  "w-5 h-5 relative z-10 transition-transform group-hover:scale-110",
                  isActive ? "text-white shadow-sm" : "text-slate-400 group-hover:text-primary"
                )} />
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User / Setting Footer */}
        <div className="p-4 mt-auto border-t border-slate-100 bg-slate-50/50">
            <Link
              href="/dashboard/settings"
              className={cn(
                "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all text-sm font-bold group",
                pathname === "/dashboard/settings" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:bg-white"
              )}
            >
              <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform" />
              Configuración
            </Link>

            <div className="mt-4 p-5 rounded-[2rem] bg-white border border-slate-100 shadow-sm border-dashed">
              <div className="flex items-center gap-3 mb-3">
                 <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-slate-400" />
                 </div>
                 <div className="overflow-hidden">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight truncate">Santiago Vertical SRL</p>
                    <p className="text-[11px] font-black text-slate-900">RNC: 131-00000-1</p>
                 </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full py-3 rounded-xl bg-slate-50 text-[10px] font-black text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all flex items-center justify-center gap-2 uppercase tracking-widest border border-slate-100"
              >
                <LogOut className="w-3.5 h-3.5" /> Cerrar Sesión
              </button>
            </div>
        </div>
      </div>

      {/* Background Decor inside sidebar */}
      <div className="absolute bottom-4 left-4 w-24 h-24 bg-primary/5 blur-2xl rounded-full pointer-events-none" />
    </aside>
  );
}
