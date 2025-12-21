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
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { UpdatePhaseRequest } from "@/api/admin/phases";
import type { ProjectPhase } from "@/types/project.types";

interface PhaseUpdateFormProps {
  className?: string;
  updatePhase?: (data: {
    projectId: string;
    phaseId: string;
    data: UpdatePhaseRequest;
  }) => void;
  isUpdatePending?: boolean;
  phase?: ProjectPhase | null;
  projectId: string;
}

const statusOptions = [
  { value: "à_venir", label: "À venir" },
  { value: "en_cours", label: "En cours" },
  { value: "terminé", label: "Terminé" },
  { value: "bloqué", label: "Bloqué" },
];

export const PhaseUpdateForm: React.FC<PhaseUpdateFormProps> = ({
  className,
  updatePhase,
  isUpdatePending = false,
  phase,
  projectId,
}) => {
  const [formData, setFormData] = useState<UpdatePhaseRequest>({
    name: "",
    description: "",
    status: "à_venir",
    progress_percentage: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (phase) {
      setFormData({
        name: phase.name || "",
        description: phase.description || "",
        status: phase.status || "à_venir",
        progress_percentage: phase.progress_percentage || 0,
      });
      setErrors({});
    }
  }, [phase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!formData.name?.trim()) {
      setErrors({ name: "Le nom de la phase est requis" });
      return;
    }

    if (!phase?.id) {
      toast.error("ID de la phase manquant");
      return;
    }

    updatePhase?.({ projectId, phaseId: phase.id, data: formData });
  };

  const handleChange = (
    field: keyof UpdatePhaseRequest,
    value: string | number
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

  if (!phase) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune phase sélectionnée
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label htmlFor="name">
          Nom de la phase <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Ex: Fondations"
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
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Description de la phase..."
          value={formData.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          disabled={isUpdatePending}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select
            value={formData.status}
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
          <Label htmlFor="progress">
            Avancement: {formData.progress_percentage || 0}%
          </Label>
          <Slider
            value={[formData.progress_percentage || 0]}
            onValueChange={(value) =>
              handleChange("progress_percentage", value[0])
            }
            min={0}
            max={100}
            step={1}
            disabled={isUpdatePending}
            className="w-full"
          />
        </div>
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
