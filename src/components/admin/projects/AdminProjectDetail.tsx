"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  HardHat,
  Image,
  Loader2,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import type { ProjectWithDetails, ProjectPhase } from "@/types/project.types";
import type { DocumentWithDetails } from "@/types/document.types";
import type { ExpenseWithDetails } from "@/types/expense.types";
import type { ProjectGalleryItem } from "@/types/gallery.types";
import { useExpenseCreateSheet } from "./details/project-expenses/modals/ExpenseCreateSheet";
import { useExpenseUpdateSheet } from "./details/project-expenses/modals/ExpenseUpdateSheet";
import { ExpenseDeleteDialog } from "./details/project-expenses/modals/ExpenseDeleteDialog";
import { useGalleryCreateSheet } from "./details/project-gallery/modals/GalleryCreateSheet";
import { useGalleryUpdateSheet } from "./details/project-gallery/modals/GalleryUpdateSheet";
import { GalleryDeleteDialog } from "./details/project-gallery/modals/GalleryDeleteDialog";
import { formatDate } from "@/lib/date.util";
import { formatAmount, formatBudget } from "@/lib/currency.util";
import { usePhaseCreateSheet } from "./details/project-phases/modals/PhaseCreateSheet";
import { usePhaseUpdateSheet } from "./details/project-phases/modals/PhaseUpdateSheet";
import { PhaseDeleteDialog } from "./details/project-phases/modals/PhaseDeleteDialog";
import {
  PROJECT_CATEGORY_LABELS,
  type ProjectCategoryType,
} from "@/types/enums/project-category.enum";
import {
  PROJECT_TYPE_LABELS,
  type ProjectTypeType,
} from "@/types/enums/project-type.enum";

interface AdminProjectDetailProps {
  id: string;
}

const statusMap: Record<string, string> = {
  planifié: "Planifié",
  en_cours: "En cours",
  en_attente: "En attente",
  terminé: "Terminé",
  annulé: "Annulé",
};

const phaseStatusMap: Record<string, string> = {
  à_venir: "À venir",
  en_cours: "En cours",
  terminé: "Terminé",
  bloqué: "Bloqué",
};

const documentStatusMap: Record<string, string> = {
  en_attente: "En attente",
  validé: "Validé",
  rejeté: "Rejeté",
};

export const AdminProjectDetail = ({ id }: AdminProjectDetailProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // ALL hooks must be called at the top level, before any conditional returns
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

  // Fetch documents for this project
  const { data: projectDocuments, isLoading: isLoadingDocs } = useQuery({
    queryKey: ["documents", "project", id],
    queryFn: () =>
      api.admin.documents.list({
        project_id: id,
        limit: 100,
      }),
    enabled: !!id && !!projectData,
  });

  // Fetch expenses for this project (must be before conditional returns)
  const { data: projectExpenses, isLoading: isLoadingExpenses } = useQuery({
    queryKey: ["expenses", "project", id],
    queryFn: () =>
      api.admin.expenses.list({
        project_id: id,
        limit: 100,
      }),
    enabled: !!id && !!projectData,
  });

  // Fetch gallery for this project (must be before conditional returns)
  const { data: projectGallery, isLoading: isLoadingGallery } = useQuery({
    queryKey: ["gallery", "project", id],
    queryFn: () => api.admin.gallery.list(id),
    enabled: !!id && !!projectData,
  });

  // Fetch phases for this project (must be before conditional returns)
  const { data: projectPhases, isLoading: isLoadingPhases } = useQuery({
    queryKey: ["phases", "project", id],
    queryFn: () => api.admin.phases.list(id),
    enabled: !!id && !!projectData,
  });

  // Fetch clients for payments dropdown
  const { data: clientsData } = useQuery({
    queryKey: ["clients"],
    queryFn: () => api.admin.users.list({ role: "client", limit: 100 }),
  });

  const clients = clientsData?.users || [];

  // State for expenses
  const [isExpenseDeleteDialogOpen, setIsExpenseDeleteDialogOpen] =
    useState(false);
  const [selectedExpense, setSelectedExpense] =
    useState<ExpenseWithDetails | null>(null);

  // Create expense mutation
  const createExpenseMutation = useMutation({
    mutationFn: api.admin.expenses.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses", "project", id] });
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      closeCreateExpenseSheet();
      toast.success("Dépense créée avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la création de la dépense");
    },
  });

  // Update expense mutation
  const updateExpenseMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.admin.expenses.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses", "project", id] });
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      closeUpdateExpenseSheet();
      setSelectedExpense(null);
      toast.success("Dépense modifiée avec succès");
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Erreur lors de la modification de la dépense"
      );
    },
  });

  // Delete expense mutation
  const deleteExpenseMutation = useMutation({
    mutationFn: api.admin.expenses.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses", "project", id] });
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      setIsExpenseDeleteDialogOpen(false);
      setSelectedExpense(null);
      toast.success("Dépense supprimée avec succès");
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Erreur lors de la suppression de la dépense"
      );
    },
  });

  // Expense handlers
  const handleCreateExpense = async (data: any) => {
    createExpenseMutation.mutate({
      ...data,
      amount: parseFloat(data.amount.toString()),
    });
  };

  const handleUpdateExpense = async ({
    id,
    data,
  }: {
    id: string;
    data: any;
  }) => {
    updateExpenseMutation.mutate({
      id,
      data: {
        ...data,
        amount: data.amount ? parseFloat(data.amount.toString()) : undefined,
      },
    });
  };

  const handleDeleteExpense = (expenseId: string) => {
    deleteExpenseMutation.mutate(expenseId);
  };

  const openEditExpense = (expense: ExpenseWithDetails) => {
    setIsExpenseDeleteDialogOpen(false);
    setSelectedExpense(expense);
    openUpdateExpenseSheet();
  };

  const openDeleteExpense = (expense: ExpenseWithDetails) => {
    setSelectedExpense(expense);
    setIsExpenseDeleteDialogOpen(true);
  };

  // Expense sheets
  const {
    createExpenseSheet,
    openCreateExpenseSheet,
    closeCreateExpenseSheet,
  } = useExpenseCreateSheet({
    createExpense: handleCreateExpense,
    isCreatePending: createExpenseMutation.isPending,
    resetExpense: () => {},
    projects: projectData ? [projectData] : [],
    defaultProjectId: id,
  });

  const {
    updateExpenseSheet,
    openUpdateExpenseSheet,
    closeUpdateExpenseSheet,
  } = useExpenseUpdateSheet({
    updateExpense: handleUpdateExpense,
    isUpdatePending: updateExpenseMutation.isPending,
    resetExpense: () => setSelectedExpense(null),
    expense: selectedExpense,
    projects: projectData ? [projectData] : [],
  });

  // State for phases
  const [isPhaseDeleteDialogOpen, setIsPhaseDeleteDialogOpen] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<ProjectPhase | null>(null);

  // Create phase mutation
  const createPhaseMutation = useMutation({
    mutationFn: (data: any) => api.admin.phases.create(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["phases", "project", id] });
      queryClient.invalidateQueries({ queryKey: ["project", id] });
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
      api.admin.phases.update(id, phaseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["phases", "project", id] });
      queryClient.invalidateQueries({ queryKey: ["project", id] });
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
    mutationFn: (phaseId: string) => api.admin.phases.delete(id, phaseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["phases", "project", id] });
      queryClient.invalidateQueries({ queryKey: ["project", id] });
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

  const handleDeletePhase = (phaseId: string) => {
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
      projectId: id,
    });

  const { updatePhaseSheet, openUpdatePhaseSheet, closeUpdatePhaseSheet } =
    usePhaseUpdateSheet({
      updatePhase: handleUpdatePhase,
      isUpdatePending: updatePhaseMutation.isPending,
      resetPhase: () => setSelectedPhase(null),
      phase: selectedPhase,
      projectId: id,
    });

  // State for gallery
  const [isGalleryDeleteDialogOpen, setIsGalleryDeleteDialogOpen] =
    useState(false);
  const [selectedGalleryItem, setSelectedGalleryItem] =
    useState<ProjectGalleryItem | null>(null);

  // Create gallery mutation
  const createGalleryMutation = useMutation({
    mutationFn: (data: any) => api.admin.gallery.create(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery", "project", id] });
      queryClient.invalidateQueries({ queryKey: ["project", id] });
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
      api.admin.gallery.update(id, galleryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery", "project", id] });
      queryClient.invalidateQueries({ queryKey: ["project", id] });
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
    mutationFn: (galleryId: string) => api.admin.gallery.delete(id, galleryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery", "project", id] });
      queryClient.invalidateQueries({ queryKey: ["project", id] });
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
    projectId: id,
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
    projectId: id,
  });

  // Now we can have conditional returns
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
  const client = (project as any).client || null;
  const phases = projectPhases?.phases || project.phases || [];
  const partners = project.partners || [];

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

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-2xl">{project.name}</CardTitle>
                {(project as any).category && (
                  <Badge variant="outline" className="text-xs">
                    {
                      PROJECT_CATEGORY_LABELS[
                        (project as any).category as ProjectCategoryType
                      ]
                    }
                  </Badge>
                )}
                {(project as any).type && (
                  <Badge variant="outline" className="text-xs">
                    {
                      PROJECT_TYPE_LABELS[
                        (project as any).type as ProjectTypeType
                      ]
                    }
                  </Badge>
                )}
              </div>
              {project.description && (
                <p className="text-muted-foreground mt-1">
                  {project.description}
                </p>
              )}
            </div>
            <Badge
              variant={
                project.status === "en_cours"
                  ? "default"
                  : project.status === "terminé"
                  ? "secondary"
                  : "outline"
              }
              className="text-sm"
            >
              {statusMap[project.status] || project.status}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-medium">{client?.full_name || "N/A"}</p>
                  {client?.email && (
                    <p className="text-xs text-muted-foreground">
                      {client.email}
                    </p>
                  )}
                </div>
              </div>
              {partners.length > 0 && (
                <div className="flex items-center gap-3">
                  <HardHat className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Partenaire</p>
                    <p className="font-medium">
                      {(partners[0] as any)?.partner?.name || "N/A"}
                    </p>
                  </div>
                </div>
              )}
              {project.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Adresse</p>
                    <p className="font-medium">{project.address}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Période</p>
                  <p className="font-medium">
                    {formatDate(project.start_date)} -{" "}
                    {formatDate(project.end_date)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Avancement global</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">
                {formatBudget(project.estimated_budget)}
              </p>
              <p className="text-sm text-muted-foreground">Budget total</p>
            </div>
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dépensé</span>
                <span className="font-medium">{formatBudget(spentAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Restant</span>
                <span
                  className={`font-medium ${
                    remaining >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatBudget(remaining)}
                </span>
              </div>
            </div>
            <Progress value={budgetProgress} className="h-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="phases" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="phases">Phases</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="expenses">Dépenses</TabsTrigger>
          <TabsTrigger value="gallery">Galerie</TabsTrigger>
        </TabsList>

        <TabsContent value="phases">
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
              ) : phases.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune phase définie
                </div>
              ) : (
                <div className="space-y-4">
                  {phases.map((phase: ProjectPhase) => (
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
                                `/admin/projects/${id}/phases/${phase.id}`
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
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardContent className="pt-6">
              {isLoadingDocs ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : projectDocuments?.documents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun document pour ce projet
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectDocuments?.documents.map(
                      (doc: DocumentWithDetails) => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">
                            {doc.name}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {doc.file_type || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(doc.uploaded_at)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                doc.status === "validé"
                                  ? "default"
                                  : doc.status === "rejeté"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {documentStatusMap[doc.status] || doc.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {doc.file_url && (
                              <Button variant="ghost" size="sm" asChild>
                                <a
                                  href={doc.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Télécharger
                                </a>
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Dépenses</CardTitle>
              <Button onClick={openCreateExpenseSheet} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une dépense
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoadingExpenses ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : (projectExpenses?.expenses || []).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune dépense pour ce projet
                </div>
              ) : (
                (() => {
                  const expenses = projectExpenses?.expenses || [];
                  const categoryMap: Record<string, string> = {
                    fondations: "Fondations",
                    gros_œuvre: "Gros œuvre",
                    second_œuvre: "Second œuvre",
                    finitions: "Finitions",
                    main_d_œuvre: "Main d'œuvre",
                    matériaux: "Matériaux",
                    équipements: "Équipements",
                    autres: "Autres",
                  };

                  return (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Catégorie</TableHead>
                          <TableHead className="text-right">Montant</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {expenses.map((expense: ExpenseWithDetails) => (
                          <TableRow key={expense.id}>
                            <TableCell>{formatDate(expense.date)}</TableCell>
                            <TableCell className="font-medium">
                              {expense.description}
                            </TableCell>
                            <TableCell>
                              {expense.category ? (
                                <Badge variant="outline">
                                  {categoryMap[expense.category] ||
                                    expense.category}
                                </Badge>
                              ) : (
                                "N/A"
                              )}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatAmount(expense.amount)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEditExpense(expense)}
                                  title="Modifier"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive"
                                  onClick={() => openDeleteExpense(expense)}
                                  title="Supprimer"
                                  disabled={deleteExpenseMutation.isPending}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  );
                })()
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery">
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
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <div className="text-white text-center p-4">
                                  <p className="text-sm font-medium">
                                    {item.title}
                                  </p>
                                  {item.date && (
                                    <p className="text-xs mt-1">
                                      {formatDate(item.date)}
                                    </p>
                                  )}
                                </div>
                              </div>
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
                              <p className="text-sm font-medium">
                                {item.title}
                              </p>
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
        </TabsContent>
      </Tabs>

      {/* Expense Sheets */}
      {createExpenseSheet}
      {updateExpenseSheet}

      {/* Expense Delete Dialog */}
      <ExpenseDeleteDialog
        expense={selectedExpense}
        onDelete={handleDeleteExpense}
        isDeleting={deleteExpenseMutation.isPending}
        isOpen={isExpenseDeleteDialogOpen}
        onClose={() => {
          setIsExpenseDeleteDialogOpen(false);
          setSelectedExpense(null);
        }}
      />

      {/* Phase Sheets */}
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
        projectId={id}
      />

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
        projectId={id}
      />
    </div>
  );
};
