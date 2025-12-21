"use client";

import React from "react";
import { UserPlus } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { ClientCreateForm } from "../forms/ClientCreateForm";
import type { CreateClientRequest } from "@/types/client.types";

interface UseClientCreateSheetOptions {
  createClient?: (data: CreateClientRequest) => void | Promise<void>;
  isCreatePending?: boolean;
  resetClient?: () => void;
}

export const useClientCreateSheet = ({
  createClient,
  isCreatePending = false,
  resetClient,
}: UseClientCreateSheetOptions) => {
  const {
    SheetFragment: createClientSheet,
    openSheet: openCreateClientSheet,
    closeSheet: closeCreateClientSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <UserPlus className="h-4 w-4" />
        Nouveau Client
      </div>
    ),
    description: "Créer un nouveau compte client",
    children: (
      <ClientCreateForm
        className="my-4"
        createClient={createClient}
        isCreatePending={isCreatePending}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: () => {
      resetClient?.();
    },
  });

  return {
    createClientSheet,
    openCreateClientSheet,
    closeCreateClientSheet,
  };
};
