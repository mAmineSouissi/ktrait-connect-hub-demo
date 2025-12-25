import { PartnerProjectDetail } from "@/components/partner/PartnerProjectDetail";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const { id } = router.query;

  return <PartnerProjectDetail id={id as string} />;
}
