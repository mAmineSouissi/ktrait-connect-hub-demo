import React from "react";
import { api } from "@/api";
import { useDebounce } from "@/hooks/useDebounce";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePartnerColumns } from "./columns/usePartnerColumns";
import { usePartnerCreateSheet } from "./modals/PartnerCreateSheet";
import { usePartnerUpdateSheet } from "./modals/PartnerUpdateSheet";
import { usePartnerDeleteDialog } from "./modals/PartnerDeleteDialog";
import { toast } from "sonner";
import { usePartnerStore } from "@/hooks/stores/usePartnerStore";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/shared/data-tables/data-table";
import type {
  CreatePartnerRequest,
  UpdatePartnerRequest,
} from "@/api/admin/partners";
import type { PartnerWithCounts } from "@/api/admin/partners";
import { DataTableConfig } from "@/components/shared/data-tables/types";
import { useRouter } from "next/navigation";

interface AdminPartnersProps {
  className?: string;
}

export default function AdminPartners({ className }: AdminPartnersProps) {
  const queryClient = useQueryClient();
  const partnerStore = usePartnerStore();
  const router = useRouter();

  const [page, setPage] = React.useState(1);
  const { value: debouncedPage, loading: paging } = useDebounce<number>(
    page,
    500
  );

  const [size, setSize] = React.useState(10);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(
    size,
    500
  );

  const [sortDetails, setSortDetails] = React.useState({
    order: true, // true = desc, false = asc
    sortKey: "created_at",
  });
  const { value: debouncedSortDetails, loading: sorting } = useDebounce<
    typeof sortDetails
  >(sortDetails, 500);

  const [searchTerm, setSearchTerm] = React.useState("");
  const { value: debouncedSearchTerm, loading: searching } =
    useDebounce<string>(searchTerm, 500);

  // Calculate offset for pagination
  const offset = (debouncedPage - 1) * debouncedSize;

  // Fetch partners
  const {
    data: partnersResponse,
    isFetching: isPartnersPending,
    refetch: refetchPartners,
  } = useQuery({
    queryKey: [
      "partners",
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      api.admin.partners.list({
        search: debouncedSearchTerm || undefined,
        limit: debouncedSize,
        offset,
        sortKey: debouncedSortDetails.sortKey,
        order: debouncedSortDetails.order ? "desc" : "asc",
      }),
  });

  const partners = React.useMemo(() => {
    if (!partnersResponse) return [];
    return partnersResponse.partners;
  }, [partnersResponse]);

  const totalPageCount = React.useMemo(() => {
    if (!partnersResponse) return 0;
    return Math.ceil((partnersResponse.total || 0) / debouncedSize);
  }, [partnersResponse, debouncedSize]);

  // Create partner mutation
  const { mutate: createPartner, isPending: isCreationPending } = useMutation({
    mutationFn: (data: CreatePartnerRequest) => api.admin.partners.create(data),
    onSuccess: () => {
      toast.success("Partenaire créé avec succès");
      refetchPartners();
      partnerStore.reset();
      closeCreatePartnerSheet();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la création du partenaire");
    },
  });

  // Update partner mutation
  const { mutate: updatePartner, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: { id: string; partner: UpdatePartnerRequest }) =>
      api.admin.partners.update(data.id, data.partner),
    onSuccess: () => {
      toast.success("Partenaire modifié avec succès");
      refetchPartners();
      partnerStore.reset();
      closeUpdatePartnerSheet();
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Erreur lors de la modification du partenaire"
      );
    },
  });

  // Delete partner mutation
  const { mutate: deletePartner, isPending: isDeletionPending } = useMutation({
    mutationFn: (id: string) => api.admin.partners.delete(id),
    onSuccess: () => {
      toast.success("Partenaire supprimé avec succès");
      refetchPartners();
      partnerStore.reset();
      closeDeletePartnerDialog();
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Erreur lors de la suppression du partenaire"
      );
    },
  });

  const handleCreateSubmit = () => {
    const data = partnerStore.createDto;
    createPartner(data);
  };

  const handleUpdateSubmit = () => {
    const data = partnerStore.updateDto;
    const id = partnerStore.response?.id;
    if (id) {
      updatePartner({ id, partner: data });
    }
  };

  const {
    createPartnerSheet,
    openCreatePartnerSheet,
    closeCreatePartnerSheet,
  } = usePartnerCreateSheet({
    createPartner: handleCreateSubmit,
    isCreatePending: isCreationPending,
    resetPartner: () => partnerStore.reset(),
  });

  const {
    updatePartnerSheet,
    openUpdatePartnerSheet,
    closeUpdatePartnerSheet,
  } = usePartnerUpdateSheet({
    updatePartner: handleUpdateSubmit,
    isUpdatePending: isUpdatePending,
    resetPartner: () => partnerStore.reset(),
    partner: partnerStore.response,
  });

  const {
    deletePartnerDialog,
    openDeletePartnerDialog,
    closeDeletePartnerDialog,
  } = usePartnerDeleteDialog({
    partnerName: partnerStore.response?.name || "",
    deletePartner: () => {
      const id = partnerStore.response?.id;
      if (id) {
        deletePartner(id);
      }
    },
    isDeleting: isDeletionPending,
  });

  const context: DataTableConfig<PartnerWithCounts> = {
    singularName: "partenaire",
    pluralName: "partenaires",
    createCallback: openCreatePartnerSheet,
    inspectCallback: (partner: PartnerWithCounts) => {
      router.push(`/admin/partners/${partner.id}`);
    },
    updateCallback: (partner: PartnerWithCounts) => {
      partnerStore.initializeUpdateDto(partner as any);
      openUpdatePartnerSheet();
    },
    deleteCallback: (partner: PartnerWithCounts) => {
      partnerStore.set("response", partner as any);
      openDeletePartnerDialog();
    },
    //search, filtering, sorting & paging
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
    targetEntity: (partner: PartnerWithCounts) => {
      partnerStore.set("response", partner as any);
      partnerStore.initializeUpdateDto(partner as any);
    },
  };

  const columns = usePartnerColumns(context);

  const isPending =
    isPartnersPending || paging || resizing || searching || sorting;

  return (
    <div className={cn("flex flex-col overflow-hidden", className)}>
      <DataTable
        className="flex flex-col flex-1 overflow-hidden px-2"
        containerClassName="overflow-auto"
        columns={columns}
        data={partners}
        context={context}
        isPending={isPending}
        footerPagination={false}
      />
      {createPartnerSheet}
      {deletePartnerDialog}
      {updatePartnerSheet}
    </div>
  );
}
