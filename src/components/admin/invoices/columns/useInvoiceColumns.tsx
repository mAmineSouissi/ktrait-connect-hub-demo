import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/data-tables/data-table-column-header";
import { DataTableRowActions } from "@/components/shared/data-tables/data-table-row-actions";
import { DataTableConfig } from "@/components/shared/data-tables/types";
import { Badge } from "@/components/ui/badge";
import { FileText, Euro } from "lucide-react";
import type { Invoice } from "@/types/invoice.types";
import { INVOICE_STATUS_LABELS, INVOICE_TYPE_LABELS } from "@/types/enums";

export const useInvoiceColumns = (
  context: DataTableConfig<Invoice>
): ColumnDef<Invoice>[] => {
  return [
    {
      accessorKey: "invoice_number",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="N°"
          attribute="invoice_number"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const invoice = row.original;
        return (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{invoice.invoice_number}</span>
          </div>
        );
      },
      enableHiding: false,
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
        const type = row.original.type;
        return (
          <Badge variant={type === "devis" ? "secondary" : "default"}>
            {INVOICE_TYPE_LABELS[type]}
          </Badge>
        );
      },
      enableHiding: true,
    },
    {
      accessorKey: "client",
      header: "Client",
      cell: ({ row }) => {
        const client = row.original.client;
        return client ? (
          <div>
            <p className="font-medium">{client.full_name}</p>
            {client.email && (
              <p className="text-xs text-muted-foreground">{client.email}</p>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "project",
      header: "Projet",
      cell: ({ row }) => {
        const project = row.original.project;
        return project ? (
          <span className="text-sm">{project.name}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "total_amount",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Montant"
          attribute="total_amount"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const amount = row.original.total_amount;
        return (
          <div className="flex items-center gap-1 font-medium">
            <Euro className="h-3 w-3 text-muted-foreground" />
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
              minimumFractionDigits: 2,
            }).format(amount)}
          </div>
        );
      },
      enableHiding: true,
    },
    {
      accessorKey: "issue_date",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Date"
          attribute="issue_date"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const date = row.original.issue_date;
        if (!date) {
          return <span className="text-muted-foreground">—</span>;
        }
        try {
          const dateObj = new Date(date);
          // Check if date is valid
          if (isNaN(dateObj.getTime())) {
            return <span className="text-muted-foreground">—</span>;
          }
          return dateObj.toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
        } catch {
          return <span className="text-muted-foreground">—</span>;
        }
      },
      enableHiding: true,
    },
    {
      accessorKey: "due_date",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Échéance"
          attribute="due_date"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const dueDate = row.original.due_date;
        if (!dueDate) {
          return <span className="text-muted-foreground">—</span>;
        }
        try {
          const dateObj = new Date(dueDate);
          // Check if date is valid
          if (isNaN(dateObj.getTime())) {
            return <span className="text-muted-foreground">—</span>;
          }
          return dateObj.toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
        } catch {
          return <span className="text-muted-foreground">—</span>;
        }
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
        const statusLabel = INVOICE_STATUS_LABELS[status];
        const variant =
          status === "paid" || status === "validated"
            ? "default"
            : status === "overdue" || status === "rejected"
            ? "destructive"
            : status === "sent"
            ? "secondary"
            : "outline";
        return <Badge variant={variant}>{statusLabel}</Badge>;
      },
      enableHiding: true,
    },
    {
      id: "actions",
      cell: ({ row }) => <DataTableRowActions row={row} context={context} />,
      enableHiding: false,
    },
  ];
};
