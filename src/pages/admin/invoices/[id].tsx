import { AdminInvoiceDetail } from "@/components/admin/invoices/AdminInvoiceDetail";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const { id } = router.query;
  if (!id) {
    return <div>Invoice ID is required</div>;
  }

  return <AdminInvoiceDetail id={id as string} />;
}
