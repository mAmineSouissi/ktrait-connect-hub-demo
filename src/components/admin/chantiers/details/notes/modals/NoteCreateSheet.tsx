"use client";

import React from "react";
import { MessageSquarePlus } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { NoteCreateForm } from "../forms/NoteCreateForm";
import type { CreateNoteRequest } from "@/api/admin/chantiers";

interface UseNoteCreateSheetOptions {
  createNote?: (data: CreateNoteRequest) => void;
  isCreatePending?: boolean;
  chantierId: string;
}

export const useNoteCreateSheet = ({
  createNote,
  isCreatePending = false,
  chantierId,
}: UseNoteCreateSheetOptions) => {
  const {
    SheetFragment: createNoteSheet,
    openSheet: openCreateNoteSheet,
    closeSheet: closeCreateNoteSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <MessageSquarePlus className="h-4 w-4" />
        Ajouter une note
      </div>
    ),
    description: "Ajouter une nouvelle note au chantier",
    children: (
      <NoteCreateForm
        className="my-4"
        createNote={createNote}
        isCreatePending={isCreatePending}
        chantierId={chantierId}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
  });

  return {
    createNoteSheet,
    openCreateNoteSheet,
    closeCreateNoteSheet,
  };
};
