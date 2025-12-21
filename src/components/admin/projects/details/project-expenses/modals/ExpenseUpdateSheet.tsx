"use client";

import React from "react";
import { Receipt } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { ExpenseUpdateForm } from "../forms/ExpenseUpdateForm";
import type { UpdateExpenseRequest } from "@/api/admin/expenses";
import type { ExpenseWithDetails } from "@/types/expense.types";
import type { Project } from "@/types/project.types";

interface UseExpenseUpdateSheetOptions {
  updateExpense?: (data: {
    id: string;
    data: UpdateExpenseRequest;
  }) => void | Promise<void>;
  isUpdatePending?: boolean;
  resetExpense?: () => void;
  expense?: ExpenseWithDetails | null;
  projects?: Project[];
}

export const useExpenseUpdateSheet = ({
  updateExpense,
  isUpdatePending = false,
  resetExpense,
  expense,
  projects = [],
}: UseExpenseUpdateSheetOptions) => {
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
      <ExpenseUpdateForm
        className="my-4"
        updateExpense={updateExpense}
        isUpdatePending={isUpdatePending}
        expense={expense}
        projects={projects}
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
