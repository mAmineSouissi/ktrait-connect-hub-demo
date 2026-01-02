"use client";

import React from "react";
import { Edit } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { PartnerTaskUpdateForm } from "../forms/PartnerTaskUpdateForm";
import type { UpdatePartnerTaskRequest, PartnerTask } from "@/api/partner/projects";

interface UsePartnerTaskUpdateSheetOptions {
  updateTask?: (data: UpdatePartnerTaskRequest) => void | Promise<void>;
  isUpdatePending?: boolean;
  resetTask?: () => void;
  task?: PartnerTask | null;
}

export const usePartnerTaskUpdateSheet = ({
  updateTask,
  isUpdatePending = false,
  resetTask,
  task,
}: UsePartnerTaskUpdateSheetOptions) => {
  const {
    SheetFragment: updateTaskSheet,
    openSheet: openUpdateTaskSheet,
    closeSheet: closeUpdateTaskSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <Edit className="h-4 w-4" />
        Modifier la tâche
      </div>
    ),
    description: "Modifiez les détails de la tâche",
    children: (
      <PartnerTaskUpdateForm
        className="my-4"
        onSubmit={updateTask}
        isPending={isUpdatePending}
        task={task}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: () => {
      resetTask?.();
    },
  });

  return {
    updateTaskSheet,
    openUpdateTaskSheet,
    closeUpdateTaskSheet,
  };
};


