import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/data-tables/data-table-column-header";
import { DataTableRowActions } from "@/components/shared/data-tables/data-table-row-actions";
import { DataTableConfig } from "@/components/shared/data-tables/types";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Briefcase } from "lucide-react";
import type { DisplayClient } from "@/components/shared/Displays.types";

export const useClientColumns = (
  context: DataTableConfig<DisplayClient>
): ColumnDef<DisplayClient>[] => {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Client"
          attribute="full_name"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const client = row.original;
        return (
          <div className="flex items-center gap-2">
            <div>
              <p className="font-medium">{client.name}</p>
              {client.company_name && (
                <p className="text-xs text-muted-foreground">
                  {client.company_name}
                </p>
              )}
            </div>
          </div>
        );
      },
      enableHiding: true,
    },
    {
      accessorKey: "contact",
      header: "Contact",
      cell: ({ row }) => {
        const client = row.original;
        return (
          <div className="text-sm space-y-1">
            {client.email && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Mail className="h-3 w-3" />
                <span className="text-xs">{client.email}</span>
              </div>
            )}
            {client.phone && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Phone className="h-3 w-3" />
                <span className="text-xs">{client.phone}</span>
              </div>
            )}
            {!client.email && !client.phone && (
              <span className="text-muted-foreground">—</span>
            )}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "city",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Localisation"
          attribute="city"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const city = row.original.city;
        return city ? (
          <div className="flex items-center gap-1 text-sm">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            {city}
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
      enableHiding: true,
    },
    {
      accessorKey: "projects",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Projets"
          attribute="projects_count"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const count = row.original.projects || 0;
        return (
          <div className="flex items-center gap-1">
            <Briefcase className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">
              {count} projet{count !== 1 ? "s" : ""}
            </span>
          </div>
        );
      },
      enableHiding: true,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Statut"
          attribute="is_active"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant={
              status === "Actif"
                ? "default"
                : status === "En attente"
                ? "secondary"
                : "outline"
            }
          >
            {status}
          </Badge>
        );
      },
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
