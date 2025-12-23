import { AdminChantierDetail } from "@/components/admin/chantiers/AdminChantierDetail";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const { id } = router.query;
  if (!id) {
    return null;
  }

  return <AdminChantierDetail id={id as string} />;
}
