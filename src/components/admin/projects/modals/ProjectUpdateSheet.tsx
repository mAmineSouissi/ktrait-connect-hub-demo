"use client";

import React from "react";
import { FolderEdit } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { ProjectUpdateForm } from "../forms/ProjectUpdateForm";
import type { UpdateProjectRequest } from "@/api/admin/projects";
import type { Project } from "@/types/project.types";

interface UseProjectUpdateSheetOptions {
  updateProject?: (data: {
    id: string;
    data: UpdateProjectRequest;
  }) => void | Promise<void>;
  isUpdatePending?: boolean;
  resetProject?: () => void;
  project?: Project | null;
}

export const useProjectUpdateSheet = ({
  updateProject,
  isUpdatePending = false,
  resetProject,
  project,
}: UseProjectUpdateSheetOptions) => {
  const {
    SheetFragment: updateProjectSheet,
    openSheet: openUpdateProjectSheet,
    closeSheet: closeUpdateProjectSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <FolderEdit className="h-4 w-4" />
        Modifier le Projet
      </div>
    ),
    description: "Modifier les informations du projet",
    children: (
      <ProjectUpdateForm
        className="my-4"
        updateProject={updateProject}
        isUpdatePending={isUpdatePending}
        project={project}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: () => {
      resetProject?.();
    },
  });

  return {
    updateProjectSheet,
    openUpdateProjectSheet,
    closeUpdateProjectSheet,
  };
};
