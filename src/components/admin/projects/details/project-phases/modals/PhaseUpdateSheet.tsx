"use client";

import React from "react";
import { ListChecks } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { PhaseUpdateForm } from "../forms/PhaseUpdateForm";
import type { UpdatePhaseRequest } from "@/api/admin/phases";
import type { ProjectPhase } from "@/types/project.types";

interface UsePhaseUpdateSheetOptions {
  updatePhase?: (data: {
    projectId: string;
    phaseId: string;
    data: UpdatePhaseRequest;
  }) => void | Promise<void>;
  isUpdatePending?: boolean;
  resetPhase?: () => void;
  phase?: ProjectPhase | null;
  projectId: string;
}

export const usePhaseUpdateSheet = ({
  updatePhase,
  isUpdatePending = false,
  resetPhase,
  phase,
  projectId,
}: UsePhaseUpdateSheetOptions) => {
  const {
    SheetFragment: updatePhaseSheet,
    openSheet: openUpdatePhaseSheet,
    closeSheet: closeUpdatePhaseSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <ListChecks className="h-4 w-4" />
        Modifier la Phase
      </div>
    ),
    description: "Modifier les informations de la phase",
    children: (
      <PhaseUpdateForm
        className="my-4"
        updatePhase={updatePhase}
        isUpdatePending={isUpdatePending}
        phase={phase}
        projectId={projectId}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: () => {
      resetPhase?.();
    },
  });

  return {
    updatePhaseSheet,
    openUpdatePhaseSheet,
    closeUpdatePhaseSheet,
  };
};
