"use client";

import React, { useEffect } from "react";
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
import { useProjectStore } from "@/hooks/stores/useProjectStore";
import type { UpdateProjectRequest } from "@/api/admin/projects";
import type { Project } from "@/types/project.types";

// Re-export for convenience
export type { UpdateProjectRequest };

interface ProjectUpdateFormProps {
  className?: string;
  updateProject?: (data: { id: string; data: UpdateProjectRequest }) => void;
  isUpdatePending?: boolean;
  project?: Project | null;
}

const statusOptions = [
  { value: "planifié", label: "Planifié" },
  { value: "en_cours", label: "En cours" },
  { value: "en_attente", label: "En attente" },
  { value: "terminé", label: "Terminé" },
  { value: "annulé", label: "Annulé" },
];

export const ProjectUpdateForm: React.FC<ProjectUpdateFormProps> = ({
  className,
  updateProject,
  isUpdatePending = false,
  project,
}) => {
  const { updateDto, setUpdateField, updateDtoErrors, response } =
    useProjectStore();

  // Ensure form is populated when project changes
  useEffect(() => {
    if (project && project.id === response?.id) {
      // Form should already be initialized by AdminProjects
    }
  }, [project, response]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!updateDto.name?.trim()) {
      return;
    }

    if (!response?.id) {
      toast.error("ID du projet manquant");
      return;
    }

    updateProject?.({ id: response.id, data: updateDto });
  };

  if (!response) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun projet sélectionné
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label htmlFor="name">
          Nom du projet <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Ex: Villa Moderne"
          value={updateDto.name || ""}
          onChange={(e) => setUpdateField("name", e.target.value)}
          required
          disabled={isUpdatePending}
          className={updateDtoErrors.name ? "border-destructive" : ""}
        />
        {updateDtoErrors.name && (
          <p className="text-sm text-destructive">{updateDtoErrors.name}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="estimated_budget">Budget estimé</Label>
          <Input
            id="estimated_budget"
            type="number"
            placeholder="0"
            value={updateDto.estimated_budget?.toString() || ""}
            onChange={(e) => setUpdateField("estimated_budget", e.target.value)}
            disabled={isUpdatePending}
            min="0"
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select
            value={updateDto.status || "planifié"}
            onValueChange={(value) => setUpdateField("status", value as any)}
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Date de début</Label>
          <Input
            id="start_date"
            type="date"
            value={updateDto.start_date || ""}
            onChange={(e) => setUpdateField("start_date", e.target.value)}
            disabled={isUpdatePending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date">Date de fin</Label>
          <Input
            id="end_date"
            type="date"
            value={updateDto.end_date || ""}
            onChange={(e) => setUpdateField("end_date", e.target.value)}
            disabled={isUpdatePending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adresse</Label>
        <Input
          id="address"
          placeholder="Adresse du projet"
          value={updateDto.address || ""}
          onChange={(e) => setUpdateField("address", e.target.value)}
          disabled={isUpdatePending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Description du projet..."
          value={updateDto.description || ""}
          onChange={(e) => setUpdateField("description", e.target.value)}
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
