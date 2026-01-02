import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/data-tables/data-table-column-header";
import { DataTableConfig } from "@/components/shared/data-tables/types";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useRouter } from "next/router";
import type { PartnerProject } from "@/api/partner/projects";

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  planifié: "outline",
  "en_cours": "default",
  "en_pause": "secondary",
  terminé: "secondary",
  annulé: "destructive",
};

const statusLabels: Record<string, string> = {
  planifié: "Planifié",
  "en_cours": "En cours",
  "en_pause": "En pause",
  terminé: "Terminé",
  annulé: "Annulé",
};

const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "—";
  try {
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) {
      return "—";
    }
    return dateObj.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return "—";
  }
};

const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

export const usePartnerProjectColumns = (
  context: DataTableConfig<PartnerProject>
): ColumnDef<PartnerProject>[] => {
  const router = useRouter();

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
          <div className="space-y-1">
            <div className="font-medium">{project.name}</div>
            {project.client_name && (
              <div className="text-sm text-muted-foreground">
                {project.client_name}
              </div>
            )}
          </div>
        );
      },
      enableHiding: false,
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
        const role = row.original.role;
        return role ? (
          <Badge variant="outline">{role}</Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
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
          attribute="status"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const status = row.original.status;
        const variant = statusVariants[status] || "outline";
        const label = statusLabels[status] || status;
        return <Badge variant={variant}>{label}</Badge>;
      },
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
        const progress = row.original.progress;
        return (
          <div className="space-y-1 w-32">
            <div className="flex justify-between text-xs">
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        );
      },
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
        return formatCurrency(row.original.estimated_budget);
      },
      enableHiding: true,
    },
    {
      accessorKey: "end_date",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Échéance"
          attribute="end_date"
          context={context}
        />
      ),
      cell: ({ row }) => {
        return formatDate(row.original.end_date);
      },
      enableHiding: true,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const project = row.original;
        return (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/partner/projects/${project.id}`)}
              title="Voir les détails"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        );
      },
      enableHiding: false,
    },
  ];
};

