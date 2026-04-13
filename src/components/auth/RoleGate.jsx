"use client";

import { useAuth } from "@/components/providers/AuthProvider"; // I'll need to create this or use a context
import { hasPermission } from "@/lib/auth/permissions";

/**
 * Client-side gate for conditional rendering based on roles/permissions.
 * @param {string} permission - The capability to check
 * @param {ReactNode} children - Content to show if permitted
 * @param {ReactNode} fallback - Content to show if denied
 */
export default function RoleGate({ permission, children, fallback = null, role: forceRole }) {
  // We'll assume a useAuth hook exists that provides the user's role
  // For now, I'll implement a simple context-based check
  const { role } = useAuth();
  
  const userRole = forceRole || role;
  const allowed = hasPermission(userRole, permission);

  if (!allowed) return fallback;

  return <>{children}</>;
}
