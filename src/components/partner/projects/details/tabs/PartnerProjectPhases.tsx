"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { api } from "@/api";
import { formatDate } from "@/lib/date.util";

interface PartnerProjectPhasesProps {
  projectId: string;
}

const statusMap: Record<string, string> = {
  à_venir: "À venir",
  en_cours: "En cours",
  terminé: "Terminé",
  en_pause: "En pause",
};

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  à_venir: "outline",
  en_cours: "default",
  terminé: "secondary",
  en_pause: "secondary",
};

export const PartnerProjectPhases: React.FC<PartnerProjectPhasesProps> = ({
  projectId,
}) => {
  const { data: phasesData, isLoading, error } = useQuery({
    queryKey: ["partner-project-phases", projectId],
    queryFn: () => api.partner.projects.getPhases(projectId),
    enabled: !!projectId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-destructive text-center">
            Erreur lors du chargement des phases
          </p>
        </CardContent>
      </Card>
    );
  }

  const phases = phasesData?.phases || [];

  if (phases.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Phases du projet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Aucune phase définie pour ce projet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phases du projet</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {phases.map((phase) => (
            <div
              key={phase.id}
              className="p-4 rounded-lg border space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">{phase.name}</h4>
                  {phase.description && (
                    <p className="text-sm text-muted-foreground">
                      {phase.description}
                    </p>
                  )}
                </div>
                <Badge variant={statusVariants[phase.status] || "outline"}>
                  {statusMap[phase.status] || phase.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avancement</span>
                  <span className="font-medium">
                    {phase.progress_percentage}%
                  </span>
                </div>
                <Progress value={phase.progress_percentage} className="h-2" />
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {phase.started_at && (
                  <div>
                    <span className="font-medium">Début: </span>
                    {formatDate(phase.started_at)}
                  </div>
                )}
                {phase.completed_at && (
                  <div>
                    <span className="font-medium">Terminé: </span>
                    {formatDate(phase.completed_at)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

