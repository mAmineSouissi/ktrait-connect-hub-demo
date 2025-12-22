"use client";

import { useSheet } from "@/components/shared/Sheets";
import { FileText } from "lucide-react";
import { InvoiceCreateForm } from "../forms/InvoiceCreateForm";
import type { CreateInvoiceRequest } from "@/types/invoice.types";
import type { UserListItem } from "@/types/user-management.types";
import type { Project } from "@/types/project.types";
import type { InvoiceTemplate } from "@/types/invoice-template.types";

interface UseInvoiceCreateSheetOptions {
  createInvoice: (data: CreateInvoiceRequest) => void | Promise<void>;
  isCreatePending?: boolean;
  resetInvoice?: () => void;
  clients?: UserListItem[];
  projects?: Project[];
  templates?: InvoiceTemplate[];
  defaultType?: "devis" | "facture";
}

export const useInvoiceCreateSheet = ({
  createInvoice,
  isCreatePending = false,
  resetInvoice,
  clients = [],
  projects = [],
  templates = [],
  defaultType = "devis",
}: UseInvoiceCreateSheetOptions) => {
  const {
    SheetFragment: createInvoiceSheet,
    openSheet: openCreateInvoiceSheet,
    closeSheet: closeCreateInvoiceSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        Nouveau {defaultType === "devis" ? "Devis" : "Facture"}
      </div>
    ),
    description: `Créer un nouveau ${
      defaultType === "devis" ? "devis" : "facture"
    }`,
    children: (
      <InvoiceCreateForm
        className="my-4"
        createInvoice={createInvoice}
        isCreatePending={isCreatePending}
        clients={clients}
        projects={projects}
        templates={templates}
        defaultType={defaultType}
      />
    ),
    className: "min-w-[60vw] flex flex-col flex-1 overflow-hidden",
    onToggle: () => {
      resetInvoice?.();
    },
  });

  return {
    createInvoiceSheet,
    openCreateInvoiceSheet,
    closeCreateInvoiceSheet,
  };
};
