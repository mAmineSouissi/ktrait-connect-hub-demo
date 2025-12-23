import { AdminClientDetail } from "@/components/admin/clients/AdminClientDetail";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const id = params?.id as string;

  return <AdminClientDetail id={id} />;
}
