"use client";

import React from "react";
import { CreditCard } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { ClientPaymentUpdateForm } from "../forms/ClientPaymentUpdateForm";
import type { UpdatePaymentRequest } from "@/api/client/payments";
import type { PaymentWithDetails } from "@/types/payment.types";

interface UseClientPaymentUpdateSheetOptions {
  updatePayment?: (data: {
    id: string;
    data: UpdatePaymentRequest;
  }) => void | Promise<void>;
  isUpdatePending?: boolean;
  resetPayment?: () => void;
  payment?: PaymentWithDetails | null;
  projectId: string;
}

export const useClientPaymentUpdateSheet = ({
  updatePayment,
  isUpdatePending = false,
  resetPayment,
  payment,
  projectId,
}: UseClientPaymentUpdateSheetOptions) => {
  const {
    SheetFragment: updatePaymentSheet,
    openSheet: openUpdatePaymentSheet,
    closeSheet: closeUpdatePaymentSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <CreditCard className="h-4 w-4" />
        Modifier le Paiement
      </div>
    ),
    description: "Modifier les informations du paiement",
    children: (
      <ClientPaymentUpdateForm
        className="my-4"
        updatePayment={updatePayment}
        isUpdatePending={isUpdatePending}
        payment={payment}
        projectId={projectId}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: () => {
      resetPayment?.();
    },
  });

  return {
    updatePaymentSheet,
    openUpdatePaymentSheet,
    closeUpdatePaymentSheet,
  };
};

