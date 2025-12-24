"use client";

import React from "react";
import { HardHat } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { ClientChantierUpdateForm } from "../forms/ClientChantierUpdateForm";
import type { UpdateChantierRequest } from "@/types/chantier.types";
import type { ChantierRow } from "@/types/supabase-database.types";

interface UseClientChantierUpdateSheetOptions {
  updateChantier?: (data: UpdateChantierRequest) => void | Promise<void>;
  isUpdatePending?: boolean;
  resetChantier?: () => void;
  chantier?: ChantierRow | null;
}

export const useClientChantierUpdateSheet = ({
  updateChantier,
  isUpdatePending = false,
  resetChantier,
  chantier,
}: UseClientChantierUpdateSheetOptions) => {
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
      <ClientChantierUpdateForm
        className="my-4"
        updateChantier={updateChantier}
        isUpdatePending={isUpdatePending}
        chantier={chantier}
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

