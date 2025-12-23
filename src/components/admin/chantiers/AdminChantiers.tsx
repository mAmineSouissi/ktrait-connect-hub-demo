"use client";

import React from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/shared/data-tables/data-table";
import { DataTableConfig } from "@/components/shared/data-tables/types";
import { useChantierColumns } from "./columns/useChantierColumns";
import { useChantierStore } from "@/hooks/stores/useChantierStore";
import { useDebounce } from "@/hooks/useDebounce";
import { admin } from "@/api/admin";
import type { ChantierWithCounts } from "@/types/chantier.types";
import type {
  CreateChantierRequest,
  UpdateChantierRequest,
} from "@/types/chantier.types";
import { useChantierCreateSheet } from "./modals/ChantierCreateSheet";
import { useChantierUpdateSheet } from "./modals/ChantierUpdateSheet";
import { useChantierDeleteDialog } from "./modals/ChantierDeleteDialog";

interface AdminChantiersProps {
  className?: string;
}

export default function AdminChantiers({ className }: AdminChantiersProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const chantierStore = useChantierStore();

  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(10);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortDetails, setSortDetails] = React.useState<{
    order: boolean;
    sortKey: string;
  }>({
    order: true, // true = desc, false = asc
    sortKey: "created_at",
  });

  // Debounce search and pagination
  const { value: debouncedSearchTerm, loading: searching } = useDebounce(
    searchTerm,
    500
  );
  const { value: debouncedPage, loading: paging } = useDebounce(page, 300);
  const { value: debouncedSize, loading: resizing } = useDebounce(size, 300);
  const { value: debouncedSortDetails, loading: sorting } = useDebounce(
    sortDetails,
    300
  );

  const offset = (debouncedPage - 1) * debouncedSize;

  // Fetch projects for dropdown
  const { data: projectsData } = useQuery({
    queryKey: ["projects"],
    queryFn: () => admin.projects.list({ limit: 100 }),
  });

  const projects = projectsData?.projects || [];

  // Fetch chantiers
  const {
    data: chantiersResponse,
    isFetching: isChantiersPending,
    refetch: refetchChantiers,
  } = useQuery({
    queryKey: [
      "chantiers",
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      admin.chantiers.getChantiers({
        search: debouncedSearchTerm || undefined,
        limit: debouncedSize,
        offset,
        sortKey: debouncedSortDetails.sortKey,
        order: debouncedSortDetails.order ? "desc" : "asc",
      }),
  });

  const chantiers = React.useMemo(() => {
    if (!chantiersResponse) return [];
    return chantiersResponse.chantiers;
  }, [chantiersResponse]);

  const totalPageCount = React.useMemo(() => {
    if (!chantiersResponse) return 0;
    return Math.ceil((chantiersResponse.total || 0) / debouncedSize);
  }, [chantiersResponse, debouncedSize]);

  // Create chantier mutation
  const { mutate: createChantier, isPending: isCreationPending } = useMutation({
    mutationFn: (data: CreateChantierRequest) =>
      admin.chantiers.createChantier(data),
    onSuccess: () => {
      toast.success("Chantier créé avec succès");
      refetchChantiers();
      chantierStore.reset();
      closeCreateChantierSheet();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la création du chantier");
    },
  });

  // Update chantier mutation
  const { mutate: updateChantier, isPending: isUpdatePending } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateChantierRequest }) =>
      admin.chantiers.updateChantier(id, data),
    onSuccess: () => {
      toast.success("Chantier mis à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["chantiers"] });
      chantierStore.reset();
      closeUpdateChantierSheet();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la mise à jour du chantier");
    },
  });

  // Delete chantier mutation
  const { mutate: deleteChantier, isPending: isDeletionPending } = useMutation({
    mutationFn: (id: string) => admin.chantiers.deleteChantier(id),
    onSuccess: () => {
      toast.success("Chantier supprimé avec succès");
      queryClient.invalidateQueries({ queryKey: ["chantiers"] });
      chantierStore.reset();
      closeDeleteChantierDialog();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la suppression du chantier");
    },
  });

  const handleCreateSubmit = () => {
    const errors: Record<string, string> = {};
    const dto = chantierStore.createDto;

    if (!dto.project_id) errors.project_id = "Le projet est requis";
    if (!dto.name) errors.name = "Le nom est requis";
    if (!dto.location) errors.location = "La localisation est requise";

    if (Object.keys(errors).length > 0) {
      chantierStore.set("createDtoErrors", errors);
      toast.error("Veuillez corriger les erreurs du formulaire");
      return;
    }

    createChantier(dto);
  };

  const handleUpdateSubmit = () => {
    const chantier = chantierStore.response;
    if (!chantier) {
      toast.error("Aucun chantier sélectionné");
      return;
    }

    const errors: Record<string, string> = {};
    const dto = chantierStore.updateDto;

    if (dto.name !== undefined && !dto.name) {
      errors.name = "Le nom est requis";
    }
    if (dto.location !== undefined && !dto.location) {
      errors.location = "La localisation est requise";
    }

    if (Object.keys(errors).length > 0) {
      chantierStore.set("updateDtoErrors", errors);
      toast.error("Veuillez corriger les erreurs du formulaire");
      return;
    }

    updateChantier({ id: chantier.id, data: dto });
  };

  const {
    createChantierSheet,
    openCreateChantierSheet,
    closeCreateChantierSheet,
  } = useChantierCreateSheet({
    createChantier: handleCreateSubmit,
    isCreatePending: isCreationPending,
    resetChantier: () => chantierStore.reset(),
    projects,
  });

  const {
    updateChantierSheet,
    openUpdateChantierSheet,
    closeUpdateChantierSheet,
  } = useChantierUpdateSheet({
    updateChantier: handleUpdateSubmit,
    isUpdatePending: isUpdatePending,
    resetChantier: () => chantierStore.reset(),
    chantier: chantierStore.response,
    projects,
  });

  const {
    deleteChantierDialog,
    openDeleteChantierDialog,
    closeDeleteChantierDialog,
  } = useChantierDeleteDialog({
    chantierName: chantierStore.response?.name || "",
    deleteChantier: () => {
      const id = chantierStore.response?.id;
      if (id) {
        deleteChantier(id);
      }
    },
    isDeleting: isDeletionPending,
  });

  const context: DataTableConfig<ChantierWithCounts> = {
    singularName: "chantier",
    pluralName: "chantiers",
    createCallback: openCreateChantierSheet,
    inspectCallback: (chantier: ChantierWithCounts) => {
      router.push(`/admin/chantiers/${chantier.id}`);
    },
    updateCallback: (chantier: ChantierWithCounts) => {
      chantierStore.initializeUpdateDto(chantier);
      openUpdateChantierSheet();
    },
    deleteCallback: (chantier: ChantierWithCounts) => {
      chantierStore.set("response", chantier);
      openDeleteChantierDialog();
    },
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) =>
      setSortDetails({ order, sortKey }),
    targetEntity: (chantier: ChantierWithCounts) => {
      chantierStore.set("response", chantier);
      chantierStore.initializeUpdateDto(chantier);
    },
  };

  const columns = useChantierColumns(context);

  const isPending =
    isChantiersPending || paging || resizing || searching || sorting;

  return (
    <div className={cn("space-y-6", className)}>
      <DataTable<ChantierWithCounts, unknown>
        data={chantiers}
        columns={columns}
        context={context}
        isPending={isPending}
      />
      {createChantierSheet}
      {updateChantierSheet}
      {deleteChantierDialog}
    </div>
  );
}
