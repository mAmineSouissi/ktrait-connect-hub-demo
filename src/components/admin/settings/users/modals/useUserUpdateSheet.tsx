"use client";

import React from "react";
import { UserCog } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { UserUpdateForm } from "../forms/UserUpdateForm";
import type { UpdateUserRequest } from "@/types/user-management.types";
import type { UserDetail } from "@/types/user-management.types";

interface UseUserUpdateSheetOptions {
  updateUser?: (data: {
    id: string;
    data: UpdateUserRequest;
  }) => void | Promise<void>;
  isUpdatePending?: boolean;
  resetUser?: () => void;
  user?: UserDetail | null;
}

export const useUserUpdateSheet = ({
  updateUser,
  isUpdatePending = false,
  resetUser,
  user,
}: UseUserUpdateSheetOptions) => {
  const {
    SheetFragment: updateUserSheet,
    openSheet: openUpdateUserSheet,
    closeSheet: closeUpdateUserSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <UserCog className="h-4 w-4" />
        Modifier l'utilisateur
      </div>
    ),
    description: "Modifier les informations de l'utilisateur",
    children: (
      <UserUpdateForm
        className="my-4"
        updateUser={updateUser}
        isUpdatePending={isUpdatePending}
        user={user}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: () => {
      resetUser?.();
    },
  });

  return {
    updateUserSheet,
    openUpdateUserSheet,
    closeUpdateUserSheet,
  };
};
