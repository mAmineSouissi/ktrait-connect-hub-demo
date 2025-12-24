"use client";

import React from "react";
import { api } from "@/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/date.util";
import { MapPin, Calendar, Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useClientChantierCreateSheet } from "../modals/ClientChantierCreateSheet";
import { useClientChantierUpdateSheet } from "../modals/ClientChantierUpdateSheet";
import { ClientChantierDeleteDialog } from "../modals/ClientChantierDeleteDialog";
import type { ChantierRow } from "@/types/supabase-database.types";

interface ClientProjectChantiersProps {
  projectId: string;
}

const chantierStatusMap: Record<string, string> = {
  planifié: "Planifié",
  en_cours: "En cours",
  en_attente: "En attente",
  terminé: "Terminé",
  suspendu: "Suspendu",
};

export const ClientProjectChantiers = ({
  projectId,
}: ClientProjectChantiersProps) => {
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedChantier, setSelectedChantier] = React.useState<ChantierRow | null>(null);

  // Fetch chantiers for this project
  const { data: chantiersData, isLoading: isLoadingChantiers } = useQuery({
    queryKey: ["client-chantiers", "project", projectId],
    queryFn: () =>
      api.client.chantiers.list({
        project_id: projectId,
        limit: 100,
      }),
    enabled: !!projectId,
  });

  // Create chantier mutation
  const createChantierMutation = useMutation({
    mutationFn: api.client.chantiers.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["client-chantiers", "project", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["client-project", projectId] });
      closeCreateChantierSheet();
      toast.success("Chantier créé avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la création du chantier");
    },
  });

  // Update chantier mutation
  const updateChantierMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.client.chantiers.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["client-chantiers", "project", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["client-project", projectId] });
      closeUpdateChantierSheet();
      setSelectedChantier(null);
      toast.success("Chantier modifié avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la modification du chantier");
    },
  });

  // Delete chantier mutation
  const deleteChantierMutation = useMutation({
    mutationFn: api.client.chantiers.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["client-chantiers", "project", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["client-project", projectId] });
      setIsDeleteDialogOpen(false);
      setSelectedChantier(null);
      toast.success("Chantier supprimé avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la suppression du chantier");
    },
  });

  const handleCreateChantier = async (data: any) => {
    createChantierMutation.mutate({
      ...data,
      project_id: projectId, // Always use the current project
    });
  };

  const handleUpdateChantier = async (data: any) => {
    if (selectedChantier) {
      updateChantierMutation.mutate({
        id: selectedChantier.id,
        data,
      });
    }
  };

  const handleDeleteChantier = (id: string) => {
    deleteChantierMutation.mutate(id);
  };

  const openEditChantier = (chantier: ChantierRow) => {
    setIsDeleteDialogOpen(false);
    setSelectedChantier(chantier);
    openUpdateChantierSheet();
  };

  const openDeleteChantier = (chantier: ChantierRow) => {
    setSelectedChantier(chantier);
    setIsDeleteDialogOpen(true);
  };

  const {
    createChantierSheet,
    openCreateChantierSheet,
    closeCreateChantierSheet,
  } = useClientChantierCreateSheet({
    createChantier: handleCreateChantier,
    isCreatePending: createChantierMutation.isPending,
    resetChantier: () => {},
    projectId,
  });

  const {
    updateChantierSheet,
    openUpdateChantierSheet,
    closeUpdateChantierSheet,
  } = useClientChantierUpdateSheet({
    updateChantier: handleUpdateChantier,
    isUpdatePending: updateChantierMutation.isPending,
    resetChantier: () => setSelectedChantier(null),
    chantier: selectedChantier,
  });

  const chantiers = chantiersData?.chantiers || [];

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Chantiers</CardTitle>
          <Button onClick={openCreateChantierSheet} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un chantier
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoadingChantiers ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : chantiers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun chantier pour ce projet
            </div>
          ) : (
            <div className="grid gap-4">
              {chantiers.map((chantier: ChantierRow) => (
                <div
                  key={chantier.id}
                  className="border rounded-lg p-4 space-y-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{chantier.name}</h3>
                      {chantier.description && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {chantier.description}
                        </p>
                      )}
                      <div className="grid sm:grid-cols-2 gap-3">
                        {chantier.location && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Localisation:</span>
                            <span className="font-medium">{chantier.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Période:</span>
                          <span className="font-medium">
                            {formatDate(chantier.start_date)} - {formatDate(chantier.end_date)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          chantier.status === "en_cours"
                            ? "default"
                            : chantier.status === "terminé"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {chantierStatusMap[chantier.status] || chantier.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditChantier(chantier)}
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => openDeleteChantier(chantier)}
                          title="Supprimer"
                          disabled={deleteChantierMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avancement</span>
                      <span className="font-medium">{chantier.progress || 0}%</span>
                    </div>
                    <Progress value={chantier.progress || 0} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {createChantierSheet}
      {updateChantierSheet}
      <ClientChantierDeleteDialog
        chantier={selectedChantier}
        onDelete={handleDeleteChantier}
        isDeleting={deleteChantierMutation.isPending}
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedChantier(null);
        }}
      />
    </>
  );
};
