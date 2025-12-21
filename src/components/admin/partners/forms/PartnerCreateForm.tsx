"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CreatePartnerRequest, PartnerType } from "@/api/admin/partners";
import { usePartnerStore } from "@/hooks/stores/usePartnerStore";

interface PartnerCreateFormProps {
  className?: string;
  createPartner?: (data: CreatePartnerRequest) => void;
  isCreatePending?: boolean;
}

const partnerTypeOptions = [
  { value: "architecte", label: "Architecte" },
  { value: "bureau_études", label: "Bureau d'études" },
  { value: "maître_d_œuvre", label: "Maître d'œuvre" },
  { value: "artisan", label: "Artisan" },
  { value: "fournisseur", label: "Fournisseur" },
  { value: "autre", label: "Autre" },
];

const statusOptions = [
  { value: "Actif", label: "Actif" },
  { value: "Inactif", label: "Inactif" },
];

export const PartnerCreateForm = ({
  className,
  createPartner,
  isCreatePending = false,
}: PartnerCreateFormProps) => {
  const partnerStore = usePartnerStore();
  const formData = partnerStore.createDto;
  const errors = partnerStore.createDtoErrors;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    partnerStore.set("createDtoErrors", {});

    // Validation
    if (!formData.email.trim()) {
      partnerStore.set("createDtoErrors", { email: "L'email est requis" });
      return;
    }
    if (!formData.password.trim()) {
      partnerStore.set("createDtoErrors", {
        password: "Le mot de passe est requis",
      });
      return;
    }
    if (!formData.full_name.trim()) {
      partnerStore.set("createDtoErrors", {
        full_name: "Le nom complet est requis",
      });
      return;
    }
    if (!formData.name.trim()) {
      partnerStore.set("createDtoErrors", {
        name: "Le nom de l'entreprise est requis",
      });
      return;
    }
    if (!formData.type) {
      partnerStore.set("createDtoErrors", {
        type: "Le type de partenaire est requis",
      });
      return;
    }
    createPartner?.(formData);
  };

  const handleChange = (field: keyof CreatePartnerRequest, value: string) => {
    partnerStore.setCreateField(field, value);
    if (errors[field]) {
      partnerStore.set("createDtoErrors", {
        ...errors,
        [field]: undefined,
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
        {/* User Account Section */}
        <div className="space-y-4 pb-4 border-b">
          <h3 className="text-sm font-semibold">Compte utilisateur</h3>

          <div className="space-y-2">
            <Label htmlFor="full_name">
              Nom complet <span className="text-destructive">*</span>
            </Label>
            <Input
              id="full_name"
              placeholder="Prénom Nom"
              value={formData.full_name}
              onChange={(e) => handleChange("full_name", e.target.value)}
              required
              disabled={isCreatePending}
              className={errors.full_name ? "border-destructive" : ""}
            />
            {errors.full_name && (
              <p className="text-sm text-destructive">{errors.full_name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email@entreprise.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                disabled={isCreatePending}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Mot de passe <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
                disabled={isCreatePending}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>
          </div>
        </div>

        {/* Partner Information Section */}
        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-semibold">Informations partenaire</h3>

          <div className="space-y-2">
            <Label htmlFor="name">
              Nom de l'entreprise <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Ex: Cabinet Architecture"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              disabled={isCreatePending}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">
                Type de partenaire <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  handleChange("type", value as CreatePartnerRequest["type"])
                }
                disabled={isCreatePending}
              >
                <SelectTrigger
                  className={errors.type ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {partnerTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-destructive">{errors.type}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value)}
                disabled={isCreatePending}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_person">Nom du contact</Label>
            <Input
              id="contact_person"
              placeholder="Nom complet"
              value={formData.contact_person}
              onChange={(e) => handleChange("contact_person", e.target.value)}
              disabled={isCreatePending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              placeholder="01 00 00 00 00"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              disabled={isCreatePending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse complète</Label>
            <Input
              id="address"
              placeholder="Adresse complète"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              disabled={isCreatePending}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">
                Ville <span className="text-destructive">*</span>
              </Label>
              <Input
                id="city"
                placeholder="Ville"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                disabled={isCreatePending}
                className={errors.city ? "border-destructive" : ""}
              />
              {errors.city && (
                <p className="text-sm text-destructive">{errors.city}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="postal_code">Code postal</Label>
              <Input
                id="postal_code"
                placeholder="75000"
                value={formData.postal_code}
                onChange={(e) => handleChange("postal_code", e.target.value)}
                disabled={isCreatePending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="since_date">Date de partenariat</Label>
            <Input
              id="since_date"
              type="date"
              value={formData.since_date}
              onChange={(e) => handleChange("since_date", e.target.value)}
              disabled={isCreatePending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Description</Label>
            <Textarea
              id="notes"
              placeholder="Description de l'activité..."
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              disabled={isCreatePending}
              rows={4}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              partnerStore.reset();
            }}
            disabled={isCreatePending}
          >
            Réinitialiser
          </Button>
          <Button type="submit" disabled={isCreatePending}>
            {isCreatePending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Créer le partenaire
          </Button>
        </div>
      </form>
    </div>
  );
};
