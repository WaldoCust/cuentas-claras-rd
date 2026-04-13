"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { createClient } from "@/lib/supabase/client";

const ONBOARDING_KEY = "cuentas_claras_onboarding_step_3";
const DISMISS_KEY = "cuentas_claras_onboarding_dismissed";

export function useOnboarding() {
  const { profile, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState([
    { id: 1, title: "Configura tu negocio", completed: false },
    { id: 2, title: "Sube tu primera factura", completed: false },
    { id: 3, title: "Genera tu 606", completed: false },
  ]);
  const [isDismissed, setIsDismissed] = useState(false);
  const supabase = createClient();

  const checkProgress = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    // Step 1: Check Profile
    const step1Done = !!(profile?.business_name && profile?.rnc);

    // Step 2: Check Invoices (Purchase/606)
    const { count, error } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('type', '606');
    
    const step2Done = (count || 0) > 0;

    // Step 3: Check Local Persistence (since we don't have a 'generated' flag in DB yet)
    const step3Done = localStorage.getItem(ONBOARDING_KEY) === "true";

    setSteps([
      { id: 1, title: "Configura tu negocio", completed: step1Done },
      { id: 2, title: "Sube tu primera factura", completed: step2Done },
      { id: 3, title: "Genera tu 606", completed: step3Done },
    ]);

    setIsDismissed(localStorage.getItem(DISMISS_KEY) === "true");
    setLoading(false);
  }, [user, profile, supabase]);

  useEffect(() => {
    checkProgress();
  }, [checkProgress]);

  const completeStep3 = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    checkProgress();
  };

  const dismissOnboarding = () => {
    localStorage.setItem(DISMISS_KEY, "true");
    setIsDismissed(true);
  };

  const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_KEY);
    localStorage.removeItem(DISMISS_KEY);
    checkProgress();
  };

  const completedCount = steps.filter(s => s.completed).length;
  const isAllCompleted = completedCount === steps.length;
  const activeStep = steps.find(s => !s.completed)?.id || 4; // 4 means all done

  return {
    steps,
    loading,
    activeStep,
    completedCount,
    isAllCompleted,
    isDismissed,
    completeStep3,
    dismissOnboarding,
    resetOnboarding,
    refresh: checkProgress
  };
}
