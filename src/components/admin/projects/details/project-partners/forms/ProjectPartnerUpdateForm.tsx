"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { UpdateProjectPartnerRequest } from "@/api/admin/project-partners";
import type { ProjectPartnerWithDetails } from "@/api/admin/project-partners";

interface ProjectPartnerUpdateFormProps {
  className?: string;
  updatePartner?: (data: {
    partnerId: string;
    data: UpdateProjectPartnerRequest;
  }) => void;
  isUpdatePending?: boolean;
  projectPartner?: ProjectPartnerWithDetails | null;
  projectId: string;
}

export const ProjectPartnerUpdateForm: React.FC<
  ProjectPartnerUpdateFormProps
> = ({
  className,
  updatePartner,
  isUpdatePending = false,
  projectPartner,
  projectId,
}) => {
  const [formData, setFormData] = useState<UpdateProjectPartnerRequest>({
    role: "",
    is_primary: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (projectPartner) {
      setFormData({
        role: projectPartner.role || "",
        is_primary: projectPartner.is_primary || false,
      });
      setErrors({});
    }
  }, [projectPartner]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!projectPartner?.id) {
      toast.error("ID du partenaire manquant");
      return;
    }

    updatePartner?.({
      partnerId: projectPartner.id,
      data: formData,
    });
  };

  const handleChange = (
    field: keyof UpdateProjectPartnerRequest,
    value: string | boolean | null
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

  if (!projectPartner) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun partenaire sélectionné
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label>Partenaire</Label>
        <div className="p-3 bg-muted rounded-md">
          <p className="font-medium">{projectPartner.partner?.name || "N/A"}</p>
          <p className="text-sm text-muted-foreground">
            {projectPartner.partner?.email || "—"}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Rôle</Label>
        <Input
          id="role"
          placeholder="Ex: Architecte principal, Consultant..."
          value={formData.role || ""}
          onChange={(e) => handleChange("role", e.target.value)}
          disabled={isUpdatePending}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_primary"
          checked={formData.is_primary}
          onCheckedChange={(checked) =>
            handleChange("is_primary", checked === true)
          }
          disabled={isUpdatePending}
        />
        <Label
          htmlFor="is_primary"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Partenaire principal
        </Label>
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
