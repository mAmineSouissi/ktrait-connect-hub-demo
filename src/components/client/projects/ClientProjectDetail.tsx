"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Edit } from "lucide-react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import type { ProjectWithDetails } from "@/types/project.types";
import { BasicProjectDetails } from "../project-cards/BasicProjectDetails";
import { ClientProjectDetailsTabs } from "./ClientProjectDetailsTabs";
import { useProjectStore } from "@/hooks/stores/useProjectStore";
import { useClientProjectUpdateSheet } from "./modals/ClientProjectUpdateSheet";
import type { UpdateProjectRequest } from "@/api/client/projects";

interface ClientProjectDetailProps {
  id: string;
}

export const ClientProjectDetail = ({ id }: ClientProjectDetailProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const projectStore = useProjectStore();

  const {
    data: projectData,
    isLoading,
    isError,
    error,
    refetch: refetchProject,
  } = useQuery({
    queryKey: ["client-project", id],
    queryFn: async () => {
      const result = await api.client.projects.getById(id);
      return result.project;
    },
    enabled: !!id,
    staleTime: 0, // Always fetch fresh data
  });

  // Update project mutation
  const { mutate: updateProject, isPending: isUpdatePending } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectRequest }) =>
      api.client.projects.update(id, data),
    onSuccess: () => {
      toast.success("Projet modifié avec succès");
      queryClient.invalidateQueries({ queryKey: ["client-project", id] });
      queryClient.invalidateQueries({ queryKey: ["client-projects"] });
      refetchProject();
      projectStore.reset();
      closeUpdateProjectSheet();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la modification du projet");
    },
  });

  const handleUpdateSubmit = () => {
    const data = projectStore.updateDto;
    if (id) {
      updateProject({
        id,
        data: {
          name: data.name,
          description: data.description || undefined,
          status: data.status as any,
          estimated_budget: data.estimated_budget
            ? parseFloat(
                data.estimated_budget
                  .toString()
                  .replace(/\s/g, "")
                  .replace("€", "")
              )
            : undefined,
          start_date: data.start_date || undefined,
          end_date: data.end_date || undefined,
          address: data.address || undefined,
          progress: data.progress,
          category: data.category || undefined,
          type: data.type || undefined,
        },
      });
    }
  };

  const handleOpenEdit = async () => {
    if (!projectData) return;
    try {
      projectStore.set("response", projectData);
      projectStore.initializeUpdateDto(projectData);
      openUpdateProjectSheet();
    } catch (error: any) {
      console.error("Error preparing project for edit:", error);
      toast.error("Erreur lors du chargement des détails du projet");
    }
  };

  const {
    updateProjectSheet,
    openUpdateProjectSheet,
    closeUpdateProjectSheet,
  } = useClientProjectUpdateSheet({
    updateProject: handleUpdateSubmit,
    isUpdatePending: isUpdatePending,
    resetProject: () => projectStore.reset(),
    project: (projectStore.response ||
      projectData) as ProjectWithDetails | null,
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
          onClick={() => router.push("/client/projects")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux projets
        </Button>
      </div>
    );
  }

  const project = projectData as ProjectWithDetails;

  // Calculate remaining budget
  // Use payments_total for "Payé" (Paid) instead of expenses_total
  const estimatedBudget = project.estimated_budget || 0;
  const paidAmount = project.payments_total || 0;
  const remaining = estimatedBudget - paidAmount;
  const budgetProgress =
    estimatedBudget > 0 ? (paidAmount / estimatedBudget) * 100 : 0;

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={() => router.push("/client/projects")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux projets
        </Button>
        <Button onClick={handleOpenEdit} variant="default">
          <Edit className="h-4 w-4 mr-2" />
          Modifier le projet
        </Button>
      </div>
      <BasicProjectDetails
        project={project}
        spentAmount={paidAmount}
        remaining={remaining}
        budgetProgress={budgetProgress}
      />
      <ClientProjectDetailsTabs projectId={id} />
      {updateProjectSheet}
    </div>
  );
};
