"use client";

import React from "react";
import { Edit } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { PartnerDocumentUpdateForm } from "../forms/PartnerDocumentUpdateForm";
import type { UpdatePartnerDocumentRequest } from "@/api/partner/documents";
import type { DocumentWithDetails } from "@/types/document.types";

interface UsePartnerDocumentUpdateSheetOptions {
  updateDocument?: (data: UpdatePartnerDocumentRequest) => void | Promise<void>;
  isUpdatePending?: boolean;
  resetDocument?: () => void;
  document?: DocumentWithDetails | null;
}

export const usePartnerDocumentUpdateSheet = ({
  updateDocument,
  isUpdatePending = false,
  resetDocument,
  document,
}: UsePartnerDocumentUpdateSheetOptions) => {
  const {
    SheetFragment: updateDocumentSheet,
    openSheet: openUpdateDocumentSheet,
    closeSheet: closeUpdateDocumentSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <Edit className="h-4 w-4" />
        Modifier le document
      </div>
    ),
    description: "Modifier les informations du document",
    children: (
      <PartnerDocumentUpdateForm
        className="my-4"
        updateDocument={updateDocument}
        isUpdatePending={isUpdatePending}
        document={document}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: () => {
      resetDocument?.();
    },
  });

  return {
    updateDocumentSheet,
    openUpdateDocumentSheet,
    closeUpdateDocumentSheet,
  };
};


