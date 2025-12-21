"use client";

import React, { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AddProjectPartnerRequest } from "@/api/admin/project-partners";
import type { Partner } from "@/types/partner.types";

interface ProjectPartnerAddFormProps {
  className?: string;
  addPartner?: (data: AddProjectPartnerRequest) => void;
  isAddPending?: boolean;
  projectId: string;
  existingPartnerIds: string[];
  allPartners: Partner[];
}

// Partner type mapping for display
const partnerTypeMap: Record<string, string> = {
  architecte: "Architecte",
  bureau_études: "Bureau d'études",
  maître_d_œuvre: "Maître d'œuvre",
  artisan: "Artisan",
  fournisseur: "Fournisseur",
  autre: "Autre",
};

export const ProjectPartnerAddForm: React.FC<ProjectPartnerAddFormProps> = ({
  className,
  addPartner,
  isAddPending = false,
  projectId,
  existingPartnerIds,
  allPartners,
}) => {
  const [formData, setFormData] = useState<AddProjectPartnerRequest>({
    partner_id: "",
    role: "",
    is_primary: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter out already assigned partners
  const availablePartners = allPartners.filter(
    (partner) => !existingPartnerIds.includes(partner.id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (!formData.partner_id.trim()) {
      setErrors({ partner_id: "Veuillez sélectionner un partenaire" });
      return;
    }

    addPartner?.(formData);
  };

  const handleChange = (
    field: keyof AddProjectPartnerRequest,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label htmlFor="partner_id">
          Partenaire <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.partner_id}
          onValueChange={(value) => handleChange("partner_id", value)}
          disabled={isAddPending}
        >
          <SelectTrigger
            className={errors.partner_id ? "border-destructive" : ""}
          >
            <SelectValue placeholder="Sélectionner un partenaire" />
          </SelectTrigger>
          <SelectContent>
            {availablePartners.length === 0 ? (
              <SelectItem value="__none__" disabled>
                Aucun partenaire disponible
              </SelectItem>
            ) : (
              availablePartners.map((partner) => (
                <SelectItem key={partner.id} value={partner.id}>
                  {partner.name} -{" "}
                  {partnerTypeMap[partner.type] || partner.type}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {errors.partner_id && (
          <p className="text-sm text-destructive">{errors.partner_id}</p>
        )}
        {availablePartners.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Tous les partenaires sont déjà assignés à ce projet
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Rôle</Label>
        <Input
          id="role"
          placeholder="Ex: Architecte principal, Consultant..."
          value={formData.role}
          onChange={(e) => handleChange("role", e.target.value)}
          disabled={isAddPending}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_primary"
          checked={formData.is_primary}
          onCheckedChange={(checked) =>
            handleChange("is_primary", checked === true)
          }
          disabled={isAddPending}
        />
        <Label
          htmlFor="is_primary"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Partenaire principal
        </Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setFormData({
              partner_id: "",
              role: "",
              is_primary: false,
            });
            setErrors({});
          }}
          disabled={isAddPending}
        >
          Réinitialiser
        </Button>
        <Button type="submit" disabled={isAddPending || !formData.partner_id}>
          {isAddPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Ajouter le partenaire
        </Button>
      </div>
    </form>
  );
};
