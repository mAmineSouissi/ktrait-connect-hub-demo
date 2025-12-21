import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/data-tables/data-table-column-header";
import { DataTableRowActions } from "@/components/shared/data-tables/data-table-row-actions";
import { DataTableConfig } from "@/components/shared/data-tables/types";
import { Badge } from "@/components/ui/badge";
import { Mail } from "lucide-react";
import type { UserListItem } from "@/types/user-management.types";
import { getUserStatus } from "@/types/user-management.types";

const roleMap: Record<string, string> = {
  admin: "Super Admin",
  client: "Client",
  partner: "Partenaire",
};

const statusMap: Record<string, string> = {
  Actif: "Actif",
  "En attente": "En attente",
  Inactif: "Inactif",
};

const approvalStatusMap: Record<string, string> = {
  pending: "En attente",
  approved: "Approuvé",
  rejected: "Rejeté",
};

const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("fr-FR");
};

export const useUserColumns = (
  context: DataTableConfig<UserListItem>
): ColumnDef<UserListItem>[] => {
  return [
    {
      accessorKey: "full_name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Utilisateur"
          attribute="full_name"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div>
            <p className="font-medium">{user.full_name}</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {user.email}
            </p>
          </div>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Rôle"
          attribute="role"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Badge variant="outline">{roleMap[user.role] || user.role}</Badge>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "approval_status",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Approbation"
          attribute="approval_status"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const user = row.original;
        const approvalStatus = user.approval_status || "pending";
        return (
          <Badge
            variant={
              approvalStatus === "approved"
                ? "default"
                : approvalStatus === "rejected"
                ? "destructive"
                : "secondary"
            }
          >
            {approvalStatusMap[approvalStatus] || approvalStatus}
          </Badge>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "is_active",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Statut"
          attribute="is_active"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const user = row.original;
        const status = getUserStatus(user);
        return (
          <Badge
            variant={
              status === "Actif"
                ? "default"
                : status === "Inactif"
                ? "secondary"
                : "outline"
            }
          >
            {statusMap[status] || status}
          </Badge>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "updated_at",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Dernière connexion"
          attribute="updated_at"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const user = row.original;
        // Using updated_at as a proxy for last login since we don't have a last_login field
        return <span>{formatDate(user.updated_at)}</span>;
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <DataTableRowActions row={row} context={context} />
        </div>
      ),
    },
  ];
};
