"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Calendar, User, CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/date.util";
import { cn } from "@/lib/utils";

interface PartnerProjectTasksProps {
  projectId: string;
}

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  à_faire: { label: "À faire", variant: "outline" },
  en_cours: { label: "En cours", variant: "default" },
  terminé: { label: "Terminé", variant: "secondary" },
  bloqué: { label: "Bloqué", variant: "destructive" },
};

const priorityMap: Record<string, { label: string; color: string }> = {
  faible: { label: "Faible", color: "text-muted-foreground" },
  moyenne: { label: "Moyenne", color: "text-blue-600" },
  élevée: { label: "Élevée", color: "text-orange-600" },
  urgente: { label: "Urgente", color: "text-red-600" },
};

const statusIconMap: Record<string, React.ReactNode> = {
  à_faire: <Circle className="h-4 w-4" />,
  en_cours: <Clock className="h-4 w-4" />,
  terminé: <CheckCircle2 className="h-4 w-4" />,
  bloqué: <AlertCircle className="h-4 w-4" />,
};

export const PartnerProjectTasks = ({ projectId }: PartnerProjectTasksProps) => {
  const { data: tasksData, isLoading, error } = useQuery({
    queryKey: ["partner-project-tasks", projectId],
    queryFn: () => api.partner.projects.getTasks(projectId),
    enabled: !!projectId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-destructive text-center">
            {error instanceof Error
              ? error.message
              : "Erreur lors du chargement des tâches"}
          </p>
        </CardContent>
      </Card>
    );
  }

  const tasks = tasksData?.tasks || [];

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">
            Aucune tâche pour ce projet
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group tasks by status
  const tasksByStatus = {
    à_faire: tasks.filter((t) => t.status === "à_faire"),
    en_cours: tasks.filter((t) => t.status === "en_cours"),
    terminé: tasks.filter((t) => t.status === "terminé"),
    bloqué: tasks.filter((t) => t.status === "bloqué"),
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{tasksByStatus.à_faire.length}</p>
              <p className="text-sm text-muted-foreground">À faire</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {tasksByStatus.en_cours.length}
              </p>
              <p className="text-sm text-muted-foreground">En cours</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-destructive">
                {tasksByStatus.bloqué.length}
              </p>
              <p className="text-sm text-muted-foreground">Bloqué</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {tasksByStatus.terminé.length}
              </p>
              <p className="text-sm text-muted-foreground">Terminé</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.map((task) => {
          const statusInfo = statusMap[task.status] || statusMap.à_faire;
          const priorityInfo = priorityMap[task.priority] || priorityMap.moyenne;
          const isOverdue =
            task.due_date &&
            task.status !== "terminé" &&
            new Date(task.due_date) < new Date();

          return (
            <Card key={task.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        {statusIconMap[task.status]}
                        <h4 className="font-medium">{task.name}</h4>
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={statusInfo.variant}>
                        {statusInfo.label}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(priorityInfo.color)}
                      >
                        {priorityInfo.label}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {task.due_date && (
                      <div
                        className={cn(
                          "flex items-center gap-1",
                          isOverdue && "text-destructive font-medium"
                        )}
                      >
                        <Calendar className="h-4 w-4" />
                        <span>
                          Échéance: {formatDate(task.due_date)}
                          {isOverdue && " (En retard)"}
                        </span>
                      </div>
                    )}
                    {task.assigned_user && (
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{task.assigned_user.full_name}</span>
                      </div>
                    )}
                  </div>

                  {task.progress > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progression</span>
                        <span className="font-medium">{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

