"use client";

import React from "react";
import { UserPlus } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { UserCreateForm } from "../forms/UserCreateForm";
import type { CreateUserRequest } from "@/types/user-management.types";

interface UseUserCreateSheetOptions {
  createUser?: (data: CreateUserRequest) => void | Promise<void>;
  isCreatePending?: boolean;
  resetUser?: () => void;
}

export const useUserCreateSheet = ({
  createUser,
  isCreatePending = false,
  resetUser,
}: UseUserCreateSheetOptions) => {
  const {
    SheetFragment: createUserSheet,
    openSheet: openCreateUserSheet,
    closeSheet: closeCreateUserSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <UserPlus className="h-4 w-4" />
        Nouvel utilisateur
      </div>
    ),
    description: "Créer un nouveau compte utilisateur",
    children: (
      <UserCreateForm
        className="my-4"
        createUser={createUser}
        isCreatePending={isCreatePending}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: () => {
      resetUser?.();
    },
  });

  return {
    createUserSheet,
    openCreateUserSheet,
    closeCreateUserSheet,
  };
};
