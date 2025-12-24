"use client";

import React from "react";
import { HardHat } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { ClientChantierCreateForm } from "../forms/ClientChantierCreateForm";
import type { CreateChantierRequest } from "@/types/chantier.types";

interface UseClientChantierCreateSheetOptions {
  createChantier?: (data: CreateChantierRequest) => void | Promise<void>;
  isCreatePending?: boolean;
  resetChantier?: () => void;
  projectId: string;
}

export const useClientChantierCreateSheet = ({
  createChantier,
  isCreatePending = false,
  resetChantier,
  projectId,
}: UseClientChantierCreateSheetOptions) => {
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
    description: "Créer un nouveau chantier pour ce projet",
    children: (
      <ClientChantierCreateForm
        className="my-4"
        createChantier={createChantier}
        isCreatePending={isCreatePending}
        projectId={projectId}
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

