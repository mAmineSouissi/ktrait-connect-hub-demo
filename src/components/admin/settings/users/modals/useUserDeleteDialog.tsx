"use client";

import { useDialog } from "@/components/shared/Dialogs";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface UseUserDeleteDialogOptions {
  userName?: string;
  deleteUser?: () => void;
  isDeleting?: boolean;
}

export const useUserDeleteDialog = ({
  userName = "",
  deleteUser,
  isDeleting = false,
}: UseUserDeleteDialogOptions) => {
  const {
    DialogFragment: deleteUserDialog,
    openDialog: openDeleteUserDialog,
    closeDialog: closeDeleteUserDialog,
  } = useDialog({
    title: (
      <div className="flex items-center gap-2">
        <Trash2 className="h-4 w-4 text-destructive" />
        Supprimer l'utilisateur
      </div>
    ),
    description: "Êtes-vous sûr de vouloir supprimer cet utilisateur ?",
    children: (
      <div>
        <p>
          Êtes-vous sûr de vouloir supprimer l'utilisateur &quot;{userName}
          &quot; ?
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Cette action est irréversible.
        </p>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => closeDeleteUserDialog()}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              deleteUser?.();
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
    deleteUserDialog,
    openDeleteUserDialog,
    closeDeleteUserDialog,
  };
};
