"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Download, Eye } from "lucide-react";
import { api } from "@/api";
import { formatDate } from "@/lib/date.util";
import type { DocumentWithDetails } from "@/types/document.types";

interface PartnerProjectDocumentsProps {
  projectId: string;
}

const documentStatusMap: Record<string, string> = {
  en_attente: "En attente",
  validé: "Validé",
  rejeté: "Rejeté",
};

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  en_attente: "outline",
  validé: "default",
  rejeté: "destructive",
};

export const PartnerProjectDocuments: React.FC<PartnerProjectDocumentsProps> = ({
  projectId,
}) => {
  const { data: documentsData, isLoading, error } = useQuery({
    queryKey: ["partner-project-documents", projectId],
    queryFn: () => api.partner.projects.getDocuments(projectId),
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
            Erreur lors du chargement des documents
          </p>
        </CardContent>
      </Card>
    );
  }

  const documents = documentsData?.documents || [];

  if (documents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documents du projet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Aucun document disponible pour ce projet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents du projet</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Dossier</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc: DocumentWithDetails) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{doc.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{doc.file_type || "N/A"}</Badge>
                </TableCell>
                <TableCell>
                  {doc.folder ? (
                    <Badge variant="secondary">{doc.folder}</Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>{formatDate(doc.uploaded_at)}</TableCell>
                <TableCell>
                  <Badge
                    variant={statusVariants[doc.status] || "outline"}
                  >
                    {documentStatusMap[doc.status] || doc.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {doc.file_url && (
                      <>
                        <Button variant="ghost" size="icon" asChild title="Voir">
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="icon" asChild title="Télécharger">
                          <a
                            href={doc.file_url}
                            download
                            rel="noopener noreferrer"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

