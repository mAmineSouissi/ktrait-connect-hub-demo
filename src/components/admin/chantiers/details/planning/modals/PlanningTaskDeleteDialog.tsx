"use client";

import { useDialog } from "@/components/shared/Dialogs";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface UsePlanningTaskDeleteDialogOptions {
  taskName?: string;
  deleteTask?: () => void;
  isDeleting?: boolean;
}

export const usePlanningTaskDeleteDialog = ({
  taskName = "",
  deleteTask,
  isDeleting = false,
}: UsePlanningTaskDeleteDialogOptions) => {
  const {
    DialogFragment: deleteTaskDialog,
    openDialog: openDeleteTaskDialog,
    closeDialog: closeDeleteTaskDialog,
  } = useDialog({
    title: (
      <div className="flex items-center gap-2">
        <Trash2 className="h-4 w-4 text-destructive" />
        Supprimer la tâche
      </div>
    ),
    description: "Êtes-vous sûr de vouloir supprimer cette tâche ?",
    children: (
      <div>
        <p>
          Êtes-vous sûr de vouloir supprimer la tâche &quot;{taskName}&quot; ?
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Cette action est irréversible.
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => closeDeleteTaskDialog()}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              deleteTask?.();
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
    deleteTaskDialog,
    openDeleteTaskDialog,
    closeDeleteTaskDialog,
  };
};
