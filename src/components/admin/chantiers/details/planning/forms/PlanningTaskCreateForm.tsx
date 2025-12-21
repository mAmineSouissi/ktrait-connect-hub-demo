"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CreatePlanningTaskRequest } from "@/api/admin/chantiers";

interface PlanningTaskCreateFormProps {
  className?: string;
  createPlanningTask?: (data: CreatePlanningTaskRequest) => void;
  isCreatePending?: boolean;
  chantierId: string;
}

export const PlanningTaskCreateForm: React.FC<PlanningTaskCreateFormProps> = ({
  className,
  createPlanningTask,
  isCreatePending = false,
  chantierId,
}) => {
  const [formData, setFormData] = React.useState<CreatePlanningTaskRequest>({
    task_name: "",
    description: "",
    start_date: "",
    end_date: "",
    progress: 0,
    order_index: 0,
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.task_name.trim()) {
      newErrors.task_name = "Le nom de la tâche est requis";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    createPlanningTask?.({
      ...formData,
      description: formData.description || null,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
    });
  };

  const handleChange = (
    field: keyof CreatePlanningTaskRequest,
    value: string | number | null
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
        <Label htmlFor="task_name">
          Nom de la tâche <span className="text-destructive">*</span>
        </Label>
        <Input
          id="task_name"
          placeholder="Ex: Fondations"
          value={formData.task_name}
          onChange={(e) => handleChange("task_name", e.target.value)}
          required
          disabled={isCreatePending}
          className={errors.task_name ? "border-destructive" : ""}
        />
        {errors.task_name && (
          <p className="text-sm text-destructive">{errors.task_name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Description de la tâche..."
          value={formData.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          disabled={isCreatePending}
          rows={3}
        />
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
        <Label htmlFor="progress">Avancement: {formData.progress}%</Label>
        <Slider
          id="progress"
          value={[formData.progress || 0]}
          onValueChange={(value) => handleChange("progress", value[0])}
          min={0}
          max={100}
          step={1}
          disabled={isCreatePending}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="order_index">Ordre d'affichage</Label>
        <Input
          id="order_index"
          type="number"
          placeholder="0"
          value={formData.order_index || 0}
          onChange={(e) =>
            handleChange("order_index", parseInt(e.target.value) || 0)
          }
          disabled={isCreatePending}
          min="0"
        />
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
