import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import type { UserRole } from "@/types/database.types";
import { Role } from "@/types/enums";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[] | Role | Role[] | string | string[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
  redirectTo,
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (loading) {
      setIsChecking(true);
      return;
    }

    setIsChecking(false);

    if (!isAuthenticated) {
      const loginPath = redirectTo || "/";
      router.push(loginPath);
      return;
    }

    // Check if user is approved (admin users are always approved)
    if (user) {
      const approvalStatus = user.approval_status || "pending";
      if (user.role !== "admin" && approvalStatus !== "approved") {
        // Redirect to pending approval page if pending
        if (approvalStatus === "pending") {
          router.push("/pending-approval");
          return;
        }
        // If rejected, redirect to login
        if (approvalStatus === "rejected") {
          router.push("/");
          return;
        }
      }
    }

    // If role is required, check if user has the required role
    if (requiredRole && user) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      const userRole = user.role;

      // Convert Role enum values to strings for comparison
      const roleStrings = roles.map((r) => {
        // Handle Role enum
        if (r === Role.ADMIN || r === Role.CLIENT || r === Role.PARTNER) {
          return r;
        }
        // Handle string values
        if (typeof r === "string") return r;
        // Fallback to string conversion
        return String(r);
      });
      if (!roleStrings.includes(userRole)) {
        // Redirect based on user's actual role
        const rolePath =
          userRole === "admin"
            ? "/admin"
            : userRole === "partner"
            ? "/partner"
            : "/client";
        router.push(rolePath);
        return;
      }
    }
  }, [isAuthenticated, user, loading, requiredRole, router, redirectTo]);

  // Show loading state
  if (loading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Don't render if user is not approved (except admins)
  if (user) {
    const approvalStatus = user.approval_status || "pending";
    if (user.role !== "admin" && approvalStatus !== "approved") {
      return null;
    }
  }

  // Don't render if role doesn't match
  if (requiredRole && user) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const roleStrings = roles.map((r) => {
      if (typeof r === "string") return r;
      if (typeof r === "object" && "value" in r) return String(r);
      return String(r);
    });
    if (!roleStrings.includes(user.role)) {
      return null;
    }
  }

  return <>{children}</>;
}
