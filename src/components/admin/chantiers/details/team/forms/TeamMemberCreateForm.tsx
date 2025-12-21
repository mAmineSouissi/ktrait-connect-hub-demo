"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CreateTeamMemberRequest } from "@/api/admin/chantiers";

interface TeamMemberCreateFormProps {
  className?: string;
  createTeamMember?: (data: CreateTeamMemberRequest) => void;
  isCreatePending?: boolean;
  chantierId: string;
}

export const TeamMemberCreateForm: React.FC<TeamMemberCreateFormProps> = ({
  className,
  createTeamMember,
  isCreatePending = false,
  chantierId,
}) => {
  const [formData, setFormData] = React.useState<CreateTeamMemberRequest>({
    name: "",
    role: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Le nom est requis";
    if (!formData.role.trim()) newErrors.role = "Le rôle est requis";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    createTeamMember?.({
      ...formData,
      phone: formData.phone || null,
      email: formData.email || null,
    });
  };

  const handleChange = (
    field: keyof CreateTeamMemberRequest,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label htmlFor="name">
          Nom <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Ex: Michel Dupuis"
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

      <div className="space-y-2">
        <Label htmlFor="role">
          Rôle <span className="text-destructive">*</span>
        </Label>
        <Input
          id="role"
          placeholder="Ex: Chef de chantier, Maçon, Électricien"
          value={formData.role}
          onChange={(e) => handleChange("role", e.target.value)}
          required
          disabled={isCreatePending}
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
            onChange={(e) => handleChange("phone", e.target.value)}
            disabled={isCreatePending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Ex: michel@example.com"
            value={formData.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            disabled={isCreatePending}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isCreatePending}>
          {isCreatePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Ajouter
        </Button>
      </div>
    </form>
  );
};
