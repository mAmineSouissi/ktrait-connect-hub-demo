"use client";

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
import { Plus, Loader2, Download } from "lucide-react";
import type { ClientDetail } from "@/types/client.types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { toast } from "sonner";
import { useClientDocumentCreateSheet } from "./modals/useClientDocumentCreateSheet";
import type { CreateDocumentRequest } from "@/api/admin/documents";
import { formatDate } from "@/lib/date.util";

interface ClientDocsTableProps {
  client: ClientDetail;
}

const documentStatusMap: Record<string, string> = {
  en_attente: "En attente",
  validé: "Validé",
  rejeté: "Rejeté",
};

export const ClientDocsTable = ({ client }: ClientDocsTableProps) => {
  const queryClient = useQueryClient();
  const clientId = client.id;

  // Fetch documents for this client
  const {
    data: documentsData,
    isLoading: isLoadingDocs,
    isError: isErrorDocs,
  } = useQuery({
    queryKey: ["documents", "client", clientId],
    queryFn: () =>
      api.admin.documents.list({
        client_id: clientId,
        limit: 100,
      }),
    enabled: !!clientId,
  });

  // Create document mutation
  const createDocumentMutation = useMutation({
    mutationFn: (data: CreateDocumentRequest) =>
      api.admin.documents.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["documents", "client", clientId],
      });
      queryClient.invalidateQueries({ queryKey: ["client", clientId] });
      closeCreateDocumentSheet();
      toast.success("Document créé avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la création du document");
    },
    onSettled: () => {
      // Reset form state after mutation completes
    },
  });

  const handleCreateDocument = async (data: CreateDocumentRequest) => {
    createDocumentMutation.mutate({
      ...data,
      client_id: clientId,
    });
  };

  const {
    createDocumentSheet,
    openCreateDocumentSheet,
    closeCreateDocumentSheet,
  } = useClientDocumentCreateSheet({
    createDocument: handleCreateDocument,
    isCreatePending: createDocumentMutation.isPending,
    resetDocument: () => {},
    clientId,
  });

  if (isLoadingDocs) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isErrorDocs) {
    return (
      <div className="text-center py-8 text-destructive">
        Erreur lors du chargement des documents
      </div>
    );
  }

  const documents = documentsData?.documents || [];

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={openCreateDocumentSheet} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un document
        </Button>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Aucun document pour ce client
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Dossier</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{doc.file_type || "N/A"}</Badge>
                </TableCell>
                <TableCell>{doc.folder || "—"}</TableCell>
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
                        <Download className="h-4 w-4 mr-2" />
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

      {/* Document Create Sheet */}
      {createDocumentSheet}
    </>
  );
};
