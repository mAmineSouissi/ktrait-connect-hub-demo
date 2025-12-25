"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { api } from "@/api";
import { toast } from "sonner";
import { DataTable } from "@/components/shared/data-tables/data-table";
import { DataTableConfig } from "@/components/shared/data-tables/types";
import { useClientDocumentColumns } from "./columns/useClientDocumentColumns";
import { useClientDocumentCreateSheet } from "./modals/ClientDocumentCreateSheet";
import { useClientDocumentUpdateSheet } from "./modals/ClientDocumentUpdateSheet";
import { ClientDocumentDeleteDialog } from "./modals/ClientDocumentDeleteDialog";
import { useDebounce } from "@/hooks/useDebounce";
import type { DocumentWithDetails } from "@/types/document.types";
import type { CreateDocumentRequest, UpdateDocumentRequest } from "@/api/client/documents";

export const ClientDocuments = () => {
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
      "client-documents",
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      api.client.documents.list({
        limit: debouncedSize,
        offset,
        sortKey: debouncedSortDetails.sortKey,
        order: debouncedSortDetails.order ? "desc" : "asc",
        search: debouncedSearchTerm || undefined,
      }),
  });

  // Fetch projects for dropdown
  const { data: projectsData } = useQuery({
    queryKey: ["client-projects"],
    queryFn: () => api.client.projects.list({ limit: 100 }),
  });

  const documents = React.useMemo(() => {
    return documentsResponse?.documents || [];
  }, [documentsResponse]);

  const projects = projectsData?.projects || [];

  const totalPageCount = React.useMemo(() => {
    if (!documentsResponse) return 0;
    return Math.ceil((documentsResponse.total || 0) / debouncedSize);
  }, [documentsResponse, debouncedSize]);

  // State for selected document
  const [selectedDocument, setSelectedDocument] = React.useState<DocumentWithDetails | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  // Create document mutation
  const { mutate: createDocument, isPending: isCreationPending } = useMutation({
    mutationFn: (data: CreateDocumentRequest) => api.client.documents.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-documents"] });
      closeCreateDocumentSheet();
      toast.success("Document créé avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la création du document");
    },
  });

  // Update document mutation
  const { mutate: updateDocument, isPending: isUpdatePending } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDocumentRequest }) =>
      api.client.documents.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-documents"] });
      closeUpdateDocumentSheet();
      setSelectedDocument(null);
      toast.success("Document mis à jour avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la mise à jour du document");
    },
  });

  // Delete document mutation
  const { mutate: deleteDocument, isPending: isDeletionPending } = useMutation({
    mutationFn: (id: string) => api.client.documents.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-documents"] });
      setIsDeleteDialogOpen(false);
      setSelectedDocument(null);
      toast.success("Document supprimé avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la suppression du document");
    },
  });

  const handleCreateSubmit = (data: CreateDocumentRequest) => {
    createDocument(data);
  };

  const handleUpdateSubmit = (data: UpdateDocumentRequest) => {
    if (selectedDocument) {
      updateDocument({ id: selectedDocument.id, data });
    }
  };

  const handleDelete = (id: string) => {
    deleteDocument(id);
  };

  const handleOpenEdit = (document: DocumentWithDetails) => {
    setSelectedDocument(document);
    openUpdateDocumentSheet();
  };

  const handleOpenDelete = (document: DocumentWithDetails) => {
    setSelectedDocument(document);
    setIsDeleteDialogOpen(true);
  };

  // Create sheet
  const {
    createDocumentSheet,
    openCreateDocumentSheet,
    closeCreateDocumentSheet,
  } = useClientDocumentCreateSheet({
    createDocument: handleCreateSubmit,
    isCreatePending: isCreationPending,
    resetDocument: () => {},
    projects,
  });

  // Update sheet
  const {
    updateDocumentSheet,
    openUpdateDocumentSheet,
    closeUpdateDocumentSheet,
  } = useClientDocumentUpdateSheet({
    updateDocument: handleUpdateSubmit,
    isUpdatePending: isUpdatePending,
    resetDocument: () => {
      setSelectedDocument(null);
    },
    document: selectedDocument,
  });

  // Data table context
  const context: DataTableConfig<DocumentWithDetails> = {
    singularName: "document",
    pluralName: "documents",
    createCallback: openCreateDocumentSheet,
    updateCallback: handleOpenEdit,
    deleteCallback: handleOpenDelete,
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

  const columns = useClientDocumentColumns(context);

  return (
    <div className="space-y-6">
      <DataTable
        data={documents}
        columns={columns}
        context={context}
        isPending={isDocumentsPending}
      />
      {createDocumentSheet}
      {updateDocumentSheet}
      <ClientDocumentDeleteDialog
        document={selectedDocument}
        onDelete={handleDelete}
        isDeleting={isDeletionPending}
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedDocument(null);
        }}
      />
    </div>
  );
};

