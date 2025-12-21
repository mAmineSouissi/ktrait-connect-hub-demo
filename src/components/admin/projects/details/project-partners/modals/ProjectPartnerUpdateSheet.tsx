"use client";

import React from "react";
import { UserPlus } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { ProjectPartnerUpdateForm } from "../forms/ProjectPartnerUpdateForm";
import type { UpdateProjectPartnerRequest } from "@/api/admin/project-partners";
import type { ProjectPartnerWithDetails } from "@/api/admin/project-partners";

interface UseProjectPartnerUpdateSheetOptions {
  updatePartner?: (data: {
    partnerId: string;
    data: UpdateProjectPartnerRequest;
  }) => void | Promise<void>;
  isUpdatePending?: boolean;
  resetPartner?: () => void;
  projectPartner?: ProjectPartnerWithDetails | null;
  projectId: string;
}

export const useProjectPartnerUpdateSheet = ({
  updatePartner,
  isUpdatePending = false,
  resetPartner,
  projectPartner,
  projectId,
}: UseProjectPartnerUpdateSheetOptions) => {
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
    description: "Modifier les informations du partenaire dans ce projet",
    children: (
      <ProjectPartnerUpdateForm
        className="my-4"
        updatePartner={updatePartner}
        isUpdatePending={isUpdatePending}
        projectPartner={projectPartner}
        projectId={projectId}
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
