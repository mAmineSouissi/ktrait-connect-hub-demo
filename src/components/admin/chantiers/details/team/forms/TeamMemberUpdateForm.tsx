"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UpdateTeamMemberRequest } from "@/api/admin/chantiers";
import type { ChantierTeamRow } from "@/types/supabase-database.types";

interface TeamMemberUpdateFormProps {
  className?: string;
  updateTeamMember?: (data: UpdateTeamMemberRequest) => void;
  isUpdatePending?: boolean;
  teamMember?: ChantierTeamRow | null;
}

export const TeamMemberUpdateForm: React.FC<TeamMemberUpdateFormProps> = ({
  className,
  updateTeamMember,
  isUpdatePending = false,
  teamMember,
}) => {
  const [formData, setFormData] = React.useState<UpdateTeamMemberRequest>({
    name: "",
    role: "",
    phone: null,
    email: null,
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  useEffect(() => {
    if (teamMember) {
      setFormData({
        name: teamMember.name,
        role: teamMember.role,
        phone: teamMember.phone || null,
        email: teamMember.email || null,
      });
    }
  }, [teamMember]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (formData.name !== undefined && !formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    }
    if (formData.role !== undefined && !formData.role.trim()) {
      newErrors.role = "Le rôle est requis";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    updateTeamMember?.(formData);
  };

  const handleChange = (
    field: keyof UpdateTeamMemberRequest,
    value: string | null
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

  if (!teamMember) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun membre d'équipe sélectionné
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label htmlFor="name">
          Nom <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Ex: Michel Dupuis"
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

      <div className="space-y-2">
        <Label htmlFor="role">
          Rôle <span className="text-destructive">*</span>
        </Label>
        <Input
          id="role"
          placeholder="Ex: Chef de chantier, Maçon, Électricien"
          value={formData.role || ""}
          onChange={(e) => handleChange("role", e.target.value)}
          required
          disabled={isUpdatePending}
          className={errors.role ? "border-destructive" : ""}
        />
        {errors.role && (
          <p className="text-sm text-destructive">{errors.role}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            placeholder="Ex: 06 11 22 33 44"
            value={formData.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value || null)}
            disabled={isUpdatePending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Ex: michel@example.com"
            value={formData.email || ""}
            onChange={(e) => handleChange("email", e.target.value || null)}
            disabled={isUpdatePending}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isUpdatePending}>
          {isUpdatePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Mettre à jour
        </Button>
      </div>
    </form>
  );
};
