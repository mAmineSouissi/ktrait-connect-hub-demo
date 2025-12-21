import { AdminChantierDetail } from "@/components/admin/chantiers/AdminChantierDetail";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const id = params?.id;

  if (!id || Array.isArray(id)) {
    return null;
  }

  return <AdminChantierDetail id={id} />;
}
