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
import type { CreateChantierRequest } from "@/types/chantier.types";

interface ClientChantierCreateFormProps {
  className?: string;
  createChantier?: (data: CreateChantierRequest) => void;
  isCreatePending?: boolean;
  projectId: string;
}

const statusOptions = [
  { value: "planifié", label: "Planifié" },
  { value: "en_cours", label: "En cours" },
  { value: "en_attente", label: "En attente" },
  { value: "terminé", label: "Terminé" },
  { value: "suspendu", label: "Suspendu" },
];

export const ClientChantierCreateForm: React.FC<ClientChantierCreateFormProps> = ({
  className,
  createChantier,
  isCreatePending = false,
  projectId,
}) => {
  const [formData, setFormData] = useState<Omit<CreateChantierRequest, "project_id">>({
    name: "",
    location: "",
    description: "",
    status: "planifié",
    progress: 0,
    start_date: "",
    end_date: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!formData.name?.trim()) {
      setErrors({ name: "Le nom du chantier est requis" });
      return;
    }
    if (!formData.location?.trim()) {
      setErrors({ location: "La localisation est requise" });
      return;
    }

    createChantier?.({
      ...formData,
      project_id: projectId, // Always use the current project
    });
  };

  const handleChange = (field: keyof typeof formData, value: string | number) => {
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
          Nom du chantier <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Ex: Site principal - Villa"
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
        <Label htmlFor="location">
          Localisation <span className="text-destructive">*</span>
        </Label>
        <Input
          id="location"
          placeholder="Ex: 123 Rue des Oliviers, 13100 Aix-en-Provence"
          value={formData.location}
          onChange={(e) => handleChange("location", e.target.value)}
          required
          disabled={isCreatePending}
          className={errors.location ? "border-destructive" : ""}
        />
        {errors.location && (
          <p className="text-sm text-destructive">{errors.location}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select
            value={formData.status || "planifié"}
            onValueChange={(value) => handleChange("status", value as any)}
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

        <div className="space-y-2">
          <Label htmlFor="progress">Avancement (%)</Label>
          <Input
            id="progress"
            type="number"
            placeholder="0"
            value={formData.progress || 0}
            onChange={(e) => handleChange("progress", parseInt(e.target.value) || 0)}
            disabled={isCreatePending}
            min="0"
            max="100"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Date de début</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date || ""}
            onChange={(e) => handleChange("start_date", e.target.value)}
            disabled={isCreatePending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date">Date de fin</Label>
          <Input
            id="end_date"
            type="date"
            value={formData.end_date || ""}
            onChange={(e) => handleChange("end_date", e.target.value)}
            disabled={isCreatePending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Description du chantier..."
          value={formData.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          disabled={isCreatePending}
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isCreatePending}>
          {isCreatePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Créer le chantier
        </Button>
      </div>
    </form>
  );
};

