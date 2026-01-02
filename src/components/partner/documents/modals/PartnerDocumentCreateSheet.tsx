"use client";

import React from "react";
import { Upload } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { PartnerDocumentCreateForm } from "../forms/PartnerDocumentCreateForm";
import type { CreatePartnerDocumentRequest } from "@/api/partner/documents";

interface UsePartnerDocumentCreateSheetOptions {
  createDocument?: (data: CreatePartnerDocumentRequest) => void | Promise<void>;
  isCreatePending?: boolean;
  resetDocument?: () => void;
  projects?: Array<{ id: string; name: string }>;
}

export const usePartnerDocumentCreateSheet = ({
  createDocument,
  isCreatePending = false,
  resetDocument,
  projects = [],
}: UsePartnerDocumentCreateSheetOptions) => {
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
      <PartnerDocumentCreateForm
        className="my-4"
        createDocument={createDocument}
        isCreatePending={isCreatePending}
        projects={projects}
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


