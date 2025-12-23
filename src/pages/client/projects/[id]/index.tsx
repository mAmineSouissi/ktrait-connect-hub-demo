import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ClientProjectDetail } from "@/components/client/ClientProjectDetail";
import { Role } from "@/types";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const id = params?.id as string;
  return (
    <ProtectedRoute requiredRole={Role.CLIENT}>
      <ClientProjectDetail id={id} />
    </ProtectedRoute>
  );
}
