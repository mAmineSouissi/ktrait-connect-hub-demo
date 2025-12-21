"use client";

import React from "react";
import { UserPlus } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { ProjectPartnerAddForm } from "../forms/ProjectPartnerAddForm";
import type { AddProjectPartnerRequest } from "@/api/admin/project-partners";
import type { Partner } from "@/types/partner.types";

interface UseProjectPartnerAddSheetOptions {
  addPartner?: (data: AddProjectPartnerRequest) => void | Promise<void>;
  isAddPending?: boolean;
  resetPartner?: () => void;
  projectId: string;
  existingPartnerIds: string[];
  allPartners: Partner[];
}

export const useProjectPartnerAddSheet = ({
  addPartner,
  isAddPending = false,
  resetPartner,
  projectId,
  existingPartnerIds,
  allPartners,
}: UseProjectPartnerAddSheetOptions) => {
  const {
    SheetFragment: addPartnerSheet,
    openSheet: openAddPartnerSheet,
    closeSheet: closeAddPartnerSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <UserPlus className="h-4 w-4" />
        Ajouter un Partenaire
      </div>
    ),
    description: "Ajouter un partenaire à ce projet",
    children: (
      <ProjectPartnerAddForm
        className="my-4"
        addPartner={addPartner}
        isAddPending={isAddPending}
        projectId={projectId}
        existingPartnerIds={existingPartnerIds}
        allPartners={allPartners}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: () => {
      resetPartner?.();
    },
  });

  return {
    addPartnerSheet,
    openAddPartnerSheet,
    closeAddPartnerSheet,
  };
};
