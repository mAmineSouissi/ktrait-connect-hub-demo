"use client";

import { useDialog } from "@/components/shared/Dialogs";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface UseTeamMemberDeleteDialogOptions {
  teamMemberName?: string;
  deleteTeamMember?: () => void;
  isDeleting?: boolean;
}

export const useTeamMemberDeleteDialog = ({
  teamMemberName = "",
  deleteTeamMember,
  isDeleting = false,
}: UseTeamMemberDeleteDialogOptions) => {
  const {
    DialogFragment: deleteTeamMemberDialog,
    openDialog: openDeleteTeamMemberDialog,
    closeDialog: closeDeleteTeamMemberDialog,
  } = useDialog({
    title: (
      <div className="flex items-center gap-2">
        <Trash2 className="h-4 w-4 text-destructive" />
        Supprimer le membre d'équipe
      </div>
    ),
    description: "Êtes-vous sûr de vouloir supprimer ce membre d'équipe ?",
    children: (
      <div>
        <p>
          Êtes-vous sûr de vouloir supprimer &quot;{teamMemberName}&quot; de
          l'équipe ?
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Cette action est irréversible.
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => closeDeleteTeamMemberDialog()}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              deleteTeamMember?.();
            }}
            disabled={isDeleting}
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </Button>
        </div>
      </div>
    ),
  });

  return {
    deleteTeamMemberDialog,
    openDeleteTeamMemberDialog,
    closeDeleteTeamMemberDialog,
  };
};
