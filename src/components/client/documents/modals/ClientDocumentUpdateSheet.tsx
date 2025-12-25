"use client";

import React from "react";
import { Pencil } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { ClientDocumentUpdateForm } from "../forms/ClientDocumentUpdateForm";
import type { UpdateDocumentRequest } from "@/api/client/documents";
import type { DocumentWithDetails } from "@/types/document.types";

interface UseClientDocumentUpdateSheetOptions {
  updateDocument?: (data: UpdateDocumentRequest) => void | Promise<void>;
  isUpdatePending?: boolean;
  resetDocument?: () => void;
  document?: DocumentWithDetails | null;
}

export const useClientDocumentUpdateSheet = ({
  updateDocument,
  isUpdatePending = false,
  resetDocument,
  document,
}: UseClientDocumentUpdateSheetOptions) => {
  const {
    SheetFragment: updateDocumentSheet,
    openSheet: openUpdateDocumentSheet,
    closeSheet: closeUpdateDocumentSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <Pencil className="h-4 w-4" />
        Modifier le document
      </div>
    ),
    description: "Modifier les informations du document",
    children: (
      <ClientDocumentUpdateForm
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

