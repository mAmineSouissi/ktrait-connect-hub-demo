import { AdminExpenseDetail } from "@/components/admin/projects/details/project-expenses/AdminExpenseDetail";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const { id } = router.query;
  return <AdminExpenseDetail expenseId={id as string} />;
}
