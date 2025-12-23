"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import type { ProjectWithDetails } from "@/types/project.types";
import { BasicProjectDetails } from "./project-cards/BasicProjectDetails";
import { ProjectDetailsTabs } from "./ProjectDetailsTabs";

interface AdminProjectDetailProps {
  id: string;
}

export const AdminProjectDetail = ({ id }: AdminProjectDetailProps) => {
  const router = useRouter();

  const {
    data: projectData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const result = await api.admin.projects.getById(id);
      return result.project;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !projectData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <p className="text-destructive mb-4">
          {error instanceof Error
            ? error.message
            : "Erreur lors du chargement du projet"}
        </p>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/projects")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux projets
        </Button>
      </div>
    );
  }

  const project = projectData as ProjectWithDetails;

  // Calculate remaining budget
  const estimatedBudget = project.estimated_budget || 0;
  const spentAmount = project.spent_amount || project.expenses_total || 0;
  const remaining = estimatedBudget - spentAmount;
  const budgetProgress =
    estimatedBudget > 0 ? (spentAmount / estimatedBudget) * 100 : 0;

  return (
    <div className="w-full space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.push("/admin/projects")}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour aux projets
      </Button>
      <BasicProjectDetails
        project={project}
        spentAmount={spentAmount}
        remaining={remaining}
        budgetProgress={budgetProgress}
      />
      <ProjectDetailsTabs projectId={id} />
    </div>
  );
};
