"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden premium-gradient-bg">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="inline-flex p-4 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-200/20 mb-6">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-2 text-slate-900 italic">CuentasClaras<span className="text-primary not-italic">RD</span></h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Únete a la nueva era contable en Santiago</p>
        </div>

        <div className="glass-card rounded-[2.5rem] p-8 md:p-12 border-white/60 bg-white/70 shadow-2xl shadow-slate-200/40">
          {success ? (
            <div className="text-center space-y-8 py-4">
              <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-[2rem] flex items-center justify-center mx-auto shadow-sm">
                <Mail className="w-10 h-10 text-emerald-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900">¡Casi listo!</h2>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  Hemos enviado un enlace de confirmación a <br /><span className="text-slate-900 font-bold">{email}</span>.
                </p>
              </div>
              <Link 
                href="/login"
                className="block w-full py-5 rounded-2xl bg-slate-900 text-white text-xs font-black hover:bg-primary transition-all shadow-xl uppercase tracking-widest"
              >
                Volver al Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label 
                    htmlFor="signup-email"
                    className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest cursor-pointer"
                  >
                    Email Profesional
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input 
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-slate-900 placeholder:text-slate-300 font-medium"
                      placeholder="ejemplo@negocio.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label 
                    htmlFor="signup-password"
                    className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest cursor-pointer"
                  >
                    Contraseña
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input 
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-slate-900 placeholder:text-slate-300 font-medium"
                      placeholder="Mínimo 8 caracteres"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label 
                    htmlFor="signup-confirm-password"
                    className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest cursor-pointer"
                  >
                    Confirmar Contraseña
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input 
                      id="signup-confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-slate-900 placeholder:text-slate-300 font-medium"
                      placeholder="Repite tu contraseña"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <motion.p 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="text-xs text-rose-600 text-center font-bold bg-rose-50 py-3 rounded-xl border border-rose-100"
                >
                  {error}
                </motion.p>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/30 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 uppercase text-xs tracking-widest"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Crear Cuenta <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="text-center pt-4">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">
                  ¿Ya tienes una cuenta de élite?{" "}
                  <Link href="/login" className="text-primary font-black hover:underline ml-1">
                    Inicia Sesión
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>

        <p className="text-center mt-12 text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">
          Santiago de los Caballeros • Dominicana
        </p>
      </motion.div>
    </div>
  );
}
