"use client";

import React from "react";
import { Users } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { ClientUpdateForm } from "../forms/ClientUpdateForm";
import type { UpdateClientRequest } from "@/types/client.types";

interface UseClientUpdateSheetOptions {
  updateClient?: (data: {
    id: string;
    data: UpdateClientRequest;
  }) => void | Promise<void>;
  isUpdatePending?: boolean;
  resetClient?: () => void;
}

export const useClientUpdateSheet = ({
  updateClient,
  isUpdatePending = false,
  resetClient,
}: UseClientUpdateSheetOptions) => {
  const {
    SheetFragment: updateClientSheet,
    openSheet: openUpdateClientSheet,
    closeSheet: closeUpdateClientSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        Modifier le Client
      </div>
    ),
    description: "Modifier les informations du client",
    children: (
      <ClientUpdateForm
        className="my-4"
        updateClient={updateClient}
        isUpdatePending={isUpdatePending}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: () => {
      resetClient?.();
    },
  });

  return {
    updateClientSheet,
    openUpdateClientSheet,
    closeUpdateClientSheet,
  };
};
