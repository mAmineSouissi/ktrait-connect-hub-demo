"use client";

import { getClientUser } from "@/lib/auth/client-auth.utils";
import { useEffect, useState } from "react";
import type { User } from "@/types/user.types";

interface PermissionGuardProps {
  children: React.ReactNode;
  resource: string;
  action: string;
  fallback?: React.ReactNode;
}

export function PermissionGuard({
  children,
  resource,
  action,
  fallback,
}: PermissionGuardProps) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    checkPermission();
  }, [resource, action]);

  async function checkPermission() {
    try {
      const user = await getClientUser();

      if (!user) {
        setHasAccess(false);
        return;
      }

      // Check if user has permissions property (extended User type)
      const userWithPermissions = user as User & {
        permissions?: Array<{ resource: string; action: string }>;
      };

      if (
        !userWithPermissions.permissions ||
        userWithPermissions.permissions.length === 0
      ) {
        setHasAccess(false);
        return;
      }

      const hasPermission = userWithPermissions.permissions.some(
        (p: { resource: string; action: string }) =>
          p.resource === resource && p.action === action
      );

      setHasAccess(hasPermission);
    } catch (error) {
      console.error("Permission check error:", error);
      setHasAccess(false);
    }
  }

  if (hasAccess === null) {
    return null;
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
