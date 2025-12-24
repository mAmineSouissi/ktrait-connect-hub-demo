"use client";

import React from "react";
import { Receipt } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { ClientExpenseCreateForm } from "../forms/ClientExpenseCreateForm";
import type { CreateExpenseRequest } from "@/api/client/expenses";

interface UseClientExpenseCreateSheetOptions {
  createExpense?: (data: CreateExpenseRequest) => void | Promise<void>;
  isCreatePending?: boolean;
  resetExpense?: () => void;
  projectId: string;
}

export const useClientExpenseCreateSheet = ({
  createExpense,
  isCreatePending = false,
  resetExpense,
  projectId,
}: UseClientExpenseCreateSheetOptions) => {
  const {
    SheetFragment: createExpenseSheet,
    openSheet: openCreateExpenseSheet,
    closeSheet: closeCreateExpenseSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <Receipt className="h-4 w-4" />
        Nouvelle Dépense
      </div>
    ),
    description: "Enregistrer une nouvelle dépense",
    children: (
      <ClientExpenseCreateForm
        className="my-4"
        createExpense={createExpense}
        isCreatePending={isCreatePending}
        projectId={projectId}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: () => {
      resetExpense?.();
    },
  });

  return {
    createExpenseSheet,
    openCreateExpenseSheet,
    closeCreateExpenseSheet,
  };
};

