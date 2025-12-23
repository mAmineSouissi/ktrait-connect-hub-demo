import { ProjectPhaseDetails } from "@/components/admin/projects/details/project-phases/ProjectPhaseDetails";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const { id, phaseId } = router.query;
  return (
    <ProjectPhaseDetails projectId={id as string} phaseId={phaseId as string} />
  );
}
