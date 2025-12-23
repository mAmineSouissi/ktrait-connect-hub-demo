import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ClientBilling } from "@/components/client/ClientBilling";
import { Role } from "@/types";

export default function Page() {
    return (
        <ProtectedRoute requiredRole={Role.CLIENT}>
            <ClientBilling />
        </ProtectedRoute>
    )
}