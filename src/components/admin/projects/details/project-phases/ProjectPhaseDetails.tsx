"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Calendar,
  Loader2,
  ListChecks,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/api";
import type { ProjectPhase } from "@/types/project.types";

interface ProjectPhaseDetailsProps {
  projectId: string;
  phaseId: string;
}

// Status mapping for display
const phaseStatusMap: Record<string, string> = {
  à_venir: "À venir",
  en_cours: "En cours",
  terminé: "Terminé",
  bloqué: "Bloqué",
};

// Format date helper
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "N/A";
  }
};

export const ProjectPhaseDetails = ({
  projectId,
  phaseId,
}: ProjectPhaseDetailsProps) => {
  const router = useRouter();

  const {
    data: phaseData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["phase", projectId, phaseId],
    queryFn: async () => {
      const result = await api.admin.phases.getById(projectId, phaseId);
      return result;
    },
    enabled: !!projectId && !!phaseId,
  });

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.push(`/admin/projects/${projectId}`)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au projet
        </Button>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (isError || !phaseData) {
    return (
      <div className="w-full space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.push(`/admin/projects/${projectId}`)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au projet
        </Button>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-destructive mb-4">
            {error instanceof Error
              ? error.message
              : "Erreur lors du chargement de la phase"}
          </p>
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/projects/${projectId}`)}
          >
            Retour au projet
          </Button>
        </div>
      </div>
    );
  }

  const phase: ProjectPhase = phaseData.phase;

  return (
    <div className="w-full space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.push(`/admin/projects/${projectId}`)}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour au projet
      </Button>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{phase.name}</CardTitle>
              {phase.description && (
                <p className="text-muted-foreground mt-1">
                  {phase.description}
                </p>
              )}
            </div>
            <Badge
              variant={
                phase.status === "terminé"
                  ? "secondary"
                  : phase.status === "en_cours"
                  ? "default"
                  : phase.status === "bloqué"
                  ? "destructive"
                  : "outline"
              }
              className="text-sm"
            >
              {phaseStatusMap[phase.status] || phase.status}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Avancement</span>
                <span className="font-medium">
                  {phase.progress_percentage}%
                </span>
              </div>
              <Progress value={phase.progress_percentage} className="h-3" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <ListChecks className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Ordre</p>
                  <p className="font-medium">{phase.order_index}</p>
                </div>
              </div>
              {phase.started_at && (
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Date de début
                    </p>
                    <p className="font-medium">
                      {formatDate(phase.started_at)}
                    </p>
                  </div>
                </div>
              )}
              {phase.completed_at && (
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date de fin</p>
                    <p className="font-medium">
                      {formatDate(phase.completed_at)}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Créé le</p>
                  <p className="font-medium">{formatDate(phase.created_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Modifié le</p>
                  <p className="font-medium">{formatDate(phase.updated_at)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                ID de la phase
              </p>
              <p className="text-sm font-mono">{phase.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">ID du projet</p>
              <p className="text-sm font-mono">{phase.project_id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Statut</p>
              <Badge
                variant={
                  phase.status === "terminé"
                    ? "secondary"
                    : phase.status === "en_cours"
                    ? "default"
                    : phase.status === "bloqué"
                    ? "destructive"
                    : "outline"
                }
              >
                {phaseStatusMap[phase.status] || phase.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Pourcentage d'avancement
              </p>
              <p className="text-2xl font-bold">{phase.progress_percentage}%</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
