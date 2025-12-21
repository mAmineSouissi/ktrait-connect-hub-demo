import { AdminChantierDetail } from "@/components/admin/chantiers/AdminChantierDetail";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams();
  return <AdminChantierDetail id={id as string} />;
}
