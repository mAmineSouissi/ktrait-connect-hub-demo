"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { api } from "@/api";
import { toast } from "sonner";
import { DataTable } from "@/components/shared/data-tables/data-table";
import { DataTableConfig } from "@/components/shared/data-tables/types";
import { usePartnerDocumentColumns } from "./documents/columns/usePartnerDocumentColumns";
import { usePartnerDocumentCreateSheet } from "./documents/modals/PartnerDocumentCreateSheet";
import { usePartnerDocumentUpdateSheet } from "./documents/modals/PartnerDocumentUpdateSheet";
import { PartnerDocumentDeleteDialog } from "./documents/modals/PartnerDocumentDeleteDialog";
import { useDebounce } from "@/hooks/useDebounce";
import type { DocumentWithDetails } from "@/types/document.types";
import type {
  CreatePartnerDocumentRequest,
  UpdatePartnerDocumentRequest,
} from "@/api/partner/documents";

export const PartnerDocuments = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(10);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortDetails, setSortDetails] = React.useState<{
    order: boolean;
    sortKey: string;
  }>({
    order: true,
    sortKey: "uploaded_at",
  });
  const [selectedDocument, setSelectedDocument] =
    React.useState<DocumentWithDetails | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [documentToDelete, setDocumentToDelete] =
    React.useState<DocumentWithDetails | null>(null);

  // Debounce values
  const { value: debouncedPage } = useDebounce(page, 300);
  const { value: debouncedSize } = useDebounce(size, 300);
  const { value: debouncedSearchTerm } = useDebounce(searchTerm, 500);
  const { value: debouncedSortDetails } = useDebounce(sortDetails, 300);

  const offset = (debouncedPage - 1) * debouncedSize;

  // Fetch documents
  const {
    data: documentsResponse,
    isFetching: isDocumentsPending,
    refetch: refetchDocuments,
  } = useQuery({
    queryKey: [
      "partner-documents",
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      api.partner.documents.list({
        limit: debouncedSize,
        offset,
        sortKey: debouncedSortDetails.sortKey,
        order: debouncedSortDetails.order ? "desc" : "asc",
        search: debouncedSearchTerm || undefined,
      }),
  });

  // Fetch projects for dropdown
  const { data: projectsData } = useQuery({
    queryKey: ["partner-projects"],
    queryFn: () => api.partner.projects.list({ limit: 100 }),
  });

  const documents = React.useMemo(() => {
    return documentsResponse?.documents || [];
  }, [documentsResponse]);

  const projects = projectsData?.projects || [];

  const totalPageCount = React.useMemo(() => {
    if (!documentsResponse) return 0;
    return Math.ceil((documentsResponse.total || 0) / debouncedSize);
  }, [documentsResponse, debouncedSize]);

  // Create document mutation
  const createDocumentMutation = useMutation({
    mutationFn: (data: CreatePartnerDocumentRequest) =>
      api.partner.documents.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner-documents"] });
      toast.success("Document créé avec succès");
      closeCreateDocumentSheet();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la création du document");
    },
  });

  // Update document mutation
  const updateDocumentMutation = useMutation({
    mutationFn: ({
      documentId,
      data,
    }: {
      documentId: string;
      data: UpdatePartnerDocumentRequest;
    }) => api.partner.documents.update(documentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner-documents"] });
      toast.success("Document mis à jour avec succès");
      closeUpdateDocumentSheet();
      setSelectedDocument(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la mise à jour du document");
    },
  });

  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: (documentId: string) => api.partner.documents.delete(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner-documents"] });
      toast.success("Document supprimé avec succès");
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la suppression du document");
    },
  });

  // Sheet hooks
  const {
    createDocumentSheet,
    openCreateDocumentSheet,
    closeCreateDocumentSheet,
  } = usePartnerDocumentCreateSheet({
    createDocument: (data) => createDocumentMutation.mutate(data),
    isCreatePending: createDocumentMutation.isPending,
    resetDocument: () => {},
    projects: projects.map((p) => ({ id: p.id, name: p.name })),
  });

  const {
    updateDocumentSheet,
    openUpdateDocumentSheet,
    closeUpdateDocumentSheet,
  } = usePartnerDocumentUpdateSheet({
    updateDocument: (data) => {
      if (selectedDocument) {
        updateDocumentMutation.mutate({
          documentId: selectedDocument.id,
          data,
        });
      }
    },
    isUpdatePending: updateDocumentMutation.isPending,
    resetDocument: () => setSelectedDocument(null),
    document: selectedDocument,
  });

  // Data table config
  const context: DataTableConfig<DocumentWithDetails> = {
    singularName: "document",
    pluralName: "documents",
    createCallback: openCreateDocumentSheet,
    updateCallback: (document) => {
      setSelectedDocument(document);
      openUpdateDocumentSheet();
    },
    deleteCallback: (document) => {
      setDocumentToDelete(document);
      setDeleteDialogOpen(true);
    },
    searchTerm: debouncedSearchTerm,
    setSearchTerm: setSearchTerm,
    page: debouncedPage,
    totalPageCount,
    setPage,
    size: debouncedSize,
    setSize,
    order: debouncedSortDetails.order,
    sortKey: debouncedSortDetails.sortKey,
    setSortDetails: (order, sortKey) => setSortDetails({ order, sortKey }),
    targetEntity: (document) => {
      setSelectedDocument(document);
    },
  };

  const columns = usePartnerDocumentColumns(context);

  return (
    <>
      <div className="space-y-6">
        <DataTable
          data={documents}
          columns={columns}
          context={context}
          isPending={isDocumentsPending}
              />
            </div>

      {/* Modals */}
      {createDocumentSheet}
      {updateDocumentSheet}
      <PartnerDocumentDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => {
          if (documentToDelete) {
            deleteDocumentMutation.mutate(documentToDelete.id);
          }
        }}
        isPending={deleteDocumentMutation.isPending}
        documentName={documentToDelete?.name}
      />
    </>
  );
};
