"use client";

import React from "react";
import { Receipt } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { ExpenseCreateForm } from "../forms/ExpenseCreateForm";
import type { CreateExpenseRequest } from "@/api/admin/expenses";
import type { Project } from "@/types/project.types";

interface UseExpenseCreateSheetOptions {
  createExpense?: (data: CreateExpenseRequest) => void | Promise<void>;
  isCreatePending?: boolean;
  resetExpense?: () => void;
  projects?: Project[];
  defaultProjectId?: string;
}

export const useExpenseCreateSheet = ({
  createExpense,
  isCreatePending = false,
  resetExpense,
  projects = [],
  defaultProjectId,
}: UseExpenseCreateSheetOptions) => {
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
      <ExpenseCreateForm
        className="my-4"
        createExpense={createExpense}
        isCreatePending={isCreatePending}
        projects={projects}
        defaultProjectId={defaultProjectId}
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
