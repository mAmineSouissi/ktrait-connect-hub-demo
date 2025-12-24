"use client";

import React from "react";
import { CreditCard } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { PaymentCreateForm } from "@/components/admin/payments/forms/PaymentCreateForm";
import type { CreatePaymentRequest } from "@/api/admin/payments";
import type { Project } from "@/types/project.types";
import type { UserListItem } from "@/types/user-management.types";

interface UsePaymentCreateSheetOptions {
  createPayment?: (data: CreatePaymentRequest) => void | Promise<void>;
  isCreatePending?: boolean;
  resetPayment?: () => void;
  projects?: Project[];
  clients?: UserListItem[];
  defaultProjectId?: string;
  defaultClientId?: string;
}

export const usePaymentCreateSheet = ({
  createPayment,
  isCreatePending = false,
  resetPayment,
  projects = [],
  clients = [],
  defaultProjectId,
  defaultClientId,
}: UsePaymentCreateSheetOptions) => {
  const {
    SheetFragment: createPaymentSheet,
    openSheet: openCreatePaymentSheet,
    closeSheet: closeCreatePaymentSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <CreditCard className="h-4 w-4" />
        Nouveau Paiement
      </div>
    ),
    description: "Enregistrer un nouveau paiement",
    children: (
      <PaymentCreateForm
        className="my-4"
        createPayment={createPayment}
        isCreatePending={isCreatePending}
        projects={projects}
        clients={clients}
        defaultProjectId={defaultProjectId}
        defaultClientId={defaultClientId}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: () => {
      resetPayment?.();
    },
  });

  return {
    createPaymentSheet,
    openCreatePaymentSheet,
    closeCreatePaymentSheet,
  };
};

