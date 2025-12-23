import { AdminProjectDetail } from "@/components/admin/projects/details/AdminProjectDetail";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return null;
  return <AdminProjectDetail id={id as string} />;
}
