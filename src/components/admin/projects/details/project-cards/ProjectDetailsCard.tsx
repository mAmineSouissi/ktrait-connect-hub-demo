import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/date.util";
import { cn } from "@/lib/utils";
import { ProjectPartner, ProjectWithDetails } from "@/types/project.types";
import { Calendar, HardHat, MapPin, Users } from "lucide-react";

interface ProjectDetailsCardProps {
  className?: string;
  project: ProjectWithDetails;
  partners: ProjectPartner[];
}

const statusMap: Record<string, string> = {
  planifié: "Planifié",
  en_cours: "En cours",
  en_attente: "En attente",
  terminé: "Terminé",
  annulé: "Annulé",
};

export const ProjectDetailsCard = ({
  className,
  project,
  partners,
}: ProjectDetailsCardProps) => {
  return (
    <Card className={cn("lg:col-span-2", className)}>
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-2">
          <CardTitle className="text-2xl">{project.name}</CardTitle>
          {project.description && (
            <p className="text-muted-foreground mt-1">{project.description}</p>
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
              <a
                href={`/admin/clients/${project.client?.id}`}
                className="font-medium hover:underline"
              >
                {project.client?.full_name || "N/A"}
              </a>
              {project.client?.email && (
                <p className="text-xs text-muted-foreground">
                  {project.client.email}
                </p>
              )}
            </div>
          </div>
          {partners.length > 0 && (
            <div className="flex items-center gap-3">
              <HardHat className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">
                  {partners.length === 1 ? "Partenaire" : "Partenaires"}
                </p>
                <p className="font-medium">
                  {partners.length === 1
                    ? (partners[0] as any)?.partner?.name || "N/A"
                    : `${partners.length} partenaire${
                        partners.length > 1 ? "s" : ""
                      }`}
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
  );
};
