import { api } from "@/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableRow,
  TableHeader,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { formatDate } from "@/lib/date.util";
import { DocumentWithDetails } from "@/types/document.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProjectDocumentsProps {
  projectId: string;
}

const documentStatusMap: Record<string, string> = {
  en_attente: "En attente",
  validé: "Validé",
  rejeté: "Rejeté",
};
export const ProjectDocuments = ({ projectId }: ProjectDocumentsProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: projectData } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const result = await api.admin.projects.getById(projectId);
      return result.project;
    },
    enabled: !!projectId,
  });

  // Fetch documents for this project
  const { data: projectDocuments, isLoading: isLoadingDocs } = useQuery({
    queryKey: ["documents", "project", projectId],
    queryFn: () =>
      api.admin.documents.list({
        project_id: projectId,
        limit: 100,
      }),
    enabled: !!projectId && !!projectData,
  });

  return (
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
              {projectDocuments?.documents.map((doc: DocumentWithDetails) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{doc.file_type || "N/A"}</Badge>
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
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
