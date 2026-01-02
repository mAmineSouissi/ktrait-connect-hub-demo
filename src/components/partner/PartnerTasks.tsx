"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  User,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Filter,
  ArrowRight,
  FolderKanban,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { formatDate } from "@/lib/date.util";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { usePartnerTaskCreateSheet } from "./tasks/modals/PartnerTaskCreateSheet";
import { usePartnerTaskUpdateSheet } from "./tasks/modals/PartnerTaskUpdateSheet";
import { PartnerTaskDeleteDialog } from "./tasks/modals/PartnerTaskDeleteDialog";
import type {
  PartnerTask,
  CreatePartnerTaskRequest,
  UpdatePartnerTaskRequest,
} from "@/api/partner/projects";

const statusConfig = {
  à_faire: {
    label: "À faire",
    icon: Circle,
    color: "text-muted-foreground",
    bgColor: "bg-muted/50",
    borderColor: "border-muted",
  },
  en_cours: {
    label: "En cours",
    icon: Clock,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
  },
  terminé: {
    label: "Terminé",
    icon: CheckCircle2,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    borderColor: "border-green-200 dark:border-green-800",
  },
  bloqué: {
    label: "Bloqué",
    icon: AlertCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/20",
  },
};

const priorityConfig = {
  faible: {
    label: "Faible",
    color: "text-muted-foreground",
    dot: "bg-gray-400",
  },
  moyenne: { label: "Moyenne", color: "text-blue-600", dot: "bg-blue-500" },
  élevée: { label: "Élevée", color: "text-orange-600", dot: "bg-orange-500" },
  urgente: { label: "Urgente", color: "text-red-600", dot: "bg-red-500" },
};

export default function PartnerTasks() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedTask, setSelectedTask] = useState<PartnerTask | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<PartnerTask | null>(null);

  // Fetch tasks
  const {
    data: tasksData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["partner-tasks", selectedStatus, selectedPriority],
    queryFn: () =>
      api.partner.tasks.list({
        status: selectedStatus !== "all" ? selectedStatus : undefined,
        priority: selectedPriority !== "all" ? selectedPriority : undefined,
        limit: 100,
      }),
  });

  // Fetch projects for create form
  const { data: projectsData } = useQuery({
    queryKey: ["partner-projects"],
    queryFn: () => api.partner.projects.list({ limit: 100 }),
  });

  const tasks = tasksData?.tasks || [];
  const projects = projectsData?.projects || [];

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: (data: CreatePartnerTaskRequest) =>
      api.partner.tasks.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner-tasks"] });
      toast.success("Tâche créée avec succès");
      closeCreateTaskSheet();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la création de la tâche");
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: string;
      data: UpdatePartnerTaskRequest;
    }) => api.partner.tasks.update(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner-tasks"] });
      toast.success("Tâche mise à jour avec succès");
      closeUpdateTaskSheet();
      setSelectedTask(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la mise à jour de la tâche");
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => api.partner.tasks.delete(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner-tasks"] });
      toast.success("Tâche supprimée avec succès");
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la suppression de la tâche");
    },
  });

  // Sheet hooks
  const { createTaskSheet, openCreateTaskSheet, closeCreateTaskSheet } =
    usePartnerTaskCreateSheet({
      createTask: (data) => createTaskMutation.mutate(data),
      isCreatePending: createTaskMutation.isPending,
      resetTask: () => {},
      projects: projects.map((p) => ({ id: p.id, name: p.name })),
    });

  const { updateTaskSheet, openUpdateTaskSheet, closeUpdateTaskSheet } =
    usePartnerTaskUpdateSheet({
      updateTask: (data) => {
        if (selectedTask) {
          updateTaskMutation.mutate({ taskId: selectedTask.id, data });
        }
      },
      isUpdatePending: updateTaskMutation.isPending,
      resetTask: () => setSelectedTask(null),
      task: selectedTask,
    });

  // Group tasks by status
  const tasksByStatus = {
    à_faire: tasks.filter((t) => t.status === "à_faire"),
    en_cours: tasks.filter((t) => t.status === "en_cours"),
    terminé: tasks.filter((t) => t.status === "terminé"),
    bloqué: tasks.filter((t) => t.status === "bloqué"),
  };

  // Calculate statistics
  const stats = {
    total: tasks.length,
    à_faire: tasksByStatus.à_faire.length,
    en_cours: tasksByStatus.en_cours.length,
    terminé: tasksByStatus.terminé.length,
    bloqué: tasksByStatus.bloqué.length,
    overdue: tasks.filter(
      (t) =>
        t.due_date &&
        t.status !== "terminé" &&
        new Date(t.due_date) < new Date()
    ).length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card>
          <CardContent className="py-6">
            <p className="text-destructive text-center">
              {error instanceof Error
                ? error.message
                : "Erreur lors du chargement des tâches"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Action Button */}
        <div className="flex justify-end">
          <Button onClick={openCreateTaskSheet}>
            <Plus className="h-4 w-4 mr-2" />
            Créer une tâche
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedStatus("à_faire")}
          >
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-muted-foreground">
                  {stats.à_faire}
                </p>
                <p className="text-sm text-muted-foreground">À faire</p>
              </div>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedStatus("en_cours")}
          >
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  {stats.en_cours}
                </p>
                <p className="text-sm text-muted-foreground">En cours</p>
              </div>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedStatus("bloqué")}
          >
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-destructive">
                  {stats.bloqué}
                </p>
                <p className="text-sm text-muted-foreground">Bloqué</p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {stats.terminé}
                </p>
                <p className="text-sm text-muted-foreground">Terminé</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filtres:</span>
              </div>
              <Tabs
                value={selectedStatus}
                onValueChange={setSelectedStatus}
                className="w-auto"
              >
                <TabsList>
                  <TabsTrigger value="all">Tous les statuts</TabsTrigger>
                  <TabsTrigger value="à_faire">À faire</TabsTrigger>
                  <TabsTrigger value="en_cours">En cours</TabsTrigger>
                  <TabsTrigger value="bloqué">Bloqué</TabsTrigger>
                  <TabsTrigger value="terminé">Terminé</TabsTrigger>
                </TabsList>
              </Tabs>
              <Tabs
                value={selectedPriority}
                onValueChange={setSelectedPriority}
                className="w-auto"
              >
                <TabsList>
                  <TabsTrigger value="all">Toutes priorités</TabsTrigger>
                  <TabsTrigger value="urgente">Urgente</TabsTrigger>
                  <TabsTrigger value="élevée">Élevée</TabsTrigger>
                  <TabsTrigger value="moyenne">Moyenne</TabsTrigger>
                  <TabsTrigger value="faible">Faible</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Kanban Board */}
        {selectedStatus === "all" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(statusConfig).map(([status, config]) => {
              const StatusIcon = config.icon;
              const statusTasks =
                tasksByStatus[status as keyof typeof tasksByStatus];

              return (
                <Card
                  key={status}
                  className={cn("flex flex-col", config.bgColor)}
                >
                  <CardHeader className={cn("border-b", config.borderColor)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StatusIcon className={cn("h-5 w-5", config.color)} />
                        <CardTitle className="text-lg">
                          {config.label}
                        </CardTitle>
                      </div>
                      <Badge variant="secondary">{statusTasks.length}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 pt-4 space-y-3 overflow-y-auto max-h-[600px]">
                    {statusTasks.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        Aucune tâche
                      </p>
                    ) : (
                      statusTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onEdit={(task) => {
                            setSelectedTask(task);
                            openUpdateTaskSheet();
                          }}
                          onDelete={(task) => {
                            setTaskToDelete(task);
                            setDeleteDialogOpen(true);
                          }}
                        />
                      ))
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={(task) => {
                  setSelectedTask(task);
                  openUpdateTaskSheet();
                }}
                onDelete={(task) => {
                  setTaskToDelete(task);
                  setDeleteDialogOpen(true);
                }}
              />
            ))}
          </div>
        )}

        {tasks.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium">Aucune tâche trouvée</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Vous n'avez pas de tâches pour le moment
                  </p>
                </div>
                <Button onClick={openCreateTaskSheet} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer votre première tâche
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modals */}
      {createTaskSheet}
      {updateTaskSheet}
      <PartnerTaskDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => {
          if (taskToDelete) {
            deleteTaskMutation.mutate(taskToDelete.id);
          }
        }}
        isPending={deleteTaskMutation.isPending}
        taskName={taskToDelete?.name}
      />
    </>
  );
}

interface TaskCardProps {
  task: PartnerTask;
  onEdit?: (task: PartnerTask) => void;
  onDelete?: (task: PartnerTask) => void;
}

function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const router = useRouter();
  const priorityInfo = priorityConfig[task.priority] || priorityConfig.moyenne;
  const isOverdue =
    task.due_date &&
    task.status !== "terminé" &&
    new Date(task.due_date) < new Date();

  return (
    <Card className="hover:shadow-lg transition-all group">
      <CardContent className="pt-6">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
                {task.name}
              </h4>
              {task.project && (
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <FolderKanban className="h-3 w-3" />
                  {task.project.name}
                </p>
              )}
            </div>
            <div
              className={cn(
                "h-2 w-2 rounded-full shrink-0 mt-1",
                priorityInfo.dot
              )}
            />
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Progress */}
          {task.progress > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Progression</span>
                <span className="font-medium">{task.progress}%</span>
              </div>
              <Progress value={task.progress} className="h-1.5" />
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {task.due_date && (
                <div
                  className={cn(
                    "flex items-center gap-1",
                    isOverdue && "text-destructive font-medium"
                  )}
                >
                  <Calendar className="h-3 w-3" />
                  <span>
                    {formatDate(task.due_date)}
                    {isOverdue && " ⚠️"}
                  </span>
                </div>
              )}
              {task.assigned_user && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span className="truncate max-w-[80px]">
                    {task.assigned_user.full_name}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(task);
                  }}
                >
                  <Edit className="h-3 w-3" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
              {task.project?.id && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/partner/projects/${task.project!.id}`);
                  }}
                >
                  <ArrowRight className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
