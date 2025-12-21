"use client";

import { useDialog } from "@/components/shared/Dialogs";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { Project } from "@/types/project.types";

interface UseProjectDeleteDialogOptions {
  projectName?: string;
  deleteProject?: () => void;
  isDeleting?: boolean;
}

export const useProjectDeleteDialog = ({
  projectName = "",
  deleteProject,
  isDeleting = false,
}: UseProjectDeleteDialogOptions) => {
  const {
    DialogFragment: deleteProjectDialog,
    openDialog: openDeleteProjectDialog,
    closeDialog: closeDeleteProjectDialog,
  } = useDialog({
    title: (
      <div className="flex items-center gap-2">
        <Trash2 className="h-4 w-4 text-destructive" />
        Supprimer le projet
      </div>
    ),
    description: "Êtes-vous sûr de vouloir supprimer ce projet ?",
    children: (
      <div>
        <p>
          Êtes-vous sûr de vouloir supprimer le projet &quot;{projectName}&quot;
          ?
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Cette action est irréversible.
        </p>
      </div>
    ),
    footer: (
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => closeDeleteProjectDialog()}
          disabled={isDeleting}
        >
          Annuler
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            deleteProject?.();
          }}
          disabled={isDeleting}
        >
          {isDeleting ? "Suppression..." : "Supprimer"}
        </Button>
      </div>
    ),
  });

  return {
    deleteProjectDialog,
    openDeleteProjectDialog,
    closeDeleteProjectDialog,
  };
};
