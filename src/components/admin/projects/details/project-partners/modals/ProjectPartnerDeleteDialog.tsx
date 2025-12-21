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
import type { ProjectPartnerWithDetails } from "@/api/admin/project-partners";

interface ProjectPartnerDeleteDialogProps {
  projectPartner: ProjectPartnerWithDetails | null;
  onDelete: (partnerId: string) => void | Promise<void>;
  isDeleting?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  projectId: string;
}

export const ProjectPartnerDeleteDialog = ({
  projectPartner,
  onDelete,
  isDeleting = false,
  isOpen = false,
  onClose,
  projectId,
}: ProjectPartnerDeleteDialogProps) => {
  const handleDelete = async () => {
    if (projectPartner) {
      await onDelete(projectPartner.id);
      onClose();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen && !!projectPartner} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir retirer "
            {projectPartner?.partner?.name || "ce partenaire"}" de ce projet ?
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
              "Retirer"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
