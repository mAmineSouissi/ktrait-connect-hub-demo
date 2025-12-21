import { AdminProjectDetail } from "@/components/admin/projects/details/AdminProjectDetail";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const id = params?.id as string;
  return <AdminProjectDetail id={id} />;
}
