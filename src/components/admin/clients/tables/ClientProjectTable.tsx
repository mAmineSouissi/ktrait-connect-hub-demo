import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ClientDetail } from "@/types/client.types";
import { useRouter } from "next/router";

interface ClientProjectTableProps {
  client: ClientDetail;
}

// Status mapping for display
const statusMap: Record<string, string> = {
  planifié: "Planifié",
  en_cours: "En cours",
  en_attente: "En attente",
  terminé: "Terminé",
  annulé: "Annulé",
};

export const ClientProjectTable = ({ client }: ClientProjectTableProps) => {
  const router = useRouter();
  const projects = client.projects || [];

  if (projects.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun projet pour ce client
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Projet</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Avancement</TableHead>
          <TableHead>Budget</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id}>
            <TableCell className="font-medium">{project.name}</TableCell>
            <TableCell>
              <Badge
                variant={
                  project.status === "en_cours"
                    ? "default"
                    : project.status === "terminé"
                    ? "secondary"
                    : "outline"
                }
              >
                {statusMap[project.status] || project.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <span className="text-sm">{project.progress}%</span>
              </div>
            </TableCell>
            <TableCell>{project.budget}</TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/admin/projects/${project.id}`)}
              >
                Voir
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
