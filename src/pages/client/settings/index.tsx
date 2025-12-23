import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ClientSettings } from "@/components/client/ClientSettings";
import { Role } from "@/types";

export default function Page() {
  return (
    <ProtectedRoute requiredRole={Role.CLIENT}>
      <ClientSettings />
    </ProtectedRoute>
  );
}
