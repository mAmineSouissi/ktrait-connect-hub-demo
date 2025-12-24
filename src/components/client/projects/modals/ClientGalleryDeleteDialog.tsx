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
import type { ProjectGalleryItem } from "@/types/gallery.types";

interface ClientGalleryDeleteDialogProps {
  galleryItem: ProjectGalleryItem | null;
  onDelete: (galleryId: string) => void | Promise<void>;
  isDeleting?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  projectId: string;
}

export const ClientGalleryDeleteDialog = ({
  galleryItem,
  onDelete,
  isDeleting = false,
  isOpen = false,
  onClose,
  projectId,
}: ClientGalleryDeleteDialogProps) => {
  const handleDelete = async () => {
    if (galleryItem) {
      await onDelete(galleryItem.id);
      onClose();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen && !!galleryItem} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer "{galleryItem?.title}" de la
            galerie ? Cette action est irréversible.
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

