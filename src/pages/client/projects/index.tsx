import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ClientProjects } from "@/components/client/ClientProjects";
import { Role } from "@/types";

export default function Page() {
  return (
    <ProtectedRoute requiredRole={Role.CLIENT}>
      <ClientProjects />
    </ProtectedRoute>
  );
}
