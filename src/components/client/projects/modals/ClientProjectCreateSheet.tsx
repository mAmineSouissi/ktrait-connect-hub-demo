"use client";

import React from "react";
import { FolderPlus } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { ClientProjectCreateForm } from "../forms/ClientProjectCreateForm";
import type { CreateProjectRequest } from "@/api/client/projects";

interface UseClientProjectCreateSheetOptions {
  createProject?: (data: CreateProjectRequest) => void | Promise<void>;
  isCreatePending?: boolean;
  resetProject?: () => void;
}

export const useClientProjectCreateSheet = ({
  createProject,
  isCreatePending = false,
  resetProject,
}: UseClientProjectCreateSheetOptions) => {
  const {
    SheetFragment: createProjectSheet,
    openSheet: openCreateProjectSheet,
    closeSheet: closeCreateProjectSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <FolderPlus className="h-4 w-4" />
        Nouveau Projet
      </div>
    ),
    description: "Créer un nouveau projet",
    children: (
      <ClientProjectCreateForm
        className="my-4"
        createProject={createProject}
        isCreatePending={isCreatePending}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: () => {
      resetProject?.();
    },
  });

  return {
    createProjectSheet,
    openCreateProjectSheet,
    closeCreateProjectSheet,
  };
};

