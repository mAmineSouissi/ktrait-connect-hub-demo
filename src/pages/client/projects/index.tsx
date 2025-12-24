import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import ClientProjects from "@/components/client/projects/ClientProjects";
import { Role } from "@/types";

export default function Page() {
  return (
    <ProtectedRoute requiredRole={Role.CLIENT}>
      <ClientProjects />
    </ProtectedRoute>
  );
}
