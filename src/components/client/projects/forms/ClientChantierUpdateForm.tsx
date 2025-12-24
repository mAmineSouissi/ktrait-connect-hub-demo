"use client";

import React, { useState, useEffect } from "react";
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
import type { UpdateChantierRequest } from "@/types/chantier.types";
import type { ChantierRow } from "@/types/supabase-database.types";

interface ClientChantierUpdateFormProps {
  className?: string;
  updateChantier?: (data: UpdateChantierRequest) => void;
  isUpdatePending?: boolean;
  chantier?: ChantierRow | null;
}

const statusOptions = [
  { value: "planifié", label: "Planifié" },
  { value: "en_cours", label: "En cours" },
  { value: "en_attente", label: "En attente" },
  { value: "terminé", label: "Terminé" },
  { value: "suspendu", label: "Suspendu" },
];

export const ClientChantierUpdateForm: React.FC<ClientChantierUpdateFormProps> = ({
  className,
  updateChantier,
  isUpdatePending = false,
  chantier,
}) => {
  const [formData, setFormData] = useState<UpdateChantierRequest>({
    name: "",
    location: "",
    description: "",
    status: "planifié",
    progress: 0,
    start_date: "",
    end_date: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (chantier) {
      setFormData({
        name: chantier.name || "",
        location: chantier.location || "",
        description: chantier.description || "",
        status: chantier.status || "planifié",
        progress: chantier.progress || 0,
        start_date: chantier.start_date || "",
        end_date: chantier.end_date || "",
      });
      setErrors({});
    }
  }, [chantier]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (formData.name !== undefined && !formData.name?.trim()) {
      setErrors({ name: "Le nom du chantier est requis" });
      return;
    }
    if (formData.location !== undefined && !formData.location?.trim()) {
      setErrors({ location: "La localisation est requise" });
      return;
    }

    updateChantier?.(formData);
  };

  const handleChange = (field: keyof UpdateChantierRequest, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  };

  if (!chantier) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun chantier sélectionné
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label htmlFor="name">
          Nom du chantier <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Ex: Site principal - Villa"
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
        <Label htmlFor="location">
          Localisation <span className="text-destructive">*</span>
        </Label>
        <Input
          id="location"
          placeholder="Ex: 123 Rue des Oliviers, 13100 Aix-en-Provence"
          value={formData.location || ""}
          onChange={(e) => handleChange("location", e.target.value)}
          required
          disabled={isUpdatePending}
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

        <div className="space-y-2">
          <Label htmlFor="progress">Avancement (%)</Label>
          <Input
            id="progress"
            type="number"
            placeholder="0"
            value={formData.progress || 0}
            onChange={(e) => handleChange("progress", parseInt(e.target.value) || 0)}
            disabled={isUpdatePending}
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
            disabled={isUpdatePending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date">Date de fin</Label>
          <Input
            id="end_date"
            type="date"
            value={formData.end_date || ""}
            onChange={(e) => handleChange("end_date", e.target.value)}
            disabled={isUpdatePending}
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
          disabled={isUpdatePending}
          rows={4}
        />
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

