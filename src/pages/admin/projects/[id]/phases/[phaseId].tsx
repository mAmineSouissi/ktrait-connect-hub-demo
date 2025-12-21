"use client";

import { ProjectPhaseDetails } from "@/components/admin/projects/details/project-phases/ProjectPhaseDetails";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const projectId = params?.id as string;
  const phaseId = params?.phaseId as string;

  return <ProjectPhaseDetails projectId={projectId} phaseId={phaseId} />;
}
