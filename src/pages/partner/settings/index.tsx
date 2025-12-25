import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import PartnerSettings from "@/components/partner/PartnerSettings";
import { Role } from "@/types";

export default function Page() {
  return (
    <ProtectedRoute requiredRole={Role.PARTNER}>
      <PartnerSettings />
    </ProtectedRoute>
  );
}
