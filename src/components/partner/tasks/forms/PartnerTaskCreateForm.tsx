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
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CreatePartnerTaskRequest } from "@/api/partner/projects";

interface PartnerTaskCreateFormProps {
  className?: string;
  onSubmit?: (data: CreatePartnerTaskRequest) => void;
  isPending?: boolean;
  projects: Array<{ id: string; name: string }>;
}

export const PartnerTaskCreateForm: React.FC<PartnerTaskCreateFormProps> = ({
  className,
  onSubmit,
  isPending = false,
  projects,
}) => {
  const [formData, setFormData] = React.useState<CreatePartnerTaskRequest>({
    project_id: "",
    name: "",
    description: "",
    status: "à_faire",
    priority: "moyenne",
    assigned_to: null,
    due_date: "",
    start_date: "",
    progress: 0,
    order_index: 0,
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateDates = (
    startDate: string | null | undefined,
    dueDate: string | null | undefined
  ): string | null => {
    if (!startDate || !dueDate) {
      return null; // Both dates are optional, so no error if one is missing
    }

    const start = new Date(startDate);
    const due = new Date(dueDate);

    if (start > due) {
      return "La date de début ne peut pas être postérieure à la date d'échéance";
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.project_id) {
      newErrors.project_id = "Le projet est requis";
    }
    if (!formData.name.trim()) {
      newErrors.name = "Le nom de la tâche est requis";
    }

    // Validate dates
    const dateError = validateDates(formData.start_date, formData.due_date);
    if (dateError) {
      newErrors.start_date = dateError;
      newErrors.due_date = dateError;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit?.({
      ...formData,
      description: formData.description || null,
      due_date: formData.due_date || null,
      start_date: formData.start_date || null,
      assigned_to: formData.assigned_to || null,
    });
  };

  const handleChange = (
    field: keyof CreatePartnerTaskRequest,
    value: string | number | null
  ) => {
    const updatedFormData = { ...formData, [field]: value };
    setFormData(updatedFormData);

    // Clear field-specific error
    if (errors[field as string]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }

    // Validate dates when either date field changes
    if (field === "start_date" || field === "due_date") {
      const dateError = validateDates(
        field === "start_date" ? (value as string) : updatedFormData.start_date,
        field === "due_date" ? (value as string) : updatedFormData.due_date
      );

      if (dateError) {
        setErrors((prev) => ({
          ...prev,
          start_date: dateError,
          due_date: dateError,
        }));
      } else {
        // Clear date errors if validation passes
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.start_date;
          delete newErrors.due_date;
          return newErrors;
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label htmlFor="project_id">
          Projet <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.project_id}
          onValueChange={(value) => handleChange("project_id", value)}
          disabled={isPending}
        >
          <SelectTrigger
            className={errors.project_id ? "border-destructive" : ""}
          >
            <SelectValue placeholder="Sélectionner un projet" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.project_id && (
          <p className="text-sm text-destructive">{errors.project_id}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">
          Nom de la tâche <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Ex: Finaliser les plans"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
          disabled={isPending}
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
          placeholder="Description de la tâche..."
          value={formData.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          disabled={isPending}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select
            value={formData.status}
            onValueChange={(value) =>
              handleChange("status", value as CreatePartnerTaskRequest["status"])
            }
            disabled={isPending}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="à_faire">À faire</SelectItem>
              <SelectItem value="en_cours">En cours</SelectItem>
              <SelectItem value="bloqué">Bloqué</SelectItem>
              <SelectItem value="terminé">Terminé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priorité</Label>
          <Select
            value={formData.priority}
            onValueChange={(value) =>
              handleChange(
                "priority",
                value as CreatePartnerTaskRequest["priority"]
              )
            }
            disabled={isPending}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="faible">Faible</SelectItem>
              <SelectItem value="moyenne">Moyenne</SelectItem>
              <SelectItem value="élevée">Élevée</SelectItem>
              <SelectItem value="urgente">Urgente</SelectItem>
            </SelectContent>
          </Select>
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
            disabled={isPending}
            className={errors.start_date ? "border-destructive" : ""}
            max={formData.due_date || undefined}
          />
          {errors.start_date && (
            <p className="text-sm text-destructive">{errors.start_date}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="due_date">Date d'échéance</Label>
          <Input
            id="due_date"
            type="date"
            value={formData.due_date || ""}
            onChange={(e) => handleChange("due_date", e.target.value)}
            disabled={isPending}
            className={errors.due_date ? "border-destructive" : ""}
            min={formData.start_date || undefined}
          />
          {errors.due_date && (
            <p className="text-sm text-destructive">{errors.due_date}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="progress">
          Progression: {formData.progress}%
        </Label>
        <Slider
          id="progress"
          min={0}
          max={100}
          step={1}
          value={[formData.progress]}
          onValueChange={([value]) => handleChange("progress", value)}
          disabled={isPending}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Créer la tâche
        </Button>
      </div>
    </form>
  );
};

