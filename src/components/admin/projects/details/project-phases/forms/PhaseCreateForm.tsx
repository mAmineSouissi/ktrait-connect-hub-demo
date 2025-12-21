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
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CreatePhaseRequest } from "@/api/admin/phases";

interface PhaseCreateFormProps {
  className?: string;
  createPhase?: (data: CreatePhaseRequest) => void;
  isCreatePending?: boolean;
  projectId: string;
}

const statusOptions = [
  { value: "à_venir", label: "À venir" },
  { value: "en_cours", label: "En cours" },
  { value: "terminé", label: "Terminé" },
  { value: "bloqué", label: "Bloqué" },
];

export const PhaseCreateForm: React.FC<PhaseCreateFormProps> = ({
  className,
  createPhase,
  isCreatePending = false,
  projectId,
}) => {
  const [formData, setFormData] = useState<CreatePhaseRequest>({
    name: "",
    description: "",
    status: "à_venir",
    progress_percentage: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (!formData.name.trim()) {
      setErrors({ name: "Le nom de la phase est requis" });
      return;
    }

    createPhase?.(formData);
  };

  const handleChange = (
    field: keyof CreatePhaseRequest,
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

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label htmlFor="name">
          Nom de la phase <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Ex: Fondations"
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
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Description de la phase..."
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          disabled={isCreatePending}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select
            value={formData.status}
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
          <Label htmlFor="progress">
            Avancement: {formData.progress_percentage}%
          </Label>
          <Slider
            value={[formData.progress_percentage || 0]}
            onValueChange={(value) =>
              handleChange("progress_percentage", value[0])
            }
            min={0}
            max={100}
            step={1}
            disabled={isCreatePending}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setFormData({
              name: "",
              description: "",
              status: "à_venir",
              progress_percentage: 0,
            });
            setErrors({});
          }}
          disabled={isCreatePending}
        >
          Réinitialiser
        </Button>
        <Button type="submit" disabled={isCreatePending}>
          {isCreatePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Créer la phase
        </Button>
      </div>
    </form>
  );
};
