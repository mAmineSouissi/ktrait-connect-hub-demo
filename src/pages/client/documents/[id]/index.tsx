import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Role } from "@/types";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const id = params?.id as string;
  return (
    <ProtectedRoute requiredRole={Role.CLIENT}>
      <div>Client Documents {id}</div>
    </ProtectedRoute>
  );
}
