"use client";

import React from "react";
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
import { useUserStore } from "@/hooks/stores/useUserStore";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CreateUserRequest } from "@/types/user-management.types";

interface UserCreateFormProps {
  className?: string;
  createUser?: (data: CreateUserRequest) => void;
  isCreatePending?: boolean;
}

const roleOptions = [
  { value: "client", label: "Client" },
  { value: "partner", label: "Partenaire" },
  { value: "admin", label: "Admin" },
];

export const UserCreateForm = ({
  className,
  createUser,
  isCreatePending = false,
}: UserCreateFormProps) => {
  const { createDto, setCreateField, createDtoErrors } = useUserStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser?.(createDto);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label htmlFor="fullName">
          Nom complet <span className="text-destructive">*</span>
        </Label>
        <Input
          id="fullName"
          placeholder="Prénom Nom"
          value={createDto.full_name}
          onChange={(e) => setCreateField("full_name", e.target.value)}
          required
          disabled={isCreatePending}
          className={createDtoErrors.full_name ? "border-destructive" : ""}
        />
        {createDtoErrors.full_name && (
          <p className="text-sm text-destructive">
            {Array.isArray(createDtoErrors.full_name)
              ? createDtoErrors.full_name[0]
              : createDtoErrors.full_name}
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
          value={createDto.email}
          onChange={(e) => setCreateField("email", e.target.value)}
          required
          disabled={isCreatePending}
          className={createDtoErrors.email ? "border-destructive" : ""}
        />
        {createDtoErrors.email && (
          <p className="text-sm text-destructive">
            {Array.isArray(createDtoErrors.email)
              ? createDtoErrors.email[0]
              : createDtoErrors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">
          Mot de passe{" "}
          {!createDto.password && (
            <span className="text-muted-foreground text-xs">
              (laissé vide pour générer automatiquement)
            </span>
          )}
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Laissez vide pour générer automatiquement"
          value={createDto.password}
          onChange={(e) => setCreateField("password", e.target.value)}
          disabled={isCreatePending}
          className={createDtoErrors.password ? "border-destructive" : ""}
        />
        {createDtoErrors.password && (
          <p className="text-sm text-destructive">
            {Array.isArray(createDtoErrors.password)
              ? createDtoErrors.password[0]
              : createDtoErrors.password}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+33 6 12 34 56 78"
          value={createDto.phone || ""}
          onChange={(e) => setCreateField("phone", e.target.value)}
          disabled={isCreatePending}
          className={createDtoErrors.phone ? "border-destructive" : ""}
        />
        {createDtoErrors.phone && (
          <p className="text-sm text-destructive">
            {Array.isArray(createDtoErrors.phone)
              ? createDtoErrors.phone[0]
              : createDtoErrors.phone}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">
          Rôle <span className="text-destructive">*</span>
        </Label>
        <Select
          value={createDto.role}
          onValueChange={(value) => setCreateField("role", value as any)}
          disabled={isCreatePending}
        >
          <SelectTrigger
            className={createDtoErrors.role ? "border-destructive" : ""}
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
        {createDtoErrors.role && (
          <p className="text-sm text-destructive">
            {Array.isArray(createDtoErrors.role)
              ? createDtoErrors.role[0]
              : createDtoErrors.role}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isCreatePending}>
          {isCreatePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Créer l'utilisateur
        </Button>
      </div>
    </form>
  );
};
