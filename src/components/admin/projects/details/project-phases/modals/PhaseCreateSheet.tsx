"use client";

import React from "react";
import { ListChecks } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { PhaseCreateForm } from "../forms/PhaseCreateForm";
import type { CreatePhaseRequest } from "@/api/admin/phases";

interface UsePhaseCreateSheetOptions {
  createPhase?: (data: CreatePhaseRequest) => void | Promise<void>;
  isCreatePending?: boolean;
  resetPhase?: () => void;
  projectId: string;
}

export const usePhaseCreateSheet = ({
  createPhase,
  isCreatePending = false,
  resetPhase,
  projectId,
}: UsePhaseCreateSheetOptions) => {
  const {
    SheetFragment: createPhaseSheet,
    openSheet: openCreatePhaseSheet,
    closeSheet: closeCreatePhaseSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <ListChecks className="h-4 w-4" />
        Nouvelle Phase
      </div>
    ),
    description: "Créer une nouvelle phase pour ce projet",
    children: (
      <PhaseCreateForm
        className="my-4"
        createPhase={createPhase}
        isCreatePending={isCreatePending}
        projectId={projectId}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: () => {
      resetPhase?.();
    },
  });

  return {
    createPhaseSheet,
    openCreatePhaseSheet,
    closeCreatePhaseSheet,
  };
};
