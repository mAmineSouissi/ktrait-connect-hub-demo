import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { ProjectPhase } from "@/types";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

interface ClientProjectPhasesProps {
  projectId: string;
}

const phaseStatusMap: Record<string, string> = {
  à_venir: "À venir",
  en_cours: "En cours",
  terminé: "Terminé",
  bloqué: "Bloqué",
};

export const ClientProjectPhases = ({ projectId }: ClientProjectPhasesProps) => {
  const router = useRouter();

  // Fetch phases for this project (read-only)
  const { data: projectPhases, isLoading: isLoadingPhases } = useQuery({
    queryKey: ["client-phases", "project", projectId],
    queryFn: async () => {
      // Use admin API but it will be filtered by RLS or we can create client-specific route
      // For now, get from project detail
      const result = await api.client.projects.getById(projectId);
      return result.project.phases || [];
    },
    enabled: !!projectId,
  });

  const phases = projectPhases || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phases</CardTitle>
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
                    <div className="font-medium">{phase.name}</div>
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
                  </div>
                  {phase.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {phase.description}
                    </p>
                  )}
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
  );
};

