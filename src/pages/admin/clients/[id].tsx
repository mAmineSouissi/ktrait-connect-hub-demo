import { AdminClientDetail } from "@/components/admin/clients/AdminClientDetail";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const { id } = router.query;

  return <AdminClientDetail id={id as string} />;
}
