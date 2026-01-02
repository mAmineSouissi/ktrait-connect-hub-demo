"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { PartnerTaskCreateForm } from "../forms/PartnerTaskCreateForm";
import type { CreatePartnerTaskRequest } from "@/api/partner/projects";

interface UsePartnerTaskCreateSheetOptions {
  createTask?: (data: CreatePartnerTaskRequest) => void | Promise<void>;
  isCreatePending?: boolean;
  resetTask?: () => void;
  projects?: Array<{ id: string; name: string }>;
}

export const usePartnerTaskCreateSheet = ({
  createTask,
  isCreatePending = false,
  resetTask,
  projects = [],
}: UsePartnerTaskCreateSheetOptions) => {
  const {
    SheetFragment: createTaskSheet,
    openSheet: openCreateTaskSheet,
    closeSheet: closeCreateTaskSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Créer une tâche
      </div>
    ),
    description: "Créez une nouvelle tâche pour un projet",
    children: (
      <PartnerTaskCreateForm
        className="my-4"
        onSubmit={createTask}
        isPending={isCreatePending}
        projects={projects}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: () => {
      resetTask?.();
    },
  });

  return {
    createTaskSheet,
    openCreateTaskSheet,
    closeCreateTaskSheet,
  };
};


