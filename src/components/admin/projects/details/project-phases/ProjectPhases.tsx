import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Edit, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ProjectPhase } from "@/types";
import { api } from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { usePhaseCreateSheet } from "./modals/PhaseCreateSheet";
import { usePhaseUpdateSheet } from "./modals/PhaseUpdateSheet";
import { PhaseDeleteDialog } from "./modals/PhaseDeleteDialog";

interface ProjectPhasesProps {
  projectId: string;
}

const phaseStatusMap: Record<string, string> = {
  à_venir: "À venir",
  en_cours: "En cours",
  terminé: "Terminé",
  bloqué: "Bloqué",
};

export const ProjectPhases = ({ projectId }: ProjectPhasesProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  // State for phases
  const [isPhaseDeleteDialogOpen, setIsPhaseDeleteDialogOpen] =
    React.useState(false);
  const [selectedPhase, setSelectedPhase] = React.useState<ProjectPhase | null>(
    null
  );

  // Fetch phases for this project (must be before conditional returns)
  const { data: projectPhases, isLoading: isLoadingPhases } = useQuery({
    queryKey: ["phases", "project", projectId],
    queryFn: () => api.admin.phases.list(projectId),
    enabled: !!projectId,
  });
  // Create phase mutation
  const createPhaseMutation = useMutation({
    mutationFn: (data: any) => api.admin.phases.create(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["phases", "project", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      closeCreatePhaseSheet();
      toast.success("Phase créée avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la création de la phase");
    },
  });

  // Update phase mutation
  const updatePhaseMutation = useMutation({
    mutationFn: ({ phaseId, data }: { phaseId: string; data: any }) =>
      api.admin.phases.update(projectId, phaseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["phases", "project", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      closeUpdatePhaseSheet();
      setSelectedPhase(null);
      toast.success("Phase modifiée avec succès");
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Erreur lors de la modification de la phase"
      );
    },
  });

  // Delete phase mutation
  const deletePhaseMutation = useMutation({
    mutationFn: (phaseId: string) =>
      api.admin.phases.delete(projectId, phaseId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["phases", "project", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      setIsPhaseDeleteDialogOpen(false);
      setSelectedPhase(null);
      toast.success("Phase supprimée avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la suppression de la phase");
    },
  });

  // Phase handlers
  const handleCreatePhase = async (data: any) => {
    createPhaseMutation.mutate(data);
  };

  const handleUpdatePhase = async ({
    phaseId,
    data,
  }: {
    phaseId: string;
    data: any;
  }) => {
    updatePhaseMutation.mutate({ phaseId, data });
  };

  const handleDeletePhase = (projectId: string, phaseId: string) => {
    deletePhaseMutation.mutate(phaseId);
  };

  const openEditPhase = (phase: ProjectPhase) => {
    setIsPhaseDeleteDialogOpen(false);
    setSelectedPhase(phase);
    openUpdatePhaseSheet();
  };

  const openDeletePhase = (phase: ProjectPhase) => {
    setSelectedPhase(phase);
    setIsPhaseDeleteDialogOpen(true);
  };

  // Phase sheets
  const { createPhaseSheet, openCreatePhaseSheet, closeCreatePhaseSheet } =
    usePhaseCreateSheet({
      createPhase: handleCreatePhase,
      isCreatePending: createPhaseMutation.isPending,
      resetPhase: () => {},
      projectId,
    });

  const { updatePhaseSheet, openUpdatePhaseSheet, closeUpdatePhaseSheet } =
    usePhaseUpdateSheet({
      updatePhase: handleUpdatePhase,
      isUpdatePending: updatePhaseMutation.isPending,
      resetPhase: () => setSelectedPhase(null),
      phase: selectedPhase,
      projectId,
    });
  const phases = projectPhases?.phases || [];

  return (
    <React.Fragment>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Phases</CardTitle>
          <Button onClick={openCreatePhaseSheet} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une phase
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoadingPhases ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : phases?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune phase définie
            </div>
          ) : (
            <div className="space-y-4">
              {phases?.map((phase: ProjectPhase) => (
                <div
                  key={phase.id}
                  className="flex items-center gap-4 p-4 rounded-lg border"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <Button
                        variant="link"
                        className="h-auto p-0 font-medium"
                        onClick={() =>
                          router.push(
                            `/admin/projects/${projectId}/phases/${phase.id}`
                          )
                        }
                      >
                        {phase.name}
                      </Button>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            phase.status === "terminé"
                              ? "secondary"
                              : phase.status === "en_cours"
                              ? "default"
                              : "outline"
                          }
                        >
                          {phaseStatusMap[phase.status] || phase.status}
                        </Badge>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditPhase(phase)}
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => openDeletePhase(phase)}
                            title="Supprimer"
                            disabled={deletePhaseMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Progress
                      value={phase.progress_percentage}
                      className="h-2"
                    />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">
                    {phase.progress_percentage}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {createPhaseSheet}
      {updatePhaseSheet}

      {/* Phase Delete Dialog */}
      <PhaseDeleteDialog
        phase={selectedPhase}
        onDelete={handleDeletePhase}
        isDeleting={deletePhaseMutation.isPending}
        isOpen={isPhaseDeleteDialogOpen}
        onClose={() => {
          setIsPhaseDeleteDialogOpen(false);
          setSelectedPhase(null);
        }}
        projectId={projectId}
      />
    </React.Fragment>
  );
};
