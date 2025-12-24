"use client";

import React from "react";
import { Upload } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { ClientDocumentCreateForm } from "../forms/ClientDocumentCreateForm";
import type { CreateDocumentRequest } from "@/api/client/documents";

interface UseClientDocumentCreateSheetOptions {
  createDocument?: (data: CreateDocumentRequest) => void | Promise<void>;
  isCreatePending?: boolean;
  resetDocument?: () => void;
  projectId: string;
}

export const useClientDocumentCreateSheet = ({
  createDocument,
  isCreatePending = false,
  resetDocument,
  projectId,
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
    description: "Télécharger et créer un nouveau document",
    children: (
      <ClientDocumentCreateForm
        className="my-4"
        createDocument={createDocument}
        isCreatePending={isCreatePending}
        projectId={projectId}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: () => {
      resetDocument?.();
    },
  });

  return {
    createDocumentSheet,
    openCreateDocumentSheet,
    closeCreateDocumentSheet,
  };
};

