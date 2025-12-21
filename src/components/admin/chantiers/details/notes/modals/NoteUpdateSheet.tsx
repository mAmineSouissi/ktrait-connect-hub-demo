"use client";

import React from "react";
import { Pencil } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { NoteUpdateForm } from "../forms/NoteUpdateForm";
import type { UpdateNoteRequest } from "@/api/admin/chantiers";
import type { ChantierNoteRow } from "@/types/supabase-database.types";

interface UseNoteUpdateSheetOptions {
  updateNote?: (data: UpdateNoteRequest) => void;
  isUpdatePending?: boolean;
  note?: ChantierNoteRow | null;
}

export const useNoteUpdateSheet = ({
  updateNote,
  isUpdatePending = false,
  note,
}: UseNoteUpdateSheetOptions) => {
  const {
    SheetFragment: updateNoteSheet,
    openSheet: openUpdateNoteSheet,
    closeSheet: closeUpdateNoteSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <Pencil className="h-4 w-4" />
        Modifier la note
      </div>
    ),
    description: "Modifier les informations de la note",
    children: (
      <NoteUpdateForm
        className="my-4"
        updateNote={updateNote}
        isUpdatePending={isUpdatePending}
        note={note}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
  });

  return {
    updateNoteSheet,
    openUpdateNoteSheet,
    closeUpdateNoteSheet,
  };
};
