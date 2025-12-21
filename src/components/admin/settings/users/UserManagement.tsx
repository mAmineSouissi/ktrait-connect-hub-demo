"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/shared/data-tables/data-table";
import { DataTableConfig } from "@/components/shared/data-tables/types";
import { useUserColumns } from "./columns/useUserColumns";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { useUserCreateSheet } from "./modals/useUserCreateSheet";
import { useUserUpdateSheet } from "./modals/useUserUpdateSheet";
import { useUserDeleteDialog } from "./modals/useUserDeleteDialog";
import { useDebounce } from "@/hooks/useDebounce";
import { api } from "@/api";
import { CheckCircle2, XCircle } from "lucide-react";
import type { UserListItem } from "@/types/user-management.types";
import type {
  CreateUserRequest,
  UpdateUserRequest,
} from "@/types/user-management.types";

interface UserManagementProps {
  className?: string;
}

export const UserManagement = ({ className }: UserManagementProps) => {
  const queryClient = useQueryClient();
  const userStore = useUserStore();

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

  // Fetch users
  const {
    data: usersResponse,
    isFetching: isUsersPending,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: [
      "users",
      "management",
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      api.admin.users.list({
        search: debouncedSearchTerm || undefined,
        limit: debouncedSize,
        offset,
        sortKey: debouncedSortDetails.sortKey,
        order: debouncedSortDetails.order ? "desc" : "asc",
      }),
  });

  const users = React.useMemo(() => {
    if (!usersResponse) return [];
    return usersResponse.users;
  }, [usersResponse]);

  const totalPageCount = React.useMemo(() => {
    if (!usersResponse) return 0;
    return Math.ceil((usersResponse.total || 0) / debouncedSize);
  }, [usersResponse, debouncedSize]);

  // Create user mutation
  const { mutate: createUser, isPending: isCreationPending } = useMutation({
    mutationFn: (data: CreateUserRequest) => {
      const password =
        data.password || `Temp${Math.random().toString(36).slice(-8)}!`;
      return api.admin.users.create({
        ...data,
        password,
      });
    },
    onSuccess: () => {
      toast.success("Utilisateur créé avec succès");
      refetchUsers();
      userStore.reset();
      closeCreateUserSheet();
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Erreur lors de la création de l'utilisateur"
      );
    },
  });

  // Update user mutation
  const { mutate: updateUser, isPending: isUpdatePending } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      api.admin.users.update(id, data),
    onSuccess: () => {
      toast.success("Utilisateur modifié avec succès");
      refetchUsers();
      userStore.reset();
      closeUpdateUserSheet();
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Erreur lors de la modification de l'utilisateur"
      );
    },
  });

  // Delete user mutation
  const { mutate: deleteUser, isPending: isDeletionPending } = useMutation({
    mutationFn: (id: string) => api.admin.users.delete(id, false),
    onSuccess: () => {
      toast.success("Utilisateur supprimé avec succès");
      refetchUsers();
      userStore.reset();
      closeDeleteUserDialog();
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Erreur lors de la suppression de l'utilisateur"
      );
    },
  });

  const handleCreateSubmit = () => {
    const data = userStore.createDto;
    createUser(data);
  };

  const handleUpdateSubmit = () => {
    const data = userStore.updateDto;
    const id = userStore.response?.id;
    if (id) {
      updateUser({ id, data });
    }
  };

  const handleOpenEdit = async (user: UserListItem) => {
    try {
      const { user: userDetail } = await api.admin.users.getById(user.id);
      userStore.set("response", userDetail);
      userStore.initializeUpdateDto(userDetail);
      openUpdateUserSheet();
    } catch (error: any) {
      console.error("Error fetching user details:", error);
      toast.error("Erreur lors du chargement des détails de l'utilisateur");
    }
  };

  const handleApproveUser = async (user: UserListItem) => {
    try {
      await api.admin.users.update(user.id, {
        approval_status: "approved",
      });
      toast.success("Utilisateur approuvé avec succès");
      refetchUsers();
    } catch (error: any) {
      console.error("Error approving user:", error);
      toast.error(error.message || "Erreur lors de l'approbation");
    }
  };

  const handleRejectUser = async (user: UserListItem) => {
    try {
      await api.admin.users.update(user.id, {
        approval_status: "rejected",
      });
      toast.success("Utilisateur rejeté");
      refetchUsers();
    } catch (error: any) {
      console.error("Error rejecting user:", error);
      toast.error(error.message || "Erreur lors du rejet");
    }
  };

  const { createUserSheet, openCreateUserSheet, closeCreateUserSheet } =
    useUserCreateSheet({
      createUser: handleCreateSubmit,
      isCreatePending: isCreationPending,
      resetUser: () => userStore.reset(),
    });

  const { updateUserSheet, openUpdateUserSheet, closeUpdateUserSheet } =
    useUserUpdateSheet({
      updateUser: handleUpdateSubmit,
      isUpdatePending: isUpdatePending,
      resetUser: () => userStore.reset(),
      user: userStore.response,
    });

  const { deleteUserDialog, openDeleteUserDialog, closeDeleteUserDialog } =
    useUserDeleteDialog({
      userName: userStore.response?.full_name || "",
      deleteUser: () => {
        const id = userStore.response?.id;
        if (id) {
          deleteUser(id);
        }
      },
      isDeleting: isDeletionPending,
    });

  const context: DataTableConfig<UserListItem> = {
    singularName: "utilisateur",
    pluralName: "utilisateurs",
    createCallback: openCreateUserSheet,
    inspectCallback: undefined, // No detail page for users in settings
    updateCallback: handleOpenEdit,
    deleteCallback: async (user: UserListItem) => {
      try {
        const { user: userDetail } = await api.admin.users.getById(user.id);
        userStore.set("response", userDetail);
        openDeleteUserDialog();
      } catch (error: any) {
        console.error("Error fetching user details:", error);
        toast.error("Erreur lors du chargement des détails de l'utilisateur");
      }
    },
    additionalActions: {
      0: [
        {
          actionLabel: "Approuver",
          actionIcon: <CheckCircle2 className="h-4 w-4 text-green-600" />,
          actionCallback: handleApproveUser,
          isActionVisible: (user: UserListItem) =>
            user.role !== "admin" &&
            (user.approval_status !== "approved" || !user.approval_status),
        },
        {
          actionLabel: "Rejeter",
          actionIcon: <XCircle className="h-4 w-4 text-red-600" />,
          actionCallback: handleRejectUser,
          isActionVisible: (user: UserListItem) =>
            user.role !== "admin" && user.approval_status !== "rejected",
        },
      ],
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
    targetEntity: async (user: UserListItem) => {
      try {
        const { user: userDetail } = await api.admin.users.getById(user.id);
        userStore.set("response", userDetail);
        userStore.initializeUpdateDto(userDetail);
      } catch (error: any) {
        console.error("Error fetching user details:", error);
      }
    },
  };

  const columns = useUserColumns(context);

  const isPending =
    isUsersPending || paging || resizing || searching || sorting;

  return (
    <div className={cn("flex flex-col overflow-hidden", className)}>
      <DataTable
        className="flex flex-col flex-1 overflow-hidden px-2"
        containerClassName="overflow-auto"
        columns={columns}
        data={users}
        context={context}
        isPending={isPending}
        footerPagination={false}
      />
      {createUserSheet}
      {deleteUserDialog}
      {updateUserSheet}
    </div>
  );
};
