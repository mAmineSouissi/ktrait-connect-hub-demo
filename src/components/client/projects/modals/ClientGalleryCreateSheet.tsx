"use client";

import React from "react";
import { Image } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { GalleryCreateForm } from "@/components/admin/projects/details/project-gallery/forms/GalleryCreateForm";
import type { CreateGalleryItemRequest } from "@/api/client/gallery";

interface UseClientGalleryCreateSheetOptions {
  createGalleryItem?: (data: CreateGalleryItemRequest) => void | Promise<void>;
  isCreatePending?: boolean;
  resetGalleryItem?: () => void;
  projectId: string;
}

export const useClientGalleryCreateSheet = ({
  createGalleryItem,
  isCreatePending = false,
  resetGalleryItem,
  projectId,
}: UseClientGalleryCreateSheetOptions) => {
  const {
    SheetFragment: createGallerySheet,
    openSheet: openCreateGallerySheet,
    closeSheet: closeCreateGallerySheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <Image className="h-4 w-4" />
        Nouvel Élément de Galerie
      </div>
    ),
    description: "Ajouter un nouvel élément à la galerie du projet",
    children: (
      <GalleryCreateForm
        className="my-4"
        createGalleryItem={createGalleryItem}
        isCreatePending={isCreatePending}
        projectId={projectId}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: () => {
      resetGalleryItem?.();
    },
  });

  return {
    createGallerySheet,
    openCreateGallerySheet,
    closeCreateGallerySheet,
  };
};

