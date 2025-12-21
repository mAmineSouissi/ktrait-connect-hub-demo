"use client";

import { useDialog } from "@/components/shared/Dialogs";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

interface useClientDeleteDialogProps {
  clientName: string;
  deleteClient: () => void | Promise<void>;
  isDeleting?: boolean;
}

export const useClientDeleteDialog = ({
  clientName,
  deleteClient,
  isDeleting = false,
}: useClientDeleteDialogProps) => {
  const {
    DialogFragment: deleteClientDialog,
    openDialog: openDeleteClientDialog,
    closeDialog: closeDeleteClientDialog,
  } = useDialog({
    title: (
      <div className="flex items-center gap-2">
        <Trash2 className="h-4 w-4 text-destructive" />
        Confirmer la suppression
      </div>
    ),
    description: "Êtes-vous sûr de vouloir supprimer ce client ?",
    children: (
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          Êtes-vous sûr de vouloir supprimer le client{" "}
          <span className="font-semibold text-foreground">
            {clientName || "ce client"}
          </span>
          ? Cette action est irréversible et supprimera également toutes les
          relations avec les projets.
        </p>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => closeDeleteClientDialog()}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              await deleteClient();
              closeDeleteClientDialog();
            }}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Suppression...
              </>
            ) : (
              "Supprimer"
            )}
          </Button>
        </div>
      </div>
    ),
  });

  return {
    deleteClientDialog,
    openDeleteClientDialog,
    closeDeleteClientDialog,
  };
};
