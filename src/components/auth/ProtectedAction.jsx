"use client";

import React from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { hasPermission } from "@/lib/auth/permissions";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

/**
 * Wrapper for interactive elements (buttons, links) to enforce RBAC.
 * @param {string} permission - Required permission
 * @param {boolean} hide - Whether to hide completely if denied (default: false, disables)
 */
export default function ProtectedAction({ permission, children, hide = false, className }) {
  const { role } = useAuth();
  const allowed = hasPermission(role, permission);

  if (!allowed && hide) return null;

  if (!allowed) {
    // Clone children to inject disabled state or custom styles
    return React.Children.map(children, child => {
      return React.cloneElement(child, {
        disabled: true,
        title: "Acceso Restringido",
        className: cn(child.props.className, "opacity-50 cursor-not-allowed grayscale pointer-events-none"),
        children: (
          <>
            {child.props.children}
            <Lock className="w-3 h-3 ml-2 opacity-50" />
          </>
        )
      });
    });
  }

  return children;
}
