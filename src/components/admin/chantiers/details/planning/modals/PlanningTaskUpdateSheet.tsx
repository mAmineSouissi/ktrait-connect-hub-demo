"use client";

import React from "react";
import { Pencil } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { PlanningTaskUpdateForm } from "../forms/PlanningTaskUpdateForm";
import type { UpdatePlanningTaskRequest } from "@/api/admin/chantiers";
import type { ChantierPlanningRow } from "@/types/supabase-database.types";

interface UsePlanningTaskUpdateSheetOptions {
  updatePlanningTask?: (data: UpdatePlanningTaskRequest) => void;
  isUpdatePending?: boolean;
  task?: ChantierPlanningRow | null;
}

export const usePlanningTaskUpdateSheet = ({
  updatePlanningTask,
  isUpdatePending = false,
  task,
}: UsePlanningTaskUpdateSheetOptions) => {
  const {
    SheetFragment: updatePlanningTaskSheet,
    openSheet: openUpdatePlanningTaskSheet,
    closeSheet: closeUpdatePlanningTaskSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <Pencil className="h-4 w-4" />
        Modifier la tâche
      </div>
    ),
    description: "Modifier les informations de la tâche",
    children: (
      <PlanningTaskUpdateForm
        className="my-4"
        updatePlanningTask={updatePlanningTask}
        isUpdatePending={isUpdatePending}
        task={task}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
  });

  return {
    updatePlanningTaskSheet,
    openUpdatePlanningTaskSheet,
    closeUpdatePlanningTaskSheet,
  };
};
