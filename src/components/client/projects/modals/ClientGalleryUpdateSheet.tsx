"use client";

import React from "react";
import { Image } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { GalleryUpdateForm } from "@/components/admin/projects/details/project-gallery/forms/GalleryUpdateForm";
import type { UpdateGalleryItemRequest } from "@/api/client/gallery";
import type { ProjectGalleryItem } from "@/types/gallery.types";

interface UseClientGalleryUpdateSheetOptions {
  updateGalleryItem?: (data: {
    galleryId: string;
    data: UpdateGalleryItemRequest;
  }) => void | Promise<void>;
  isUpdatePending?: boolean;
  resetGalleryItem?: () => void;
  galleryItem?: ProjectGalleryItem | null;
  projectId: string;
}

// Wrapper to match GalleryUpdateForm's expected signature
const wrapUpdateGalleryItem = (
  updateFn: ((data: { galleryId: string; data: UpdateGalleryItemRequest }) => void | Promise<void>) | undefined,
  projectId: string
) => {
  if (!updateFn) return undefined;
  return (data: { projectId: string; galleryId: string; data: UpdateGalleryItemRequest }) => {
    updateFn({ galleryId: data.galleryId, data: data.data });
  };
};

export const useClientGalleryUpdateSheet = ({
  updateGalleryItem,
  isUpdatePending = false,
  resetGalleryItem,
  galleryItem,
  projectId,
}: UseClientGalleryUpdateSheetOptions) => {
  const {
    SheetFragment: updateGallerySheet,
    openSheet: openUpdateGallerySheet,
    closeSheet: closeUpdateGallerySheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <Image className="h-4 w-4" />
        Modifier l'Élément de Galerie
      </div>
    ),
    description: "Modifier les informations de l'élément de galerie",
    children: (
      <GalleryUpdateForm
        className="my-4"
        updateGalleryItem={wrapUpdateGalleryItem(updateGalleryItem, projectId)}
        isUpdatePending={isUpdatePending}
        galleryItem={galleryItem}
        projectId={projectId}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: () => {
      resetGalleryItem?.();
    },
  });

  return {
    updateGallerySheet,
    openUpdateGallerySheet,
    closeUpdateGallerySheet,
  };
};

