"use client";

import { useEffect, useState } from "react";
import type { UserRole } from "@/types/database.types";
import { getClientUser } from "@/lib/auth/client-auth.utils";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

export function RoleGuard({
  children,
  allowedRoles,
  fallback,
}: RoleGuardProps) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    checkRole();
  }, [allowedRoles]);

  async function checkRole() {
    try {
      const user = await getClientUser();

      if (!user || !allowedRoles.includes(user.role)) {
        setHasAccess(false);
        return;
      }

      setHasAccess(true);
    } catch (error) {
      console.error("Role check error:", error);
      setHasAccess(false);
    }
  }

  if (hasAccess === null) {
    return null;
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
