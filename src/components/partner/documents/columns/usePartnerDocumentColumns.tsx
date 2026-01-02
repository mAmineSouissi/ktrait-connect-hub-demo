import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/data-tables/data-table-column-header";
import { DataTableRowActions } from "@/components/shared/data-tables/data-table-row-actions";
import { DataTableConfig } from "@/components/shared/data-tables/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye } from "lucide-react";
import type { DocumentWithDetails } from "@/types/document.types";

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  en_attente: "outline",
  validé: "default",
  rejeté: "destructive",
};

const statusLabels: Record<string, string> = {
  en_attente: "En attente",
  validé: "Validé",
  rejeté: "Rejeté",
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

export const usePartnerDocumentColumns = (
  context: DataTableConfig<DocumentWithDetails>
): ColumnDef<DocumentWithDetails>[] => {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Document"
          attribute="name"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const document = row.original;
        return (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{document.name}</span>
          </div>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "project_name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Projet"
          attribute="project_name"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const projectName = row.original.project_name;
        return projectName ? (
          <span className="text-sm">{projectName}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "folder",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Dossier"
          attribute="folder"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const folder = row.original.folder;
        return folder ? (
          <Badge variant="outline">{folder}</Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
      enableHiding: true,
    },
    {
      accessorKey: "file_type",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Type"
          attribute="file_type"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const fileType = row.original.file_type;
        return fileType ? (
          <Badge variant="secondary">{fileType}</Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
      enableHiding: true,
    },
    {
      accessorKey: "file_size",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Taille"
          attribute="file_size"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const fileSize = row.original.file_size;
        return fileSize ? (
          <span className="text-sm">{fileSize}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
      enableHiding: true,
    },
    {
      accessorKey: "uploaded_at",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Date"
          attribute="uploaded_at"
          context={context}
        />
      ),
      cell: ({ row }) => {
        return formatDate(row.original.uploaded_at);
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
      id: "actions",
      cell: ({ row }) => {
        const document = row.original;
        return (
          <div className="flex justify-end gap-1">
            {document.file_url && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  title="Voir"
                >
                  <a
                    href={document.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Eye className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  title="Télécharger"
                >
                  <a
                    href={document.file_url}
                    download
                    rel="noopener noreferrer"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
              </>
            )}
            <DataTableRowActions row={row} context={context} />
          </div>
        );
      },
      enableHiding: false,
    },
  ];
};


