"use client";

import React from "react";
import { Upload } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { DocumentCreateForm } from "../forms/DocumentCreateForm";
import type { CreateDocumentRequest } from "@/api/admin/documents";
import type { Project } from "@/types/project.types";

interface UseDocumentCreateSheetOptions {
  createDocument?: (data: CreateDocumentRequest) => void | Promise<void>;
  isCreatePending?: boolean;
  resetDocument?: () => void;
  projects?: Project[];
}

export const useDocumentCreateSheet = ({
  createDocument,
  isCreatePending = false,
  resetDocument,
  projects = [],
}: UseDocumentCreateSheetOptions) => {
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
      <DocumentCreateForm
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
