"use client";

import React from "react";
import { api } from "@/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Download, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useClientDocumentCreateSheet } from "../modals/ClientDocumentCreateSheet";
import { useClientDocumentUpdateSheet } from "../modals/ClientDocumentUpdateSheet";
import { ClientDocumentDeleteDialog } from "../modals/ClientDocumentDeleteDialog";

interface ClientProjectDocumentsProps {
  projectId: string;
}

const documentStatusMap: Record<string, string> = {
  en_attente: "En attente",
  validé: "Validé",
  rejeté: "Rejeté",
};

export const ClientProjectDocuments = ({
  projectId,
}: ClientProjectDocumentsProps) => {
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedDocument, setSelectedDocument] = React.useState<DocumentWithDetails | null>(null);

  // Fetch documents for this project
  const { data: projectDocuments, isLoading: isLoadingDocs } = useQuery({
    queryKey: ["client-documents", "project", projectId],
    queryFn: () =>
      api.client.documents.list({
        project_id: projectId,
        limit: 100,
      }),
    enabled: !!projectId,
  });

  // Create document mutation
  const createMutation = useMutation({
    mutationFn: api.client.documents.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-documents", "project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["client-project", projectId] });
      closeCreateDocumentSheet();
      toast.success("Document créé avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la création du document");
    },
  });

  // Update document mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.client.documents.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-documents", "project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["client-project", projectId] });
      closeUpdateDocumentSheet();
      setSelectedDocument(null);
      toast.success("Document modifié avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la modification du document");
    },
  });

  // Delete document mutation
  const deleteMutation = useMutation({
    mutationFn: api.client.documents.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-documents", "project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["client-project", projectId] });
      setIsDeleteDialogOpen(false);
      setSelectedDocument(null);
      toast.success("Document supprimé avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la suppression du document");
    },
  });

  const handleCreateDocument = async (data: any) => {
    createMutation.mutate({
      ...data,
      project_id: projectId, // Always use the current project
    });
  };

  const handleUpdateDocument = async (data: any) => {
    if (selectedDocument) {
      updateMutation.mutate({
        id: selectedDocument.id,
        data,
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const openDeleteDialog = (document: DocumentWithDetails) => {
    setSelectedDocument(document);
    setIsDeleteDialogOpen(true);
  };

  const openEditDialog = (document: DocumentWithDetails) => {
    setSelectedDocument(document);
    openUpdateDocumentSheet();
  };

  const {
    createDocumentSheet,
    openCreateDocumentSheet,
    closeCreateDocumentSheet,
  } = useClientDocumentCreateSheet({
    createDocument: handleCreateDocument,
    isCreatePending: createMutation.isPending,
    resetDocument: () => {},
    projectId,
  });

  const {
    updateDocumentSheet,
    openUpdateDocumentSheet,
    closeUpdateDocumentSheet,
  } = useClientDocumentUpdateSheet({
    updateDocument: handleUpdateDocument,
    isUpdatePending: updateMutation.isPending,
    resetDocument: () => setSelectedDocument(null),
    document: selectedDocument,
  });

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Documents</CardTitle>
          <Button onClick={openCreateDocumentSheet} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un document
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoadingDocs ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : projectDocuments?.documents?.length === 0 ? (
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectDocuments?.documents?.map((doc: DocumentWithDetails) => (
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
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {doc.file_url && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(doc.file_url, "_blank")}
                            title="Télécharger"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(doc)}
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => openDeleteDialog(doc)}
                          title="Supprimer"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      {createDocumentSheet}
      {updateDocumentSheet}
      <ClientDocumentDeleteDialog
        document={selectedDocument}
        onDelete={handleDelete}
        isDeleting={deleteMutation.isPending}
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedDocument(null);
        }}
      />
    </>
  );
};
