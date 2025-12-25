import { useRouter } from "next/router";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ClientInvoiceDetail } from "@/components/client/ClientInvoiceDetail";
import { Role } from "@/types";

export default function Page() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <ProtectedRoute requiredRole={Role.CLIENT}>
      <ClientInvoiceDetail id={id as string} />
    </ProtectedRoute>
  );
}
