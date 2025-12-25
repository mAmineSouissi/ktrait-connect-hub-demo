import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import PartnerTasks from "@/components/partner/PartnerTasks";
import { Role } from "@/types";

export default function Page() {
  return (
    <ProtectedRoute requiredRole={Role.PARTNER}>
      <PartnerTasks />
    </ProtectedRoute>
  );
}
