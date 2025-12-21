"use client";

import React from "react";
import { UserPlus } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { TeamMemberCreateForm } from "../forms/TeamMemberCreateForm";
import type { CreateTeamMemberRequest } from "@/api/admin/chantiers";

interface UseTeamMemberCreateSheetOptions {
  createTeamMember?: (data: CreateTeamMemberRequest) => void;
  isCreatePending?: boolean;
  chantierId: string;
}

export const useTeamMemberCreateSheet = ({
  createTeamMember,
  isCreatePending = false,
  chantierId,
}: UseTeamMemberCreateSheetOptions) => {
  const {
    SheetFragment: createTeamMemberSheet,
    openSheet: openCreateTeamMemberSheet,
    closeSheet: closeCreateTeamMemberSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <UserPlus className="h-4 w-4" />
        Ajouter un membre d'équipe
      </div>
    ),
    description: "Ajouter un nouveau membre à l'équipe du chantier",
    children: (
      <TeamMemberCreateForm
        className="my-4"
        createTeamMember={createTeamMember}
        isCreatePending={isCreatePending}
        chantierId={chantierId}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
  });

  return {
    createTeamMemberSheet,
    openCreateTeamMemberSheet,
    closeCreateTeamMemberSheet,
  };
};
