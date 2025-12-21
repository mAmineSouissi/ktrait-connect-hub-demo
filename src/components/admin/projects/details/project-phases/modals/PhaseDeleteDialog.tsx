"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { ProjectPhase } from "@/types/project.types";

interface PhaseDeleteDialogProps {
  phase: ProjectPhase | null;
  onDelete: (projectId: string, phaseId: string) => void | Promise<void>;
  isDeleting?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  projectId: string;
}

export const PhaseDeleteDialog = ({
  phase,
  onDelete,
  isDeleting = false,
  isOpen = false,
  onClose,
  projectId,
}: PhaseDeleteDialogProps) => {
  const handleDelete = async () => {
    if (phase) {
      await onDelete(projectId, phase.id);
      onClose();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen && !!phase} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer la phase "{phase?.name}" ? Cette
            action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
