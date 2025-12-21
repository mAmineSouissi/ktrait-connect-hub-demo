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
import { useClientStore } from "@/hooks/stores/useClientStore";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CreateClientRequest } from "@/types/client.types";

interface ClientCreateFormProps {
  className?: string;
  createClient?: (data: CreateClientRequest) => void;
  isCreatePending?: boolean;
}

export const ClientCreateForm = ({
  className,
  createClient,
  isCreatePending = false,
}: ClientCreateFormProps) => {
  const { createDto, setCreateField, createDtoErrors } = useClientStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createClient?.(createDto);
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
            {createDtoErrors.full_name}
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
          <p className="text-sm text-destructive">{createDtoErrors.email}</p>
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
          <p className="text-sm text-destructive">{createDtoErrors.password}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          placeholder="06 00 00 00 00"
          value={createDto.phone || ""}
          onChange={(e) => setCreateField("phone", e.target.value)}
          disabled={isCreatePending}
          className={createDtoErrors.phone ? "border-destructive" : ""}
        />
        {createDtoErrors.phone && (
          <p className="text-sm text-destructive">{createDtoErrors.phone}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">Ville</Label>
        <Input
          id="city"
          placeholder="Ville"
          value={createDto.city || ""}
          onChange={(e) => setCreateField("city", e.target.value)}
          disabled={isCreatePending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adresse complète</Label>
        <Input
          id="address"
          placeholder="Adresse complète"
          value={createDto.address || ""}
          onChange={(e) => setCreateField("address", e.target.value)}
          disabled={isCreatePending}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="postal_code">Code postal</Label>
          <Input
            id="postal_code"
            placeholder="Code postal"
            value={createDto.postal_code || ""}
            onChange={(e) => setCreateField("postal_code", e.target.value)}
            disabled={isCreatePending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company_name">Nom de l'entreprise</Label>
          <Input
            id="company_name"
            placeholder="Nom de l'entreprise"
            value={createDto.company_name || ""}
            onChange={(e) => setCreateField("company_name", e.target.value)}
            disabled={isCreatePending}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="submit"
          disabled={isCreatePending}
          className="min-w-[120px]"
        >
          {isCreatePending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Création...
            </>
          ) : (
            "Créer le client"
          )}
        </Button>
      </div>
    </form>
  );
};
