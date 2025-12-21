"use client";

import React from "react";
import { CalendarPlus } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { PlanningTaskCreateForm } from "../forms/PlanningTaskCreateForm";
import type { CreatePlanningTaskRequest } from "@/api/admin/chantiers";

interface UsePlanningTaskCreateSheetOptions {
  createPlanningTask?: (data: CreatePlanningTaskRequest) => void;
  isCreatePending?: boolean;
  chantierId: string;
}

export const usePlanningTaskCreateSheet = ({
  createPlanningTask,
  isCreatePending = false,
  chantierId,
}: UsePlanningTaskCreateSheetOptions) => {
  const {
    SheetFragment: createPlanningTaskSheet,
    openSheet: openCreatePlanningTaskSheet,
    closeSheet: closeCreatePlanningTaskSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <CalendarPlus className="h-4 w-4" />
        Ajouter une tâche
      </div>
    ),
    description: "Ajouter une nouvelle tâche au planning du chantier",
    children: (
      <PlanningTaskCreateForm
        className="my-4"
        createPlanningTask={createPlanningTask}
        isCreatePending={isCreatePending}
        chantierId={chantierId}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
  });

  return {
    createPlanningTaskSheet,
    openCreatePlanningTaskSheet,
    closeCreatePlanningTaskSheet,
  };
};
