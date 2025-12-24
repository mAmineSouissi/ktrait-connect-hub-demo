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
import { useChantierStore } from "@/hooks/stores/useChantierStore";
import type { UpdateChantierRequest } from "@/types/chantier.types";
import type { ChantierWithCounts } from "@/types/chantier.types";
import type { Project } from "@/types/project.types";

interface ChantierUpdateFormProps {
  className?: string;
  updateChantier?: () => void | Promise<void>;
  isUpdatePending?: boolean;
  chantier?: ChantierWithCounts | null;
  projects?: Project[];
}

const statusOptions = [
  { value: "planifié", label: "Planifié" },
  { value: "en_cours", label: "En cours" },
  { value: "en_attente", label: "En attente" },
  { value: "terminé", label: "Terminé" },
  { value: "suspendu", label: "Suspendu" },
];

export const ChantierUpdateForm: React.FC<ChantierUpdateFormProps> = ({
  className,
  updateChantier,
  isUpdatePending = false,
  chantier,
  projects = [],
}) => {
  const { updateDto, setUpdateField, updateDtoErrors, response, initializeUpdateDto } =
    useChantierStore();

  // Ensure form is populated when chantier changes
  useEffect(() => {
    if (chantier && (!response || chantier.id !== response.id)) {
      // Initialize the form if chantier prop is provided and different from store response
      initializeUpdateDto(chantier);
    }
  }, [chantier, response, initializeUpdateDto]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (updateDto.name !== undefined && !updateDto.name?.trim()) {
      return;
    }
    if (updateDto.location !== undefined && !updateDto.location?.trim()) {
      return;
    }

    if (!currentChantier?.id) {
      toast.error("ID du chantier manquant");
      return;
    }

    updateChantier?.();
  };

  // Use chantier prop if available, otherwise use store response
  const currentChantier = chantier || response;

  if (!currentChantier) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun chantier sélectionné
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label htmlFor="project_id">Projet</Label>
        <Select
          value={updateDto.project_id !== undefined ? updateDto.project_id : (currentChantier?.project_id || undefined)}
          onValueChange={(value) => setUpdateField("project_id", value)}
          disabled={isUpdatePending}
        >
          <SelectTrigger>
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">
          Nom du chantier <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Ex: Site principal - Villa"
          value={updateDto.name !== undefined ? updateDto.name : (currentChantier?.name || "")}
          onChange={(e) => setUpdateField("name", e.target.value)}
          required
          disabled={isUpdatePending}
          className={updateDtoErrors.name ? "border-destructive" : ""}
        />
        {updateDtoErrors.name && (
          <p className="text-sm text-destructive">{updateDtoErrors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">
          Localisation <span className="text-destructive">*</span>
        </Label>
        <Input
          id="location"
          placeholder="Ex: 123 Rue des Oliviers, 13100 Aix-en-Provence"
          value={updateDto.location !== undefined ? updateDto.location : (currentChantier?.location || "")}
          onChange={(e) => setUpdateField("location", e.target.value)}
          required
          disabled={isUpdatePending}
          className={updateDtoErrors.location ? "border-destructive" : ""}
        />
        {updateDtoErrors.location && (
          <p className="text-sm text-destructive">{updateDtoErrors.location}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select
            value={updateDto.status !== undefined ? updateDto.status : (currentChantier?.status || "planifié")}
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

        <div className="space-y-2">
          <Label htmlFor="progress">Avancement (%)</Label>
          <Input
            id="progress"
            type="number"
            placeholder="0"
            value={
              updateDto.progress !== undefined
                ? updateDto.progress
                : (currentChantier?.progress || 0)
            }
            onChange={(e) =>
              setUpdateField("progress", parseInt(e.target.value) || 0)
            }
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
            value={updateDto.start_date !== undefined ? updateDto.start_date : (currentChantier?.start_date || "")}
            onChange={(e) => setUpdateField("start_date", e.target.value)}
            disabled={isUpdatePending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date">Date de fin</Label>
          <Input
            id="end_date"
            type="date"
            value={updateDto.end_date !== undefined ? updateDto.end_date : (currentChantier?.end_date || "")}
            onChange={(e) => setUpdateField("end_date", e.target.value)}
            disabled={isUpdatePending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Description du chantier..."
          value={updateDto.description !== undefined ? updateDto.description : (currentChantier?.description || "")}
          onChange={(e) => setUpdateField("description", e.target.value)}
          disabled={isUpdatePending}
          rows={4}
        />
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
