import { ClientProjectDetail } from "@/components/client/ClientProjectDetail";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const { id } = router.query;
  return <ClientProjectDetail id={id as string} />;
}
