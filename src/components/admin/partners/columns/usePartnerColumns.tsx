import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/data-tables/data-table-column-header";
import { DataTableRowActions } from "@/components/shared/data-tables/data-table-row-actions";
import { DataTableConfig } from "@/components/shared/data-tables/types";
import { Badge } from "@/components/ui/badge";
import { HardHat, Mail, Phone, MapPin, Briefcase } from "lucide-react";
import type { PartnerWithCounts } from "@/api/admin/partners";

// Partner type mapping for display
const partnerTypeMap: Record<string, string> = {
  architecte: "Architecte",
  bureau_études: "Bureau d'études",
  maître_d_œuvre: "Maître d'œuvre",
  artisan: "Artisan",
  fournisseur: "Fournisseur",
  autre: "Autre",
};

export const usePartnerColumns = (
  context: DataTableConfig<PartnerWithCounts>
): ColumnDef<PartnerWithCounts>[] => {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Partenaire"
          attribute="name"
          context={context}
        />
      ),
      enableSorting: true,
      cell: ({ row }) => {
        const partner = row.original;
        return (
          <div className="flex items-center gap-2">
            <HardHat className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">{partner.name}</p>
              {partner.contact_person && (
                <p className="text-xs text-muted-foreground">
                  {partner.contact_person}
                </p>
              )}
            </div>
          </div>
        );
      },
      enableHiding: true,
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Type"
          attribute="type"
          context={context}
        />
      ),
      enableSorting: true,
      cell: ({ row }) => {
        const type = row.original.type;
        return <Badge variant="outline">{partnerTypeMap[type] || type}</Badge>;
      },
      enableHiding: true,
    },
    {
      accessorKey: "contact",
      header: "Contact",
      cell: ({ row }) => {
        const partner = row.original;
        return (
          <div className="text-sm space-y-1">
            {partner.email && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Mail className="h-3 w-3" />
                <span className="text-xs">{partner.email}</span>
              </div>
            )}
            {partner.phone && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Phone className="h-3 w-3" />
                <span className="text-xs">{partner.phone}</span>
              </div>
            )}
            {!partner.email && !partner.phone && (
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
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "projects_count",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Projets"
          attribute="projects_count"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const count = row.original.projects_count || 0;
        return (
          <div className="flex items-center justify-end gap-1">
            <Briefcase className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">
              {count} projet{count !== 1 ? "s" : ""}
            </span>
          </div>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Statut"
          attribute="status"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge variant={status === "Actif" ? "default" : "secondary"}>
            {status}
          </Badge>
        );
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
