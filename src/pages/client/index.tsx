import ClientDashboard from "@/components/client/ClientDashboard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Role } from "@/types/enums";

export default function Page() {
  return (
    <ProtectedRoute requiredRole={Role.CLIENT}>
      <ClientDashboard />
    </ProtectedRoute>
  );
}
