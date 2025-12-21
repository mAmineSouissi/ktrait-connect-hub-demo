import PartnerDashboard from "@/components/partner/PartnerDashboard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Role } from "@/types/enums";

export default function Page() {
  return (
    <ProtectedRoute requiredRole={Role.PARTNER}>
      <PartnerDashboard />
    </ProtectedRoute>
  );
}
