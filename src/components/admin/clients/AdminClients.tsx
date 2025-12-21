import React from "react";
import { api } from "@/api";
import { useDebounce } from "@/hooks/useDebounce";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useClientColumns } from "./columns/useClientColumns";
import { useClientCreateSheet } from "./modals/ClientCreateDialog";
import { useClientUpdateSheet } from "./modals/ClientUpdateDialog";
import { useClientDeleteDialog } from "./modals/useClientDeleteDialog";
import { toast } from "sonner";
import { useClientStore } from "@/hooks/stores/useClientStore";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/shared/data-tables/data-table";
import type {
  CreateClientRequest,
  UpdateClientRequest,
} from "@/types/client.types";
import type { DisplayClient } from "@/components/shared/Displays.types";
import { DataTableConfig } from "@/components/shared/data-tables/types";
import { useRouter } from "next/navigation";
import { transformUserToClient } from "@/lib/object.lib";

interface AdminClientsProps {
  className?: string;
}

export const AdminClients = ({ className }: AdminClientsProps) => {
  const router = useRouter();
  const clientStore = useClientStore();

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

  // Fetch clients
  const {
    data: clientsResponse,
    isFetching: isClientsPending,
    refetch: refetchClients,
  } = useQuery({
    queryKey: [
      "clients",
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      api.admin.clients.list({
        search: debouncedSearchTerm || undefined,
        limit: debouncedSize,
        offset,
        sortKey: debouncedSortDetails.sortKey,
        order: debouncedSortDetails.order ? "desc" : "asc",
      }),
  });

  const clients = React.useMemo(() => {
    if (!clientsResponse) return [];
    return clientsResponse.clients.map(transformUserToClient);
  }, [clientsResponse]);

  const totalPageCount = React.useMemo(() => {
    if (!clientsResponse) return 0;
    return Math.ceil((clientsResponse.total || 0) / debouncedSize);
  }, [clientsResponse, debouncedSize]);

  // Create client mutation
  const { mutate: createClient, isPending: isCreationPending } = useMutation({
    mutationFn: (data: CreateClientRequest) => {
      const password =
        data.password || `Temp${Math.random().toString(36).slice(-8)}!`;
      return api.admin.clients.create({
        ...data,
        password,
      });
    },
    onSuccess: () => {
      toast.success("Client créé avec succès");
      refetchClients();
      clientStore.reset();
      closeCreateClientSheet();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la création du client");
    },
  });

  // Update client mutation
  const { mutate: updateClient, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: { id: string; data: UpdateClientRequest }) =>
      api.admin.clients.update(data.id, data.data),
    onSuccess: () => {
      toast.success("Client modifié avec succès");
      refetchClients();
      clientStore.reset();
      closeUpdateClientSheet();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la modification du client");
    },
  });

  // Delete client mutation
  const { mutate: deleteClient, isPending: isDeletionPending } = useMutation({
    mutationFn: (id: string) => api.admin.clients.delete(id, false),
    onSuccess: () => {
      toast.success("Client supprimé avec succès");
      refetchClients();
      clientStore.reset();
      closeDeleteClientDialog();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la suppression du client");
    },
  });

  const handleCreateSubmit = () => {
    const data = clientStore.createDto;
    createClient(data);
  };

  const handleUpdateSubmit = () => {
    const data = clientStore.updateDto;
    const id = clientStore.response?.id;
    if (id) {
      updateClient({ id, data });
    }
  };

  const handleOpenEdit = async (client: DisplayClient) => {
    try {
      const { client: clientDetail } = await api.admin.clients.getById(
        client.id
      );
      clientStore.initializeUpdateDto(clientDetail);
      openUpdateClientSheet();
    } catch (error: any) {
      console.error("Error fetching client details:", error);
      toast.error("Erreur lors du chargement des détails du client");
    }
  };

  const { createClientSheet, openCreateClientSheet, closeCreateClientSheet } =
    useClientCreateSheet({
      createClient: handleCreateSubmit,
      isCreatePending: isCreationPending,
      resetClient: () => clientStore.reset(),
    });

  const { updateClientSheet, openUpdateClientSheet, closeUpdateClientSheet } =
    useClientUpdateSheet({
      updateClient: handleUpdateSubmit,
      isUpdatePending: isUpdatePending,
      resetClient: () => clientStore.reset(),
    });

  const {
    deleteClientDialog,
    openDeleteClientDialog,
    closeDeleteClientDialog,
  } = useClientDeleteDialog({
    clientName: clientStore.response?.full_name || "",
    deleteClient: () => {
      const id = clientStore.response?.id;
      if (id) {
        deleteClient(id);
      }
    },
    isDeleting: isDeletionPending,
  });

  const context: DataTableConfig<DisplayClient> = {
    singularName: "client",
    pluralName: "clients",
    createCallback: openCreateClientSheet,
    inspectCallback: (client: DisplayClient) => {
      router.push(`/admin/clients/${client.id}`);
    },
    updateCallback: (client: DisplayClient) => {
      handleOpenEdit(client);
    },
    deleteCallback: async (client: DisplayClient) => {
      try {
        const { client: clientDetail } = await api.admin.clients.getById(
          client.id
        );
        clientStore.set("response", clientDetail);
        openDeleteClientDialog();
      } catch (error: any) {
        console.error("Error fetching client details:", error);
        toast.error("Erreur lors du chargement des détails du client");
      }
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
    targetEntity: async (client: DisplayClient) => {
      try {
        const { client: clientDetail } = await api.admin.clients.getById(
          client.id
        );
        clientStore.set("response", clientDetail);
        clientStore.initializeUpdateDto(clientDetail);
      } catch (error: any) {
        console.error("Error fetching client details:", error);
      }
    },
  };

  const columns = useClientColumns(context);

  const isPending =
    isClientsPending || paging || resizing || searching || sorting;

  return (
    <div className={cn("flex flex-col overflow-hidden", className)}>
      <DataTable
        className="flex flex-col flex-1 overflow-hidden px-2"
        containerClassName="overflow-auto"
        columns={columns}
        data={clients}
        context={context}
        isPending={isPending}
        footerPagination={false}
      />
      {createClientSheet}
      {deleteClientDialog}
      {updateClientSheet}
    </div>
  );
};
