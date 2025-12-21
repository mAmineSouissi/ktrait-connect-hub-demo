"use client";

import React from "react";
import { UserPlus } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { PartnerCreateForm } from "../forms/PartnerCreateForm";
import type { CreatePartnerRequest } from "@/api/admin/partners";

interface UsePartnerCreateSheetOptions {
  createPartner?: (data: CreatePartnerRequest) => void | Promise<void>;
  isCreatePending?: boolean;
  resetPartner?: () => void;
}

export const usePartnerCreateSheet = ({
  createPartner,
  isCreatePending = false,
  resetPartner,
}: UsePartnerCreateSheetOptions) => {
  const {
    SheetFragment: createPartnerSheet,
    openSheet: openCreatePartnerSheet,
    closeSheet: closeCreatePartnerSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <UserPlus className="h-4 w-4" />
        Nouveau Partenaire
      </div>
    ),
    description: "Créer un nouveau compte partenaire",
    children: (
      <PartnerCreateForm
        className="my-4"
        createPartner={createPartner}
        isCreatePending={isCreatePending}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: () => {
      resetPartner?.();
    },
  });

  return {
    createPartnerSheet,
    openCreatePartnerSheet,
    closeCreatePartnerSheet,
  };
};
