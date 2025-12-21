"use client";

import React from "react";
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
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { PartnerType, UpdatePartnerRequest } from "@/api/admin/partners";
import { PartnerWithDetails } from "@/types";
import { usePartnerStore } from "@/hooks/stores/usePartnerStore";

interface PartnerUpdateFormProps {
  className?: string;
  updatePartner?: (data: { id: string; data: UpdatePartnerRequest }) => void;
  isUpdatePending?: boolean;
  partner?: PartnerWithDetails | null; // Optional, will use store if not provided
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

export const PartnerUpdateForm = ({
  className,
  updatePartner,
  isUpdatePending = false,
  partner,
}: PartnerUpdateFormProps) => {
  const partnerStore = usePartnerStore();
  const formData = partnerStore.updateDto;
  const errors = partnerStore.updateDtoErrors;

  React.useEffect(() => {
    if (partner) {
      partnerStore.initializeUpdateDto(partner);
    } else if (partnerStore.response) {
      // If no partner prop but store has response, use that
      partnerStore.initializeUpdateDto(partnerStore.response);
    }
  }, [partner]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    partnerStore.set("updateDtoErrors", {});

    if (!formData.name?.trim()) {
      partnerStore.set("updateDtoErrors", {
        name: "Le nom de l'entreprise est requis",
      });
      return;
    }

    const partnerId = partnerStore.response?.id;
    if (!partnerId) {
      toast.error("ID du partenaire manquant");
      return;
    }

    updatePartner?.({ id: partnerId, data: formData });
  };

  const handleChange = (
    field: keyof UpdatePartnerRequest,
    value: string | null
  ) => {
    partnerStore.setUpdateField(field, value);
    if (errors[field as string]) {
      partnerStore.set("updateDtoErrors", {
        ...errors,
        [field]: undefined,
      });
    }
  };

  if (!partnerStore.response && !partner) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun partenaire sélectionné
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
        <div className="space-y-2">
          <Label htmlFor="name">
            Nom de l'entreprise <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Ex: Cabinet Architecture"
            value={formData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            disabled={isUpdatePending}
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
                handleChange("type", value as PartnerType)
              }
              disabled={isUpdatePending}
            >
              <SelectTrigger
                className={errors.type ? "border-destructive" : ""}
              >
                <SelectValue />
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
              disabled={isUpdatePending}
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
            value={formData.contact_person || ""}
            onChange={(e) => handleChange("contact_person", e.target.value)}
            disabled={isUpdatePending}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@entreprise.com"
              value={formData.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              disabled={isUpdatePending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              placeholder="01 00 00 00 00"
              value={formData.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              disabled={isUpdatePending}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Adresse complète</Label>
          <Input
            id="address"
            placeholder="Adresse complète"
            value={formData.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
            disabled={isUpdatePending}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Ville</Label>
            <Input
              id="city"
              placeholder="Ville"
              value={formData.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
              disabled={isUpdatePending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="postal_code">Code postal</Label>
            <Input
              id="postal_code"
              placeholder="75000"
              value={formData.postal_code || ""}
              onChange={(e) => handleChange("postal_code", e.target.value)}
              disabled={isUpdatePending}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="since_date">Date de partenariat</Label>
          <Input
            id="since_date"
            type="date"
            value={formData.since_date || ""}
            onChange={(e) => handleChange("since_date", e.target.value)}
            disabled={isUpdatePending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Description</Label>
          <Textarea
            id="notes"
            placeholder="Description de l'activité..."
            value={formData.notes || ""}
            onChange={(e) => handleChange("notes", e.target.value)}
            disabled={isUpdatePending}
            rows={4}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={isUpdatePending}>
            {isUpdatePending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Enregistrer les modifications
          </Button>
        </div>
      </form>
    </div>
  );
};
