"use client";

import { useDialog } from "@/components/shared/Dialogs";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface UseNoteDeleteDialogOptions {
  noteAuthor?: string;
  deleteNote?: () => void;
  isDeleting?: boolean;
}

export const useNoteDeleteDialog = ({
  noteAuthor = "",
  deleteNote,
  isDeleting = false,
}: UseNoteDeleteDialogOptions) => {
  const {
    DialogFragment: deleteNoteDialog,
    openDialog: openDeleteNoteDialog,
    closeDialog: closeDeleteNoteDialog,
  } = useDialog({
    title: (
      <div className="flex items-center gap-2">
        <Trash2 className="h-4 w-4 text-destructive" />
        Supprimer la note
      </div>
    ),
    description: "Êtes-vous sûr de vouloir supprimer cette note ?",
    children: (
      <div>
        <p>
          Êtes-vous sûr de vouloir supprimer la note de &quot;{noteAuthor}&quot;
          ?
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Cette action est irréversible.
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => closeDeleteNoteDialog()}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              deleteNote?.();
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
    deleteNoteDialog,
    openDeleteNoteDialog,
    closeDeleteNoteDialog,
  };
};
