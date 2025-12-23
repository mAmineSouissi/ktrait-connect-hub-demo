import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ClientDocuments } from "@/components/client/ClientDocuments";
import { Role } from "@/types";

export default function Page() {
  return (
    <ProtectedRoute requiredRole={Role.CLIENT}>
      <ClientDocuments />
    </ProtectedRoute>
  );
}
