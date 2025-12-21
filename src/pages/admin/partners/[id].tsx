"use client";

import { AdminPartnerDetail } from "@/components/admin/partners/AdminPartnerDetail";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const id = params?.id as string;
  return <AdminPartnerDetail id={id} />;
}
