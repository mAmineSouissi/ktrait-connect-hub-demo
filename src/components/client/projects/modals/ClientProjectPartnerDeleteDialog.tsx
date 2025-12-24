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

interface ProjectPartnerWithDetails {
  id: string;
  project_id: string;
  partner_id: string;
  role: string | null;
  is_primary: boolean;
  created_at: string;
  partner: {
    id: string;
    name: string;
    type: string;
    contact_person: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    status: string | null;
  } | null;
}

interface ClientProjectPartnerDeleteDialogProps {
  projectPartner: ProjectPartnerWithDetails | null;
  onDelete: (partnerId: string) => void | Promise<void>;
  isDeleting?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  projectId: string;
}

export const ClientProjectPartnerDeleteDialog = ({
  projectPartner,
  onDelete,
  isDeleting = false,
  isOpen = false,
  onClose,
  projectId,
}: ClientProjectPartnerDeleteDialogProps) => {
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

