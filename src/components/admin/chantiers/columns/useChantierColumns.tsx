import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/data-tables/data-table-column-header";
import { DataTableRowActions } from "@/components/shared/data-tables/data-table-row-actions";
import { DataTableConfig } from "@/components/shared/data-tables/types";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, Briefcase } from "lucide-react";
import type { ChantierWithCounts } from "@/types/chantier.types";

const statusMap: Record<string, string> = {
  planifié: "Planifié",
  en_cours: "En cours",
  en_attente: "En attente",
  terminé: "Terminé",
  suspendu: "Suspendu",
};

const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("fr-FR");
};

export const useChantierColumns = (
  context: DataTableConfig<ChantierWithCounts>
): ColumnDef<ChantierWithCounts>[] => {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Chantier"
          attribute="name"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const chantier = row.original;
        return (
          <div>
            <p className="font-medium">{chantier.name}</p>
            {chantier.project && (
              <p className="text-xs text-muted-foreground">
                Projet: {chantier.project.name}
              </p>
            )}
          </div>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "location",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Localisation"
          attribute="location"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const location = row.original.location;
        return (
          <div className="flex items-center gap-1 text-sm">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="max-w-[200px] truncate">{location}</span>
          </div>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "progress",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Avancement"
          attribute="progress"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const chantier = row.original;
        return (
          <div className="flex items-center gap-2">
            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${chantier.progress}%` }}
              />
            </div>
            <span className="text-sm">{chantier.progress}%</span>
          </div>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "dates",
      header: "Période",
      cell: ({ row }) => {
        const chantier = row.original;
        return (
          <div className="flex items-center gap-1 text-sm">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <div className="text-xs">
              <p>{formatDate(chantier.start_date)}</p>
              <p className="text-muted-foreground">
                → {formatDate(chantier.end_date)}
              </p>
            </div>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "team_count",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Équipe"
          attribute="team_count"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const count = row.original.team_count || 0;
        return (
          <div className="flex items-center justify-center gap-1">
            <Users className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">
              {count} personne{count !== 1 ? "s" : ""}
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
        const chantier = row.original;
        return (
          <Badge
            variant={
              chantier.status === "en_cours"
                ? "default"
                : chantier.status === "terminé"
                ? "secondary"
                : chantier.status === "planifié"
                ? "outline"
                : chantier.status === "suspendu"
                ? "destructive"
                : "outline"
            }
          >
            {statusMap[chantier.status] || chantier.status}
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
