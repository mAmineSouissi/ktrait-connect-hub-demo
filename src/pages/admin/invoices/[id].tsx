"use client";

import { AdminInvoiceDetail } from "@/components/admin/invoices/AdminInvoiceDetail";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const id = params?.id as string;

  if (!id) {
    return <div>Invoice ID is required</div>;
  }

  return <AdminInvoiceDetail id={id} />;
}
