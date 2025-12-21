"use client";

import React from "react";
import { Pencil } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { GalleryItemUpdateForm } from "../forms/GalleryItemUpdateForm";
import type { UpdateGalleryItemRequest } from "@/api/admin/chantiers";
import type { ChantierGalleryRow } from "@/types/supabase-database.types";

interface UseGalleryItemUpdateSheetOptions {
  updateGalleryItem?: (data: UpdateGalleryItemRequest) => void;
  isUpdatePending?: boolean;
  galleryItem?: ChantierGalleryRow | null;
}

export const useGalleryItemUpdateSheet = ({
  updateGalleryItem,
  isUpdatePending = false,
  galleryItem,
}: UseGalleryItemUpdateSheetOptions) => {
  const {
    SheetFragment: updateGalleryItemSheet,
    openSheet: openUpdateGalleryItemSheet,
    closeSheet: closeUpdateGalleryItemSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <Pencil className="h-4 w-4" />
        Modifier l'élément de galerie
      </div>
    ),
    description: "Modifier les informations de l'élément de galerie",
    children: (
      <GalleryItemUpdateForm
        className="my-4"
        updateGalleryItem={updateGalleryItem}
        isUpdatePending={isUpdatePending}
        galleryItem={galleryItem}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
  });

  return {
    updateGalleryItemSheet,
    openUpdateGalleryItemSheet,
    closeUpdateGalleryItemSheet,
  };
};
