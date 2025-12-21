"use client";

import React from "react";
import { UserPlus } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import type { UpdatePartnerRequest } from "@/api/admin/partners";
import type { PartnerWithDetails } from "@/types";
import { usePartnerStore } from "@/hooks/stores/usePartnerStore";
import { PartnerUpdateForm } from "../forms/PartnerUpdateForm";

interface UsePartnerUpdateSheetOptions {
  updatePartner?: (data: {
    id: string;
    data: UpdatePartnerRequest;
  }) => void | Promise<void>;
  isUpdatePending?: boolean;
  resetPartner?: () => void;
  partner?: PartnerWithDetails | null;
}

export const usePartnerUpdateSheet = ({
  updatePartner,
  isUpdatePending = false,
  resetPartner,
  partner,
}: UsePartnerUpdateSheetOptions) => {
  const partnerStore = usePartnerStore();
  const currentPartner = partner || partnerStore.response;

  const {
    SheetFragment: updatePartnerSheet,
    openSheet: openUpdatePartnerSheet,
    closeSheet: closeUpdatePartnerSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <UserPlus className="h-4 w-4" />
        Modifier le Partenaire
      </div>
    ),
    description: "Modifier les informations du partenaire",
    children: (
      <PartnerUpdateForm
        className="my-4"
        updatePartner={updatePartner}
        isUpdatePending={isUpdatePending}
        partner={currentPartner}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: () => {
      resetPartner?.();
    },
  });

  return {
    updatePartnerSheet,
    openUpdatePartnerSheet,
    closeUpdatePartnerSheet,
  };
};
