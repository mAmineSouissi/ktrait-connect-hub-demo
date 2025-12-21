"use client";

import React from "react";
import { HardHat } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { ChantierUpdateForm } from "../forms/ChantierUpdateForm";
import type { UpdateChantierRequest } from "@/types/chantier.types";
import type { ChantierWithCounts } from "@/types/chantier.types";
import type { Project } from "@/types/project.types";

interface UseChantierUpdateSheetOptions {
  updateChantier?: () => void | Promise<void>;
  isUpdatePending?: boolean;
  resetChantier?: () => void;
  chantier?: ChantierWithCounts | null;
  projects?: Project[];
}

export const useChantierUpdateSheet = ({
  updateChantier,
  isUpdatePending = false,
  resetChantier,
  chantier,
  projects = [],
}: UseChantierUpdateSheetOptions) => {
  const {
    SheetFragment: updateChantierSheet,
    openSheet: openUpdateChantierSheet,
    closeSheet: closeUpdateChantierSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <HardHat className="h-4 w-4" />
        Modifier le Chantier
      </div>
    ),
    description: "Modifier les informations du chantier",
    children: (
      <ChantierUpdateForm
        className="my-4"
        updateChantier={updateChantier}
        isUpdatePending={isUpdatePending}
        chantier={chantier}
        projects={projects}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: () => {
      resetChantier?.();
    },
  });

  return {
    updateChantierSheet,
    openUpdateChantierSheet,
    closeUpdateChantierSheet,
  };
};
