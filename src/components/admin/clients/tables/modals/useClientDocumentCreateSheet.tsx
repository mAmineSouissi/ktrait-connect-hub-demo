"use client";

import React from "react";
import { Upload } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { ClientDocumentCreateForm } from "../forms/ClientDocumentCreateForm";
import type { CreateDocumentRequest } from "@/api/admin/documents";

interface UseClientDocumentCreateSheetOptions {
  createDocument?: (data: CreateDocumentRequest) => void | Promise<void>;
  isCreatePending?: boolean;
  resetDocument?: () => void;
  clientId: string;
}

const resetForm = () => {
  // This will be handled by the form component itself
};

export const useClientDocumentCreateSheet = ({
  createDocument,
  isCreatePending = false,
  resetDocument,
  clientId,
}: UseClientDocumentCreateSheetOptions) => {
  const {
    SheetFragment: createDocumentSheet,
    openSheet: openCreateDocumentSheet,
    closeSheet: closeCreateDocumentSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <Upload className="h-4 w-4" />
        Ajouter un document
      </div>
    ),
    description: "Télécharger et créer un nouveau document pour ce client",
    children: (
      <ClientDocumentCreateForm
        className="my-4"
        createDocument={createDocument}
        isCreatePending={isCreatePending}
        clientId={clientId}
        onReset={resetDocument}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: (isOpen: boolean) => {
      if (!isOpen) {
        resetDocument?.();
      }
    },
  });

  return {
    createDocumentSheet,
    openCreateDocumentSheet,
    closeCreateDocumentSheet,
  };
};
