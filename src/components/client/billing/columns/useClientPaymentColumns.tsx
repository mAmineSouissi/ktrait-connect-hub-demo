import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/data-tables/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Euro } from "lucide-react";
import type { PaymentWithDetails } from "@/types/payment.types";
import { formatAmount } from "@/lib/currency.util";
import { formatDate } from "@/lib/date.util";
import { DataTableConfig } from "@/components/shared/data-tables/types";

const paymentStatusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  en_attente: "outline",
  payé: "default",
  partiel: "secondary",
  annulé: "destructive",
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case "payé":
      return "Payé";
    case "en_attente":
      return "En attente";
    case "partiel":
      return "Partiel";
    case "annulé":
      return "Annulé";
    default:
      return status;
  }
};

export const useClientPaymentColumns = (
  context: DataTableConfig<PaymentWithDetails>
): ColumnDef<PaymentWithDetails>[] => {
  return [
    {
      accessorKey: "date",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Date"
          attribute="date"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const date = row.original.date;
        if (!date) {
          return <span className="text-muted-foreground">—</span>;
        }
        try {
          const dateObj = new Date(date);
          if (isNaN(dateObj.getTime())) {
            return <span className="text-muted-foreground">—</span>;
          }
          return formatDate(date);
        } catch {
          return <span className="text-muted-foreground">—</span>;
        }
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
          <span className="font-medium">{projectName}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Montant"
          attribute="amount"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const amount = row.original.amount;
        return (
          <div className="flex items-center gap-1 font-medium">
            <Euro className="h-3 w-3 text-muted-foreground" />
            {formatAmount(amount)}
          </div>
        );
      },
      enableHiding: true,
    },
    {
      accessorKey: "payment_method",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Méthode"
          attribute="payment_method"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const method = row.original.payment_method;
        return method ? (
          <span className="text-sm">{method}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
      enableHiding: true,
    },
    {
      accessorKey: "reference",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Référence"
          attribute="reference"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const reference = row.original.reference;
        return reference ? (
          <span className="text-sm font-mono">{reference}</span>
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
        const variant = paymentStatusVariants[status] || "outline";
        return <Badge variant={variant}>{getStatusLabel(status)}</Badge>;
      },
      enableHiding: true,
    },
  ];
};

