"use client";

import React from "react";
import { Receipt } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { ClientExpenseUpdateForm } from "../forms/ClientExpenseUpdateForm";
import type { ExpenseWithDetails } from "@/types/expense.types";

interface UseClientExpenseUpdateSheetOptions {
  updateExpense?: (data: { id: string; data: any }) => void | Promise<void>;
  isUpdatePending?: boolean;
  resetExpense?: () => void;
  expense?: ExpenseWithDetails | null;
}

export const useClientExpenseUpdateSheet = ({
  updateExpense,
  isUpdatePending = false,
  resetExpense,
  expense,
}: UseClientExpenseUpdateSheetOptions) => {
  const {
    SheetFragment: updateExpenseSheet,
    openSheet: openUpdateExpenseSheet,
    closeSheet: closeUpdateExpenseSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <Receipt className="h-4 w-4" />
        Modifier la Dépense
      </div>
    ),
    description: "Modifier les informations de la dépense",
    children: (
      <ClientExpenseUpdateForm
        className="my-4"
        updateExpense={updateExpense}
        isUpdatePending={isUpdatePending}
        expense={expense}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: () => {
      resetExpense?.();
    },
  });

  return {
    updateExpenseSheet,
    openUpdateExpenseSheet,
    closeUpdateExpenseSheet,
  };
};

