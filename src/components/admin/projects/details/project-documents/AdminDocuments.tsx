"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useDocumentCreateSheet } from "./modals/DocumentCreateSheet";
import { DocumentDeleteDialog } from "./modals/DocumentDeleteDialog";
import {
  Search,
  Folder,
  FileText,
  Download,
  Trash2,
  Eye,
  Upload,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/api";
import type { DocumentWithDetails } from "@/types/document.types";

// Common folder names
const folderNames = [
  "Contrats",
  "Plans",
  "Devis",
  "Factures",
  "Permis",
  "Rapports",
];

const documentStatusMap: Record<string, string> = {
  en_attente: "En attente",
  validé: "Validé",
  rejeté: "Rejeté",
};

export const AdminDocuments = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentWithDetails | null>(null);

  // Fetch documents
  const {
    data: documentsData,
    isLoading: isLoadingDocuments,
    error: documentsError,
  } = useQuery({
    queryKey: ["documents", selectedFolder],
    queryFn: () =>
      api.admin.documents.list({
        folder: selectedFolder || undefined,
        limit: 100,
      }),
  });

  // Fetch projects for dropdown
  const { data: projectsData } = useQuery({
    queryKey: ["projects"],
    queryFn: () => api.admin.projects.list({ limit: 100 }),
  });

  const documents = documentsData?.documents || [];
  const projects = projectsData?.projects || [];

  // Calculate folder counts
  const folderCounts = folderNames.reduce((acc, folderName) => {
    acc[folderName] = documents.filter(
      (doc) => doc.folder === folderName
    ).length;
    return acc;
  }, {} as Record<string, number>);

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      doc.name.toLowerCase().includes(searchLower) ||
      doc.project_name?.toLowerCase().includes(searchLower) ||
      doc.client_name?.toLowerCase().includes(searchLower);
    const matchesFolder = !selectedFolder || doc.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  // Create document mutation
  const createMutation = useMutation({
    mutationFn: api.admin.documents.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      closeCreateDocumentSheet();
      toast.success("Document créé avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la création du document");
    },
  });

  // Create document handler
  const handleCreateDocument = async (data: any) => {
    createMutation.mutate(data);
  };

  // Delete document mutation
  const deleteMutation = useMutation({
    mutationFn: api.admin.documents.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      setIsDeleteDialogOpen(false);
      setSelectedDocument(null);
      toast.success("Document supprimé avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la suppression du document");
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const openDeleteDialog = (document: DocumentWithDetails) => {
    setSelectedDocument(document);
    setIsDeleteDialogOpen(true);
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("fr-FR");
  };

  // Create sheet
  const {
    createDocumentSheet,
    openCreateDocumentSheet,
    closeCreateDocumentSheet,
  } = useDocumentCreateSheet({
    createDocument: handleCreateDocument,
    isCreatePending: createMutation.isPending,
    resetDocument: () => {},
    projects,
  });

  if (isLoadingDocuments) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (documentsError) {
    return (
      <div className="p-6">
        <p className="text-destructive">
          Erreur lors du chargement des documents:{" "}
          {documentsError instanceof Error
            ? documentsError.message
            : "Erreur inconnue"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-background">
      <main className="flex flex-1 flex-col">
        <div className="flex-1 space-y-6 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un document..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Button onClick={openCreateDocumentSheet}>
              <Upload className="h-4 w-4 mr-2" />
              Ajouter un document
            </Button>
          </div>

          {/* Sheet */}
          {createDocumentSheet}

          {/* Delete Dialog */}
          <DocumentDeleteDialog
            document={selectedDocument}
            onDelete={handleDelete}
            isDeleting={deleteMutation.isPending}
            isOpen={isDeleteDialogOpen}
            onClose={() => {
              setIsDeleteDialogOpen(false);
              setSelectedDocument(null);
            }}
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {folderNames.map((folderName) => (
              <Card
                key={folderName}
                className={`cursor-pointer hover:shadow-md transition-all ${
                  selectedFolder === folderName ? "ring-2 ring-primary" : ""
                }`}
                onClick={() =>
                  setSelectedFolder(
                    selectedFolder === folderName ? null : folderName
                  )
                }
              >
                <CardContent className="pt-6 text-center">
                  <Folder className="h-12 w-12 mx-auto text-primary mb-2" />
                  <p className="font-medium">{folderName}</p>
                  <p className="text-sm text-muted-foreground">
                    {folderCounts[folderName] || 0} fichiers
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {selectedFolder
                  ? `Documents - ${selectedFolder}`
                  : "Tous les documents"}
                {filteredDocuments.length > 0 && (
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    ({filteredDocuments.length})
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun document trouvé
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Projet</TableHead>
                      <TableHead>Dossier</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Taille</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((doc: DocumentWithDetails) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{doc.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {doc.project_name || doc.client_name || "N/A"}
                        </TableCell>
                        <TableCell>
                          {doc.folder ? (
                            <Badge variant="outline">{doc.folder}</Badge>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {doc.file_type || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>{doc.file_size || "N/A"}</TableCell>
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
                          <div className="flex justify-end gap-1">
                            {doc.file_url && (
                              <>
                                <Button variant="ghost" size="icon" asChild>
                                  <a
                                    href={doc.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </a>
                                </Button>
                                <Button variant="ghost" size="icon" asChild>
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
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => openDeleteDialog(doc)}
                              disabled={deleteMutation.isPending}
                              title="Supprimer"
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
        </div>
      </main>
    </div>
  );
};
