"use client";

import { useDialog } from "@/components/shared/Dialogs";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface UseChantierDeleteDialogOptions {
  chantierName?: string;
  deleteChantier?: () => void;
  isDeleting?: boolean;
}

export const useChantierDeleteDialog = ({
  chantierName = "",
  deleteChantier,
  isDeleting = false,
}: UseChantierDeleteDialogOptions) => {
  const {
    DialogFragment: deleteChantierDialog,
    openDialog: openDeleteChantierDialog,
    closeDialog: closeDeleteChantierDialog,
  } = useDialog({
    title: (
      <div className="flex items-center gap-2">
        <Trash2 className="h-4 w-4 text-destructive" />
        Supprimer le chantier
      </div>
    ),
    description: "Êtes-vous sûr de vouloir supprimer ce chantier ?",
    children: (
      <div>
        <p>
          Êtes-vous sûr de vouloir supprimer le chantier &quot;{chantierName}
          &quot; ?
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Cette action est irréversible et supprimera également toutes les
          données associées (équipe, planning, galerie, notes).
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => closeDeleteChantierDialog()}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              deleteChantier?.();
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
    deleteChantierDialog,
    openDeleteChantierDialog,
    closeDeleteChantierDialog,
  };
};
