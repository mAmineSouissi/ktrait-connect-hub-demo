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
import type { DocumentWithDetails } from "@/types/document.types";

interface DocumentDeleteDialogProps {
  document: DocumentWithDetails | null;
  onDelete: (id: string) => void | Promise<void>;
  isDeleting?: boolean;
  isOpen?: boolean;
  onClose: () => void;
}

export const DocumentDeleteDialog = ({
  document,
  onDelete,
  isDeleting = false,
  isOpen = false,
  onClose,
}: DocumentDeleteDialogProps) => {
  const handleDelete = async () => {
    if (document) {
      await onDelete(document.id);
      onClose();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen && !!document} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer le document "{document?.name}" ?
            Cette action est irréversible et supprimera le fichier associé.
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
