"use client";

import React from "react";
import { api } from "@/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { ProjectGalleryItem } from "@/types/gallery.types";
import { formatDate } from "@/lib/date.util";
import { useClientGalleryCreateSheet } from "../modals/ClientGalleryCreateSheet";
import { useClientGalleryUpdateSheet } from "../modals/ClientGalleryUpdateSheet";
import { ClientGalleryDeleteDialog } from "../modals/ClientGalleryDeleteDialog";

interface ClientProjectGalleryProps {
  projectId: string;
}

export const ClientProjectGallery = ({
  projectId,
}: ClientProjectGalleryProps) => {
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedGalleryItem, setSelectedGalleryItem] = React.useState<ProjectGalleryItem | null>(null);

  // Fetch gallery for this project
  const { data: projectGallery, isLoading: isLoadingGallery } = useQuery({
    queryKey: ["client-gallery", "project", projectId],
    queryFn: () => api.client.gallery.list(projectId),
    enabled: !!projectId,
  });

  // Create gallery mutation
  const createGalleryMutation = useMutation({
    mutationFn: (data: any) => api.client.gallery.create(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["client-gallery", "project", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["client-project", projectId] });
      closeCreateGallerySheet();
      toast.success("Élément de galerie créé avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la création de l'élément");
    },
  });

  // Update gallery mutation
  const updateGalleryMutation = useMutation({
    mutationFn: ({ galleryId, data }: { galleryId: string; data: any }) =>
      api.client.gallery.update(projectId, galleryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["client-gallery", "project", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["client-project", projectId] });
      closeUpdateGallerySheet();
      setSelectedGalleryItem(null);
      toast.success("Élément de galerie modifié avec succès");
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Erreur lors de la modification de l'élément"
      );
    },
  });

  // Delete gallery mutation
  const deleteGalleryMutation = useMutation({
    mutationFn: (galleryId: string) =>
      api.client.gallery.delete(projectId, galleryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["client-gallery", "project", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["client-project", projectId] });
      setIsDeleteDialogOpen(false);
      setSelectedGalleryItem(null);
      toast.success("Élément de galerie supprimé avec succès");
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Erreur lors de la suppression de l'élément"
      );
    },
  });

  const handleCreateGalleryItem = async (data: any) => {
    createGalleryMutation.mutate(data);
  };

  const handleUpdateGalleryItem = async ({
    galleryId,
    data,
  }: {
    galleryId: string;
    data: any;
  }) => {
    updateGalleryMutation.mutate({ galleryId, data });
  };

  const handleDeleteGalleryItem = (galleryId: string) => {
    deleteGalleryMutation.mutate(galleryId);
  };

  const openEditGalleryItem = (item: ProjectGalleryItem) => {
    setIsDeleteDialogOpen(false);
    setSelectedGalleryItem(item);
    openUpdateGallerySheet();
  };

  const openDeleteGalleryItem = (item: ProjectGalleryItem) => {
    setSelectedGalleryItem(item);
    setIsDeleteDialogOpen(true);
  };

  const {
    createGallerySheet,
    openCreateGallerySheet,
    closeCreateGallerySheet,
  } = useClientGalleryCreateSheet({
    createGalleryItem: handleCreateGalleryItem,
    isCreatePending: createGalleryMutation.isPending,
    resetGalleryItem: () => {},
    projectId: projectId,
  });

  const {
    updateGallerySheet,
    openUpdateGallerySheet,
    closeUpdateGallerySheet,
  } = useClientGalleryUpdateSheet({
    updateGalleryItem: handleUpdateGalleryItem,
    isUpdatePending: updateGalleryMutation.isPending,
    resetGalleryItem: () => setSelectedGalleryItem(null),
    galleryItem: selectedGalleryItem,
    projectId: projectId,
  });

  const galleryItems = projectGallery?.gallery || [];

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Galerie</CardTitle>
          <Button onClick={openCreateGallerySheet} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un élément
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoadingGallery ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : galleryItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun élément dans la galerie
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryItems.map((item: ProjectGalleryItem) => (
                <div
                  key={item.id}
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {item.thumbnail_url || item.file_url ? (
                    <div className="aspect-video bg-muted relative">
                      <img
                        src={item.thumbnail_url || item.file_url || ""}
                        alt={item.title || "Galerie"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">Pas d'image</span>
                    </div>
                  )}
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.title || "Sans titre"}</h4>
                        {item.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.media_type === "photo" ? "Photo" : "Vidéo"}
                      </Badge>
                    </div>
                    {item.date && (
                      <p className="text-xs text-muted-foreground">
                        {formatDate(item.date)}
                      </p>
                    )}
                    <div className="flex gap-2">
                      {item.file_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => window.open(item.file_url, "_blank")}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Voir
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditGalleryItem(item)}
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => openDeleteGalleryItem(item)}
                        title="Supprimer"
                        disabled={deleteGalleryMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {createGallerySheet}
      {updateGallerySheet}
      <ClientGalleryDeleteDialog
        galleryItem={selectedGalleryItem}
        onDelete={handleDeleteGalleryItem}
        isDeleting={deleteGalleryMutation.isPending}
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedGalleryItem(null);
        }}
        projectId={projectId}
      />
    </>
  );
};
