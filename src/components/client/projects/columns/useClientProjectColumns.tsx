import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/data-tables/data-table-column-header";
import { DataTableRowActions } from "@/components/shared/data-tables/data-table-row-actions";
import { DataTableConfig } from "@/components/shared/data-tables/types";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import type { Project } from "@/types/project.types";
import {
  PROJECT_CATEGORY_LABELS,
  type ProjectCategoryType,
} from "@/types/enums/project-category.enum";
import {
  PROJECT_TYPE_LABELS,
  type ProjectTypeType,
} from "@/types/enums/project-type.enum";

const statusMap: Record<string, string> = {
  planifié: "Planifié",
  en_cours: "En cours",
  en_attente: "En attente",
  terminé: "Terminé",
  annulé: "Annulé",
};

const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("fr-FR");
};

const formatBudget = (budget: number | null | undefined) => {
  if (!budget) return "N/A";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(budget);
};

export const useClientProjectColumns = (
  context: DataTableConfig<Project>
): ColumnDef<Project>[] => {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Projet"
          attribute="name"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const project = row.original;
        return (
          <div>
            <p className="font-medium">{project.name}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(project.start_date)}
            </p>
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
        const project = row.original;
        return (
          <div className="flex items-center gap-2">
            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <span className="text-sm">{project.progress}%</span>
          </div>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "estimated_budget",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Budget"
          attribute="estimated_budget"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const project = row.original;
        return <span>{formatBudget(project.estimated_budget)}</span>;
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
        const project = row.original;
        return (
          <Badge
            variant={
              project.status === "en_cours"
                ? "default"
                : project.status === "terminé"
                ? "secondary"
                : project.status === "planifié"
                ? "outline"
                : "destructive"
            }
          >
            {statusMap[project.status] || project.status}
          </Badge>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Catégorie"
          attribute="category"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const project = row.original;
        const category = (project as any).category as
          | ProjectCategoryType
          | undefined;
        if (!category)
          return <span className="text-muted-foreground">N/A</span>;
        return (
          <Badge variant="outline" className="text-xs">
            {PROJECT_CATEGORY_LABELS[category]}
          </Badge>
        );
      },
      enableSorting: true,
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
      cell: ({ row }) => {
        const project = row.original;
        const type = (project as any).type as ProjectTypeType | undefined;
        if (!type) return <span className="text-muted-foreground">N/A</span>;
        return (
          <Badge variant="outline" className="text-xs">
            {PROJECT_TYPE_LABELS[type]}
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

