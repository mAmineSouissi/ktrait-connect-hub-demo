"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { admin } from "@/api/admin";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Image,
  MessageSquare,
  Loader2,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTeamMemberCreateSheet } from "./details/team/modals/TeamMemberCreateSheet";
import { useTeamMemberUpdateSheet } from "./details/team/modals/TeamMemberUpdateSheet";
import { useTeamMemberDeleteDialog } from "./details/team/modals/TeamMemberDeleteDialog";
import { usePlanningTaskCreateSheet } from "./details/planning/modals/PlanningTaskCreateSheet";
import { usePlanningTaskUpdateSheet } from "./details/planning/modals/PlanningTaskUpdateSheet";
import { usePlanningTaskDeleteDialog } from "./details/planning/modals/PlanningTaskDeleteDialog";
import { useGalleryItemCreateSheet } from "./details/gallery/modals/GalleryItemCreateSheet";
import { useGalleryItemUpdateSheet } from "./details/gallery/modals/GalleryItemUpdateSheet";
import { useGalleryItemDeleteDialog } from "./details/gallery/modals/GalleryItemDeleteDialog";
import { useNoteCreateSheet } from "./details/notes/modals/NoteCreateSheet";
import { useNoteUpdateSheet } from "./details/notes/modals/NoteUpdateSheet";
import { useNoteDeleteDialog } from "./details/notes/modals/NoteDeleteDialog";
import type { ChantierTeamRow } from "@/types/supabase-database.types";
import type { ChantierPlanningRow } from "@/types/supabase-database.types";
import type { ChantierGalleryRow } from "@/types/supabase-database.types";
import type { ChantierNoteRow } from "@/types/supabase-database.types";

interface AdminChantierDetailProps {
  id: string;
}

const statusMap: Record<string, string> = {
  planifié: "Planifié",
  en_cours: "En cours",
  en_attente: "En attente",
  terminé: "Terminé",
  suspendu: "Suspendu",
};

const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("fr-FR");
};

export const AdminChantierDetail = ({ id }: AdminChantierDetailProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // State for selected items
  const [selectedTeamMember, setSelectedTeamMember] =
    useState<ChantierTeamRow | null>(null);
  const [selectedTask, setSelectedTask] = useState<ChantierPlanningRow | null>(
    null
  );
  const [selectedGalleryItem, setSelectedGalleryItem] =
    useState<ChantierGalleryRow | null>(null);
  const [selectedNote, setSelectedNote] = useState<ChantierNoteRow | null>(
    null
  );

  const {
    data: chantierData,
    isLoading,
    isError,
    error,
    refetch: refetchChantier,
  } = useQuery({
    queryKey: ["chantier", id],
    queryFn: async () => {
      const result = await admin.chantiers.getChantier(id);
      return result.chantier;
    },
    enabled: !!id,
  });

  // Team Member Mutations
  const { mutate: createTeamMember, isPending: isCreateTeamPending } =
    useMutation({
      mutationFn: (data: any) => admin.chantiers.createTeamMember(id, data),
      onSuccess: () => {
        toast.success("Membre d'équipe ajouté avec succès");
        refetchChantier();
        closeCreateTeamMemberSheet();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Erreur lors de l'ajout du membre");
      },
    });

  const { mutate: updateTeamMember, isPending: isUpdateTeamPending } =
    useMutation({
      mutationFn: ({ teamId, data }: { teamId: string; data: any }) =>
        admin.chantiers.updateTeamMember(id, teamId, data),
      onSuccess: () => {
        toast.success("Membre d'équipe mis à jour avec succès");
        refetchChantier();
        closeUpdateTeamMemberSheet();
        setSelectedTeamMember(null);
      },
      onError: (error: Error) => {
        toast.error(error.message || "Erreur lors de la mise à jour");
      },
    });

  const { mutate: deleteTeamMember, isPending: isDeleteTeamPending } =
    useMutation({
      mutationFn: (teamId: string) =>
        admin.chantiers.deleteTeamMember(id, teamId),
      onSuccess: () => {
        toast.success("Membre d'équipe supprimé avec succès");
        refetchChantier();
        closeDeleteTeamMemberDialog();
        setSelectedTeamMember(null);
      },
      onError: (error: Error) => {
        toast.error(error.message || "Erreur lors de la suppression");
      },
    });

  // Planning Task Mutations
  const { mutate: createPlanningTask, isPending: isCreateTaskPending } =
    useMutation({
      mutationFn: (data: any) => admin.chantiers.createPlanningTask(id, data),
      onSuccess: () => {
        toast.success("Tâche ajoutée avec succès");
        refetchChantier();
        closeCreatePlanningTaskSheet();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Erreur lors de l'ajout de la tâche");
      },
    });

  const { mutate: updatePlanningTask, isPending: isUpdateTaskPending } =
    useMutation({
      mutationFn: ({ taskId, data }: { taskId: string; data: any }) =>
        admin.chantiers.updatePlanningTask(id, taskId, data),
      onSuccess: () => {
        toast.success("Tâche mise à jour avec succès");
        refetchChantier();
        closeUpdatePlanningTaskSheet();
        setSelectedTask(null);
      },
      onError: (error: Error) => {
        toast.error(error.message || "Erreur lors de la mise à jour");
      },
    });

  const { mutate: deletePlanningTask, isPending: isDeleteTaskPending } =
    useMutation({
      mutationFn: (taskId: string) =>
        admin.chantiers.deletePlanningTask(id, taskId),
      onSuccess: () => {
        toast.success("Tâche supprimée avec succès");
        refetchChantier();
        closeDeleteTaskDialog();
        setSelectedTask(null);
      },
      onError: (error: Error) => {
        toast.error(error.message || "Erreur lors de la suppression");
      },
    });

  // Gallery Item Mutations
  const { mutate: createGalleryItem, isPending: isCreateGalleryPending } =
    useMutation({
      mutationFn: (data: any) => admin.chantiers.createGalleryItem(id, data),
      onSuccess: () => {
        toast.success("Élément de galerie ajouté avec succès");
        refetchChantier();
        closeCreateGalleryItemSheet();
      },
      onError: (error: Error) => {
        toast.error(error.message || "Erreur lors de l'ajout de l'élément");
      },
    });

  const { mutate: updateGalleryItem, isPending: isUpdateGalleryPending } =
    useMutation({
      mutationFn: ({ galleryId, data }: { galleryId: string; data: any }) =>
        admin.chantiers.updateGalleryItem(id, galleryId, data),
      onSuccess: () => {
        toast.success("Élément de galerie mis à jour avec succès");
        refetchChantier();
        closeUpdateGalleryItemSheet();
        setSelectedGalleryItem(null);
      },
      onError: (error: Error) => {
        toast.error(error.message || "Erreur lors de la mise à jour");
      },
    });

  const { mutate: deleteGalleryItem, isPending: isDeleteGalleryPending } =
    useMutation({
      mutationFn: (galleryId: string) =>
        admin.chantiers.deleteGalleryItem(id, galleryId),
      onSuccess: () => {
        toast.success("Élément de galerie supprimé avec succès");
        refetchChantier();
        closeDeleteGalleryItemDialog();
        setSelectedGalleryItem(null);
      },
      onError: (error: Error) => {
        toast.error(error.message || "Erreur lors de la suppression");
      },
    });

  // Note Mutations
  const { mutate: createNote, isPending: isCreateNotePending } = useMutation({
    mutationFn: (data: any) => admin.chantiers.createNote(id, data),
    onSuccess: () => {
      toast.success("Note ajoutée avec succès");
      refetchChantier();
      closeCreateNoteSheet();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de l'ajout de la note");
    },
  });

  const { mutate: updateNote, isPending: isUpdateNotePending } = useMutation({
    mutationFn: ({ noteId, data }: { noteId: string; data: any }) =>
      admin.chantiers.updateNote(id, noteId, data),
    onSuccess: () => {
      toast.success("Note mise à jour avec succès");
      refetchChantier();
      closeUpdateNoteSheet();
      setSelectedNote(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la mise à jour");
    },
  });

  const { mutate: deleteNote, isPending: isDeleteNotePending } = useMutation({
    mutationFn: (noteId: string) => admin.chantiers.deleteNote(id, noteId),
    onSuccess: () => {
      toast.success("Note supprimée avec succès");
      refetchChantier();
      closeDeleteNoteDialog();
      setSelectedNote(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la suppression");
    },
  });

  // Team Member Sheets
  const {
    createTeamMemberSheet,
    openCreateTeamMemberSheet,
    closeCreateTeamMemberSheet,
  } = useTeamMemberCreateSheet({
    createTeamMember: (data) => createTeamMember(data),
    isCreatePending: isCreateTeamPending,
    chantierId: id,
  });

  const {
    updateTeamMemberSheet,
    openUpdateTeamMemberSheet,
    closeUpdateTeamMemberSheet,
  } = useTeamMemberUpdateSheet({
    updateTeamMember: (data) => {
      if (selectedTeamMember) {
        updateTeamMember({ teamId: selectedTeamMember.id, data });
      }
    },
    isUpdatePending: isUpdateTeamPending,
    teamMember: selectedTeamMember,
  });

  const {
    deleteTeamMemberDialog,
    openDeleteTeamMemberDialog,
    closeDeleteTeamMemberDialog,
  } = useTeamMemberDeleteDialog({
    teamMemberName: selectedTeamMember?.name || "",
    deleteTeamMember: () => {
      if (selectedTeamMember) {
        deleteTeamMember(selectedTeamMember.id);
      }
    },
    isDeleting: isDeleteTeamPending,
  });

  // Planning Task Sheets
  const {
    createPlanningTaskSheet,
    openCreatePlanningTaskSheet,
    closeCreatePlanningTaskSheet,
  } = usePlanningTaskCreateSheet({
    createPlanningTask: (data) => createPlanningTask(data),
    isCreatePending: isCreateTaskPending,
    chantierId: id,
  });

  const {
    updatePlanningTaskSheet,
    openUpdatePlanningTaskSheet,
    closeUpdatePlanningTaskSheet,
  } = usePlanningTaskUpdateSheet({
    updatePlanningTask: (data) => {
      if (selectedTask) {
        updatePlanningTask({ taskId: selectedTask.id, data });
      }
    },
    isUpdatePending: isUpdateTaskPending,
    task: selectedTask,
  });

  const { deleteTaskDialog, openDeleteTaskDialog, closeDeleteTaskDialog } =
    usePlanningTaskDeleteDialog({
      taskName: selectedTask?.task_name || "",
      deleteTask: () => {
        if (selectedTask) {
          deletePlanningTask(selectedTask.id);
        }
      },
      isDeleting: isDeleteTaskPending,
    });

  // Gallery Item Sheets
  const {
    createGalleryItemSheet,
    openCreateGalleryItemSheet,
    closeCreateGalleryItemSheet,
  } = useGalleryItemCreateSheet({
    createGalleryItem: (data) => createGalleryItem(data),
    isCreatePending: isCreateGalleryPending,
    chantierId: id,
  });

  const {
    updateGalleryItemSheet,
    openUpdateGalleryItemSheet,
    closeUpdateGalleryItemSheet,
  } = useGalleryItemUpdateSheet({
    updateGalleryItem: (data) => {
      if (selectedGalleryItem) {
        updateGalleryItem({ galleryId: selectedGalleryItem.id, data });
      }
    },
    isUpdatePending: isUpdateGalleryPending,
    galleryItem: selectedGalleryItem,
  });

  const {
    deleteItemDialog: deleteGalleryItemDialog,
    openDeleteItemDialog: openDeleteGalleryItemDialog,
    closeDeleteItemDialog: closeDeleteGalleryItemDialog,
  } = useGalleryItemDeleteDialog({
    itemTitle: selectedGalleryItem?.title || "",
    deleteItem: () => {
      if (selectedGalleryItem) {
        deleteGalleryItem(selectedGalleryItem.id);
      }
    },
    isDeleting: isDeleteGalleryPending,
  });

  // Note Sheets
  const { createNoteSheet, openCreateNoteSheet, closeCreateNoteSheet } =
    useNoteCreateSheet({
      createNote: (data) => createNote(data),
      isCreatePending: isCreateNotePending,
      chantierId: id,
    });

  const { updateNoteSheet, openUpdateNoteSheet, closeUpdateNoteSheet } =
    useNoteUpdateSheet({
      updateNote: (data) => {
        if (selectedNote) {
          updateNote({ noteId: selectedNote.id, data });
        }
      },
      isUpdatePending: isUpdateNotePending,
      note: selectedNote,
    });

  const { deleteNoteDialog, openDeleteNoteDialog, closeDeleteNoteDialog } =
    useNoteDeleteDialog({
      noteAuthor: selectedNote?.author || "",
      deleteNote: () => {
        if (selectedNote) {
          deleteNote(selectedNote.id);
        }
      },
      isDeleting: isDeleteNotePending,
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError || !chantierData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-destructive">
            {error instanceof Error
              ? error.message
              : "Erreur lors du chargement du chantier"}
          </p>
          <Button
            variant="outline"
            onClick={() => router.push("/admin/chantiers")}
            className="mt-4"
          >
            Retour aux chantiers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-background">
      <main className="flex-1 flex flex-col">
        <div className="flex-1 p-6 space-y-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/chantiers")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux chantiers
          </Button>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">
                      {chantierData.name}
                    </CardTitle>
                    <p className="text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4" /> {chantierData.location}
                    </p>
                    {chantierData.project && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Projet: {chantierData.project.name}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={
                      chantierData.status === "en_cours"
                        ? "default"
                        : chantierData.status === "terminé"
                        ? "secondary"
                        : chantierData.status === "suspendu"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {statusMap[chantierData.status] || chantierData.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Période</p>
                      <p className="font-medium">
                        {formatDate(chantierData.start_date)} -{" "}
                        {formatDate(chantierData.end_date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Équipe</p>
                      <p className="font-medium">
                        {chantierData.team.length} personne
                        {chantierData.team.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Avancement global</span>
                    <span className="font-medium">
                      {chantierData.progress}%
                    </span>
                  </div>
                  <Progress value={chantierData.progress} className="h-3" />
                </div>
                {chantierData.description && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Description
                    </p>
                    <p className="text-sm">{chantierData.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Équipe sur site</CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={openCreateTeamMemberSheet}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {chantierData.team.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Aucun membre d'équipe
                  </p>
                ) : (
                  chantierData.team.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/50 group"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.role}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {member.phone && (
                          <Badge variant="outline" className="text-xs">
                            {member.phone}
                          </Badge>
                        )}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedTeamMember(member);
                              openUpdateTeamMemberSheet();
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedTeamMember(member);
                              openDeleteTeamMemberDialog();
                            }}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="planning" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="planning">Planning</TabsTrigger>
              <TabsTrigger value="gallery">Galerie</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="planning">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Planning des tâches</CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={openCreatePlanningTaskSheet}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter une tâche
                  </Button>
                </CardHeader>
                <CardContent className="pt-6">
                  {chantierData.planning.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Aucune tâche planifiée
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {chantierData.planning.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-4 p-4 rounded-lg border group"
                        >
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">
                                {task.task_name}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                  {formatDate(task.start_date)} -{" "}
                                  {formatDate(task.end_date)}
                                </span>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      setSelectedTask(task);
                                      openUpdatePlanningTaskSheet();
                                    }}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      setSelectedTask(task);
                                      openDeleteTaskDialog();
                                    }}
                                  >
                                    <Trash2 className="h-3 w-3 text-destructive" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                            {task.description && (
                              <p className="text-xs text-muted-foreground mb-2">
                                {task.description}
                              </p>
                            )}
                            <Progress value={task.progress} className="h-2" />
                          </div>
                          <span className="text-sm font-medium w-12 text-right">
                            {task.progress}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gallery">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Photos & Vidéos</CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={openCreateGalleryItemSheet}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter
                  </Button>
                </CardHeader>
                <CardContent>
                  {chantierData.gallery.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Aucune photo ou vidéo
                    </p>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {chantierData.gallery.map((item) => (
                        <div
                          key={item.id}
                          className="aspect-video rounded-lg bg-muted flex flex-col items-center justify-center border overflow-hidden relative group"
                        >
                          {item.media_type === "photo" ? (
                            <img
                              src={item.file_url}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <>
                              <Image className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-sm font-medium">
                                {item.title}
                              </p>
                            </>
                          )}
                          {item.date && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(item.date)}
                            </p>
                          )}
                          <Badge variant="outline" className="mt-2 text-xs">
                            {item.media_type}
                          </Badge>
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => {
                                setSelectedGalleryItem(item);
                                openUpdateGalleryItemSheet();
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setSelectedGalleryItem(item);
                                openDeleteGalleryItemDialog();
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Notes de chantier</CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={openCreateNoteSheet}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter une note
                  </Button>
                </CardHeader>
                <CardContent>
                  {chantierData.notes.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Aucune note
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {chantierData.notes.map((note) => (
                        <div
                          key={note.id}
                          className="p-4 rounded-lg border group"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{note.author}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {formatDate(note.date)}
                              </span>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedNote(note);
                                    openUpdateNoteSheet();
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedNote(note);
                                    openDeleteNoteDialog();
                                  }}
                                >
                                  <Trash2 className="h-3 w-3 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm">{note.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* All Sheets and Dialogs */}
      {createTeamMemberSheet}
      {updateTeamMemberSheet}
      {deleteTeamMemberDialog}
      {createPlanningTaskSheet}
      {updatePlanningTaskSheet}
      {deleteTaskDialog}
      {createGalleryItemSheet}
      {updateGalleryItemSheet}
      {deleteGalleryItemDialog}
      {createNoteSheet}
      {updateNoteSheet}
      {deleteNoteDialog}
    </div>
  );
};
