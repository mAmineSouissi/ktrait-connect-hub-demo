import { AdminPartnerDetail } from "@/components/admin/partners/AdminPartnerDetail";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const { id } = router.query;
  return <AdminPartnerDetail id={id as string} />;
}
