"use client";

import React from "react";
import { UserPlus } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { ProjectPartnerUpdateForm } from "@/components/admin/projects/details/project-partners/forms/ProjectPartnerUpdateForm";

interface ProjectPartnerWithDetails {
  id: string;
  project_id: string;
  partner_id: string;
  role: string | null;
  is_primary: boolean;
  created_at: string;
  partner: {
    id: string;
    name: string;
    type: string;
    contact_person: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    status: string | null;
  } | null;
}

interface UpdateProjectPartnerRequest {
  role?: string | null;
  is_primary?: boolean;
}

interface UseClientProjectPartnerUpdateSheetOptions {
  updatePartner?: (data: {
    partnerId: string;
    data: UpdateProjectPartnerRequest;
  }) => void | Promise<void>;
  isUpdatePending?: boolean;
  resetPartner?: () => void;
  projectPartner?: ProjectPartnerWithDetails | null;
  projectId: string;
}

export const useClientProjectPartnerUpdateSheet = ({
  updatePartner,
  isUpdatePending = false,
  resetPartner,
  projectPartner,
  projectId,
}: UseClientProjectPartnerUpdateSheetOptions) => {
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
        projectPartner={projectPartner as any}
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

