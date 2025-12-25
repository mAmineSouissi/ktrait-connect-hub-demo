import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ClientInvoices } from "@/components/client/ClientInvoices";
import { Role } from "@/types";

export default function Page() {
  return (
    <ProtectedRoute requiredRole={Role.CLIENT}>
      <ClientInvoices />
    </ProtectedRoute>
  );
}
