"use client";

import React from "react";
import { ImagePlus } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { GalleryItemCreateForm } from "../forms/GalleryItemCreateForm";
import type { CreateGalleryItemRequest } from "@/api/admin/chantiers";

interface UseGalleryItemCreateSheetOptions {
  createGalleryItem?: (data: CreateGalleryItemRequest) => void;
  isCreatePending?: boolean;
  chantierId: string;
}

export const useGalleryItemCreateSheet = ({
  createGalleryItem,
  isCreatePending = false,
  chantierId,
}: UseGalleryItemCreateSheetOptions) => {
  const {
    SheetFragment: createGalleryItemSheet,
    openSheet: openCreateGalleryItemSheet,
    closeSheet: closeCreateGalleryItemSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <ImagePlus className="h-4 w-4" />
        Ajouter une photo/vidéo
      </div>
    ),
    description: "Ajouter un nouvel élément à la galerie du chantier",
    children: (
      <GalleryItemCreateForm
        className="my-4"
        createGalleryItem={createGalleryItem}
        isCreatePending={isCreatePending}
        chantierId={chantierId}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
  });

  return {
    createGalleryItemSheet,
    openCreateGalleryItemSheet,
    closeCreateGalleryItemSheet,
  };
};
