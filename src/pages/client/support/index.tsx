import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import ClientSupport from "@/components/client/ClientSupport";
import { Role } from "@/types";

export default function Page() {
  return (
    <ProtectedRoute requiredRole={Role.CLIENT}>
      <ClientSupport />
    </ProtectedRoute>
  );
}
