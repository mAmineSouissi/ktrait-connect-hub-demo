"use client";

import React from "react";
import { FolderPlus } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { ProjectCreateForm } from "../forms/ProjectCreateForm";
import type { CreateProjectRequest } from "@/api/admin/projects";
import type { ClientListItem } from "@/types/client.types";

interface UseProjectCreateSheetOptions {
  createProject?: (data: CreateProjectRequest) => void | Promise<void>;
  isCreatePending?: boolean;
  resetProject?: () => void;
  clients?: ClientListItem[];
}

export const useProjectCreateSheet = ({
  createProject,
  isCreatePending = false,
  resetProject,
  clients = [],
}: UseProjectCreateSheetOptions) => {
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
      <ProjectCreateForm
        className="my-4"
        createProject={createProject}
        isCreatePending={isCreatePending}
        clients={clients}
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
