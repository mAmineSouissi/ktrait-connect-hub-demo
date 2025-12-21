import { useDialog } from "@/components/shared/Dialogs";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

interface usePartnerDeleteDialogProps {
  partnerName: string;
  deletePartner: () => void;
  isDeleting?: boolean;
}

export const usePartnerDeleteDialog = ({
  partnerName,
  deletePartner,
  isDeleting = false,
}: usePartnerDeleteDialogProps) => {
  const {
    DialogFragment: deletePartnerDialog,
    openDialog: openDeletePartnerDialog,
    closeDialog: closeDeletePartnerDialog,
  } = useDialog({
    title: (
      <div className="flex items-center gap-2">
        <Trash2 className="h-4 w-4" />
        Supprimer le partenaire "{partnerName}"
      </div>
    ),
    description: "Êtes-vous sûr de vouloir supprimer ce partenaire ?",
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            variant={"destructive"}
            disabled={isDeleting}
            onClick={() => {
              deletePartner?.();
              closeDeletePartnerDialog();
            }}
          >
            Supprimer
            {isDeleting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
          </Button>
          <Button
            variant={"secondary"}
            disabled={isDeleting}
            onClick={() => {
              closeDeletePartnerDialog();
            }}
          >
            Annuler
          </Button>
        </div>
      </div>
    ),
    className: "w-[500px]",
  });

  return {
    deletePartnerDialog,
    openDeletePartnerDialog,
    closeDeletePartnerDialog,
  };
};
