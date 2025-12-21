"use client";

import React from "react";
import { UserCog } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { TeamMemberUpdateForm } from "../forms/TeamMemberUpdateForm";
import type { UpdateTeamMemberRequest } from "@/api/admin/chantiers";
import type { ChantierTeamRow } from "@/types/supabase-database.types";

interface UseTeamMemberUpdateSheetOptions {
  updateTeamMember?: (data: UpdateTeamMemberRequest) => void;
  isUpdatePending?: boolean;
  teamMember?: ChantierTeamRow | null;
}

export const useTeamMemberUpdateSheet = ({
  updateTeamMember,
  isUpdatePending = false,
  teamMember,
}: UseTeamMemberUpdateSheetOptions) => {
  const {
    SheetFragment: updateTeamMemberSheet,
    openSheet: openUpdateTeamMemberSheet,
    closeSheet: closeUpdateTeamMemberSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <UserCog className="h-4 w-4" />
        Modifier le membre d'équipe
      </div>
    ),
    description: "Modifier les informations du membre d'équipe",
    children: (
      <TeamMemberUpdateForm
        className="my-4"
        updateTeamMember={updateTeamMember}
        isUpdatePending={isUpdatePending}
        teamMember={teamMember}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
  });

  return {
    updateTeamMemberSheet,
    openUpdateTeamMemberSheet,
    closeUpdateTeamMemberSheet,
  };
};
