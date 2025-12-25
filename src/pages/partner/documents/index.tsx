import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import PartnerDocuments from "@/components/partner/PartnerDocuments";
import { Role } from "@/types";

export default function Page() {
  return (
    <ProtectedRoute requiredRole={Role.PARTNER}>
      <PartnerDocuments />
    </ProtectedRoute>
  );
}
