import { AdminProjectDetail } from "@/components/admin/projects/details/AdminProjectDetail";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams();
  return <AdminProjectDetail id={id as string} />;
}
