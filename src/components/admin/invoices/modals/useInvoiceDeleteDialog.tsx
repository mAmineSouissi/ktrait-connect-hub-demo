"use client";

import { useDialog } from "@/components/shared/Dialogs";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import type { Invoice } from "@/types/invoice.types";

interface UseInvoiceDeleteDialogOptions {
  deleteInvoice: (id: string) => void;
  isDeleting?: boolean;
  invoice?: Invoice | null;
}

export const useInvoiceDeleteDialog = ({
  deleteInvoice,
  isDeleting = false,
  invoice,
}: UseInvoiceDeleteDialogOptions) => {
  const {
    DialogFragment: deleteInvoiceDialog,
    openDialog: openDeleteInvoiceDialog,
    closeDialog: closeDeleteInvoiceDialog,
  } = useDialog({
    title: (
      <div className="flex items-center gap-2">
        <Trash2 className="h-4 w-4 text-destructive" />
        Supprimer la facture
      </div>
    ),
    description:
      "Êtes-vous sûr de vouloir supprimer définitivement cette facture ?",
    children: (
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          {invoice && (
            <>
              Cette action va <strong>supprimer définitivement</strong> la{" "}
              {invoice.type === "devis" ? "devis" : "facture"}{" "}
              <strong>{invoice.invoice_number}</strong> ainsi que tous ses
              articles associés. Cette action est irréversible.
            </>
          )}
        </p>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => closeDeleteInvoiceDialog()}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              if (invoice) {
                await deleteInvoice(invoice.id);
                closeDeleteInvoiceDialog();
              }
            }}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Suppression...
              </>
            ) : (
              "Supprimer définitivement"
            )}
          </Button>
        </div>
      </div>
    ),
  });

  return {
    deleteInvoiceDialog,
    openDeleteInvoiceDialog,
    closeDeleteInvoiceDialog,
  };
};
