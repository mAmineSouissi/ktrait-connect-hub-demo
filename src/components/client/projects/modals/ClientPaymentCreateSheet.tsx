"use client";

import React from "react";
import { CreditCard } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { ClientPaymentCreateForm } from "../forms/ClientPaymentCreateForm";
import type { CreatePaymentRequest } from "@/api/client/payments";

interface UseClientPaymentCreateSheetOptions {
  createPayment?: (data: CreatePaymentRequest) => void | Promise<void>;
  isCreatePending?: boolean;
  resetPayment?: () => void;
  projectId: string;
}

export const useClientPaymentCreateSheet = ({
  createPayment,
  isCreatePending = false,
  resetPayment,
  projectId,
}: UseClientPaymentCreateSheetOptions) => {
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
      <ClientPaymentCreateForm
        className="my-4"
        createPayment={createPayment}
        isCreatePending={isCreatePending}
        projectId={projectId}
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

