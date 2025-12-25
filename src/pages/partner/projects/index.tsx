import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import PartnerProjects from "@/components/partner/PartnerProjects";
import { Role } from "@/types";

export default function Page() {
  return (
    <ProtectedRoute requiredRole={Role.PARTNER}>
      <PartnerProjects />
    </ProtectedRoute>
  );
}
