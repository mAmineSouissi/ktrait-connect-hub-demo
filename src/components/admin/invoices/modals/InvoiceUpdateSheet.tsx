"use client";

import { useSheet } from "@/components/shared/Sheets";
import { Pencil } from "lucide-react";
import { InvoiceUpdateForm } from "../forms/InvoiceUpdateForm";
import type { UpdateInvoiceRequest } from "@/types/invoice.types";
import type { InvoiceWithDetails } from "@/types/invoice.types";
import type { UserListItem } from "@/types/user-management.types";
import type { Project } from "@/types/project.types";
import type { InvoiceTemplate } from "@/types/invoice-template.types";

interface UseInvoiceUpdateSheetOptions {
  updateInvoice: (data: UpdateInvoiceRequest) => void | Promise<void>;
  isUpdatePending?: boolean;
  resetInvoice?: () => void;
  invoice?: InvoiceWithDetails | null;
  clients?: UserListItem[];
  projects?: Project[];
  templates?: InvoiceTemplate[];
}

export const useInvoiceUpdateSheet = ({
  updateInvoice,
  isUpdatePending = false,
  resetInvoice,
  invoice,
  clients = [],
  projects = [],
  templates = [],
}: UseInvoiceUpdateSheetOptions) => {
  const {
    SheetFragment: updateInvoiceSheet,
    openSheet: openUpdateInvoiceSheet,
    closeSheet: closeUpdateInvoiceSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <Pencil className="h-4 w-4" />
        Modifier la {invoice?.type === "devis" ? "Devis" : "Facture"}
      </div>
    ),
    description: `Modifier le ${
      invoice?.type === "devis" ? "devis" : "facture"
    } ${invoice?.invoice_number || ""}`,
    children: (
      <InvoiceUpdateForm
        className="my-4"
        updateInvoice={updateInvoice}
        isUpdatePending={isUpdatePending}
        invoice={invoice}
        clients={clients}
        projects={projects}
        templates={templates}
      />
    ),
    className: "min-w-[60vw] flex flex-col flex-1 overflow-hidden",
    onToggle: () => {
      resetInvoice?.();
    },
  });

  return {
    updateInvoiceSheet,
    openUpdateInvoiceSheet,
    closeUpdateInvoiceSheet,
  };
};
