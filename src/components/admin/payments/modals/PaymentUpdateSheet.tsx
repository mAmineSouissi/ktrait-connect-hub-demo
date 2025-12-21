"use client";

import React from "react";
import { CreditCard } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { PaymentUpdateForm } from "../forms/PaymentUpdateForm";
import type { UpdatePaymentRequest } from "@/api/admin/payments";
import type { PaymentWithDetails } from "@/types/payment.types";
import type { Project } from "@/types/project.types";
import type { UserListItem } from "@/types/user-management.types";

interface UsePaymentUpdateSheetOptions {
  updatePayment?: (data: {
    id: string;
    data: UpdatePaymentRequest;
  }) => void | Promise<void>;
  isUpdatePending?: boolean;
  resetPayment?: () => void;
  payment?: PaymentWithDetails | null;
  projects?: Project[];
  clients?: UserListItem[];
}

export const usePaymentUpdateSheet = ({
  updatePayment,
  isUpdatePending = false,
  resetPayment,
  payment,
  projects = [],
  clients = [],
}: UsePaymentUpdateSheetOptions) => {
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
      <PaymentUpdateForm
        className="my-4"
        updatePayment={updatePayment}
        isUpdatePending={isUpdatePending}
        payment={payment}
        projects={projects}
        clients={clients}
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
