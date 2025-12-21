"use client";

import { useDialog } from "@/components/shared/Dialogs";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface UseGalleryItemDeleteDialogOptions {
  itemTitle?: string;
  deleteItem?: () => void;
  isDeleting?: boolean;
}

export const useGalleryItemDeleteDialog = ({
  itemTitle = "",
  deleteItem,
  isDeleting = false,
}: UseGalleryItemDeleteDialogOptions) => {
  const {
    DialogFragment: deleteItemDialog,
    openDialog: openDeleteItemDialog,
    closeDialog: closeDeleteItemDialog,
  } = useDialog({
    title: (
      <div className="flex items-center gap-2">
        <Trash2 className="h-4 w-4 text-destructive" />
        Supprimer l'élément
      </div>
    ),
    description:
      "Êtes-vous sûr de vouloir supprimer cet élément de la galerie ?",
    children: (
      <div>
        <p>Êtes-vous sûr de vouloir supprimer &quot;{itemTitle}&quot; ?</p>
        <p className="text-sm text-muted-foreground mt-2">
          Cette action est irréversible et supprimera également le fichier du
          stockage.
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => closeDeleteItemDialog()}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              deleteItem?.();
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
    deleteItemDialog,
    openDeleteItemDialog,
    closeDeleteItemDialog,
  };
};
