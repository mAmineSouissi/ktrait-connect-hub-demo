import { AdminDashboard } from "@/components/admin/Dashboard/AdminDashboard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Role } from "@/types/enums";

export default function Page() {
  return (
    <ProtectedRoute requiredRole={Role.ADMIN}>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
