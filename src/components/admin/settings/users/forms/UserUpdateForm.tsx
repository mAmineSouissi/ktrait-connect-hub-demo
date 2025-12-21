"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { UpdateUserRequest } from "@/types/user-management.types";

interface UserUpdateFormProps {
  className?: string;
  updateUser?: (data: { id: string; data: UpdateUserRequest }) => void;
  isUpdatePending?: boolean;
  user?: any;
}

const roleOptions = [
  { value: "client", label: "Client" },
  { value: "partner", label: "Partenaire" },
  { value: "admin", label: "Admin" },
];

export const UserUpdateForm = ({
  className,
  updateUser,
  isUpdatePending = false,
  user,
}: UserUpdateFormProps) => {
  const { updateDto, setUpdateField, updateDtoErrors, response } =
    useUserStore();

  // Ensure form is populated when user changes
  useEffect(() => {
    if (user && user.id === response?.id) {
      // Form should already be initialized by UserManagement
    }
  }, [user, response]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!updateDto.full_name?.trim()) {
      return;
    }

    if (!response?.id) {
      toast.error("ID de l'utilisateur manquant");
      return;
    }

    updateUser?.({ id: response.id, data: updateDto });
  };

  if (!response) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun utilisateur sélectionné
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label htmlFor="fullName">
          Nom complet <span className="text-destructive">*</span>
        </Label>
        <Input
          id="fullName"
          placeholder="Prénom Nom"
          value={updateDto.full_name || ""}
          onChange={(e) => setUpdateField("full_name", e.target.value)}
          required
          disabled={isUpdatePending}
          className={updateDtoErrors.full_name ? "border-destructive" : ""}
        />
        {updateDtoErrors.full_name && (
          <p className="text-sm text-destructive">
            {Array.isArray(updateDtoErrors.full_name)
              ? updateDtoErrors.full_name[0]
              : updateDtoErrors.full_name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="email@exemple.com"
          value={updateDto.email || ""}
          onChange={(e) => setUpdateField("email", e.target.value)}
          required
          disabled={isUpdatePending}
          className={updateDtoErrors.email ? "border-destructive" : ""}
        />
        {updateDtoErrors.email && (
          <p className="text-sm text-destructive">
            {Array.isArray(updateDtoErrors.email)
              ? updateDtoErrors.email[0]
              : updateDtoErrors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+33 6 12 34 56 78"
          value={updateDto.phone || ""}
          onChange={(e) => setUpdateField("phone", e.target.value)}
          disabled={isUpdatePending}
          className={updateDtoErrors.phone ? "border-destructive" : ""}
        />
        {updateDtoErrors.phone && (
          <p className="text-sm text-destructive">
            {Array.isArray(updateDtoErrors.phone)
              ? updateDtoErrors.phone[0]
              : updateDtoErrors.phone}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">
          Rôle <span className="text-destructive">*</span>
        </Label>
        <Select
          value={updateDto.role || "client"}
          onValueChange={(value) => setUpdateField("role", value as any)}
          disabled={isUpdatePending}
        >
          <SelectTrigger
            className={updateDtoErrors.role ? "border-destructive" : ""}
          >
            <SelectValue placeholder="Sélectionner un rôle" />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {updateDtoErrors.role && (
          <p className="text-sm text-destructive">
            {Array.isArray(updateDtoErrors.role)
              ? updateDtoErrors.role[0]
              : updateDtoErrors.role}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between space-x-2">
        <div className="space-y-0.5">
          <Label htmlFor="is_active">Compte actif</Label>
          <p className="text-sm text-muted-foreground">
            Activer ou désactiver le compte utilisateur
          </p>
        </div>
        <Switch
          id="is_active"
          checked={updateDto.is_active ?? true}
          onCheckedChange={(checked) => setUpdateField("is_active", checked)}
          disabled={isUpdatePending}
        />
      </div>

      <div className="flex items-center justify-between space-x-2">
        <div className="space-y-0.5">
          <Label htmlFor="email_verified">Email vérifié</Label>
          <p className="text-sm text-muted-foreground">
            Marquer l'email comme vérifié
          </p>
        </div>
        <Switch
          id="email_verified"
          checked={updateDto.email_verified ?? false}
          onCheckedChange={(checked) =>
            setUpdateField("email_verified", checked)
          }
          disabled={isUpdatePending}
        />
      </div>

      <div className="space-y-2 border-t pt-4">
        <Label htmlFor="approval_status">
          Statut d'approbation <span className="text-destructive">*</span>
        </Label>
        <Select
          value={updateDto.approval_status || "pending"}
          onValueChange={(value) =>
            setUpdateField("approval_status", value as any)
          }
          disabled={isUpdatePending || response?.role === "admin"}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="approved">Approuvé</SelectItem>
            <SelectItem value="rejected">Rejeté</SelectItem>
          </SelectContent>
        </Select>
        {updateDto.approval_status === "rejected" && (
          <div className="space-y-2">
            <Label htmlFor="rejection_reason">
              Raison du rejet (optionnel)
            </Label>
            <Input
              id="rejection_reason"
              placeholder="Expliquez pourquoi le compte a été rejeté..."
              value={updateDto.rejection_reason || ""}
              onChange={(e) =>
                setUpdateField("rejection_reason", e.target.value || null)
              }
              disabled={isUpdatePending}
            />
          </div>
        )}
        {response?.role === "admin" && (
          <p className="text-xs text-muted-foreground">
            Les administrateurs sont automatiquement approuvés
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isUpdatePending}>
          {isUpdatePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enregistrer les modifications
        </Button>
      </div>
    </form>
  );
};
