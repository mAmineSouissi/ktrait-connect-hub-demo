import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/date.util";
import { ProjectGalleryItem } from "@/types/gallery.types";
import { Edit, Image, Loader2, Plus, Trash2 } from "lucide-react";
import { useGalleryCreateSheet } from "./modals/GalleryCreateSheet";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { toast } from "sonner";
import { useGalleryUpdateSheet } from "./modals/GalleryUpdateSheet";
import { GalleryDeleteDialog } from "./modals/GalleryDeleteDialog";

interface ProjectGallaryProps {
  projectId: string;
}

export const ProjectGallary = ({ projectId }: ProjectGallaryProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: projectGallery, isLoading: isLoadingGallery } = useQuery({
    queryKey: ["gallery", "project", projectId],
    queryFn: () => api.admin.gallery.list(projectId),
    enabled: !!projectId,
  });

  const [isGalleryDeleteDialogOpen, setIsGalleryDeleteDialogOpen] =
    React.useState(false);
  const [selectedGalleryItem, setSelectedGalleryItem] =
    React.useState<ProjectGalleryItem | null>(null);

  // Create gallery mutation
  const createGalleryMutation = useMutation({
    mutationFn: (data: any) => api.admin.gallery.create(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["gallery", "project", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
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
      api.admin.gallery.update(projectId, galleryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["gallery", "project", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
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
      api.admin.gallery.delete(projectId, galleryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["gallery", "project", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      setIsGalleryDeleteDialogOpen(false);
      setSelectedGalleryItem(null);
      toast.success("Élément de galerie supprimé avec succès");
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Erreur lors de la suppression de l'élément"
      );
    },
  });

  // Gallery handlers
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
    setIsGalleryDeleteDialogOpen(false);
    setSelectedGalleryItem(item);
    openUpdateGallerySheet();
  };

  const openDeleteGalleryItem = (item: ProjectGalleryItem) => {
    setSelectedGalleryItem(item);
    setIsGalleryDeleteDialogOpen(true);
  };

  // Gallery sheets
  const {
    createGallerySheet,
    openCreateGallerySheet,
    closeCreateGallerySheet,
  } = useGalleryCreateSheet({
    createGalleryItem: handleCreateGalleryItem,
    isCreatePending: createGalleryMutation.isPending,
    resetGalleryItem: () => {},
    projectId: projectId,
  });

  const {
    updateGallerySheet,
    openUpdateGallerySheet,
    closeUpdateGallerySheet,
  } = useGalleryUpdateSheet({
    updateGalleryItem: handleUpdateGalleryItem,
    isUpdatePending: updateGalleryMutation.isPending,
    resetGalleryItem: () => setSelectedGalleryItem(null),
    galleryItem: selectedGalleryItem,
    projectId: projectId,
  });
  return (
    <React.Fragment>
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
          ) : (projectGallery?.gallery || []).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun élément dans la galerie
            </div>
          ) : (
            (() => {
              const galleryItems = projectGallery?.gallery || [];

              return (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {galleryItems.map((item: ProjectGalleryItem) => (
                    <div
                      key={item.id}
                      className="aspect-video rounded-lg bg-muted flex flex-col items-center justify-center border-2 border-dashed relative group overflow-hidden"
                    >
                      {item.file_url ? (
                        <>
                          {item.media_type === "photo" ? (
                            <img
                              src={item.file_url}
                              alt={item.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Image className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                          <Button
                            variant="ghost"
                            className="absolute inset-0 w-full h-full bg-black/0 hover:bg-black/50 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 text-white"
                            onClick={() =>
                              router.push(
                                `/admin/projects/${projectId}/gallery/${item.id}`
                              )
                            }
                          >
                            <div className="text-center p-4">
                              <p className="text-sm font-medium">
                                {item.title}
                              </p>
                              {item.date && (
                                <p className="text-xs mt-1">
                                  {formatDate(item.date)}
                                </p>
                              )}
                            </div>
                          </Button>
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8 bg-white/90 hover:bg-white"
                              onClick={() => openEditGalleryItem(item)}
                              title="Modifier"
                            >
                              <Edit className="h-4 w-4 text-foreground" />
                            </Button>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8 bg-white/90 hover:bg-white text-destructive"
                              onClick={() => openDeleteGalleryItem(item)}
                              title="Supprimer"
                              disabled={deleteGalleryMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <Image className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm font-medium">{item.title}</p>
                          {item.date && (
                            <p className="text-xs text-muted-foreground">
                              {formatDate(item.date)}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()
          )}
        </CardContent>
      </Card>
      {/* Gallery Sheets */}
      {createGallerySheet}
      {updateGallerySheet}

      {/* Gallery Delete Dialog */}
      <GalleryDeleteDialog
        galleryItem={selectedGalleryItem}
        onDelete={handleDeleteGalleryItem}
        isDeleting={deleteGalleryMutation.isPending}
        isOpen={isGalleryDeleteDialogOpen}
        onClose={() => {
          setIsGalleryDeleteDialogOpen(false);
          setSelectedGalleryItem(null);
        }}
        projectId={projectId}
      />
    </React.Fragment>
  );
};
