"use client";

import React from "react";
import { HardHat } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { ChantierCreateForm } from "../forms/ChantierCreateForm";
import type { CreateChantierRequest } from "@/types/chantier.types";
import type { Project } from "@/types/project.types";

interface UseChantierCreateSheetOptions {
  createChantier?: () => void | Promise<void>;
  isCreatePending?: boolean;
  resetChantier?: () => void;
  projects?: Project[];
}

export const useChantierCreateSheet = ({
  createChantier,
  isCreatePending = false,
  resetChantier,
  projects = [],
}: UseChantierCreateSheetOptions) => {
  const {
    SheetFragment: createChantierSheet,
    openSheet: openCreateChantierSheet,
    closeSheet: closeCreateChantierSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <HardHat className="h-4 w-4" />
        Nouveau Chantier
      </div>
    ),
    description: "Créer un nouveau chantier",
    children: (
      <ChantierCreateForm
        className="my-4"
        createChantier={createChantier}
        isCreatePending={isCreatePending}
        projects={projects}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: () => {
      resetChantier?.();
    },
  });

  return {
    createChantierSheet,
    openCreateChantierSheet,
    closeCreateChantierSheet,
  };
};
