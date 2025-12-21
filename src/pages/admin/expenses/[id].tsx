"use client";

import { AdminExpenseDetail } from "@/components/admin/projects/details/project-expenses/AdminExpenseDetail";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const expenseId = params?.id as string;

  return <AdminExpenseDetail expenseId={expenseId} />;
}
