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
import { DisplayClient } from "@/components/shared/Displays.types";

interface ClientDeleteDialogProps {
  client: DisplayClient | null;
  onDelete: (id: string) => void | Promise<void>;
  isDeleting?: boolean;
  onClose: () => void;
}

export const ClientDeleteDialog: React.FC<ClientDeleteDialogProps> = ({
  client,
  onDelete,
  isDeleting = false,
  onClose,
}) => {
  const isOpen = !!client;

  const handleDelete = async () => {
    if (client) {
      await onDelete(client.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer le client "{client?.name}" ?
            Cette action est irréversible.
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
