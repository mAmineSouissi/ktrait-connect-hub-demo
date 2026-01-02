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

interface PartnerDocumentDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  isPending?: boolean;
  documentName?: string | null;
}

export const PartnerDocumentDeleteDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
  documentName,
}: PartnerDocumentDeleteDialogProps) => {
  const handleDelete = async () => {
    await onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer le document "{documentName}" ?
            Cette action est irréversible et supprimera le fichier associé.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
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


