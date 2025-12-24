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
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChantierStore } from "@/hooks/stores/useChantierStore";
import type { Project } from "@/types/project.types";

const statusOptions = [
  { value: "planifié", label: "Planifié" },
  { value: "en_cours", label: "En cours" },
  { value: "en_attente", label: "En attente" },
  { value: "terminé", label: "Terminé" },
  { value: "suspendu", label: "Suspendu" },
];

interface ChantierCreateFormProps {
  className?: string;
  createChantier?: () => void | Promise<void>;
  isCreatePending?: boolean;
  projects?: Project[];
}

export const ChantierCreateForm: React.FC<ChantierCreateFormProps> = ({
  className,
  createChantier,
  isCreatePending = false,
  projects = [],
}) => {
  const { createDto, setCreateField, createDtoErrors } = useChantierStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!createDto.name?.trim()) {
      return;
    }
    if (!createDto.project_id) {
      return;
    }
    if (!createDto.location?.trim()) {
      return;
    }

    createChantier?.();
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label htmlFor="project_id">
          Projet <span className="text-destructive">*</span>
        </Label>
        <Select
          value={createDto.project_id || undefined}
          onValueChange={(value) => setCreateField("project_id", value)}
          disabled={isCreatePending}
        >
          <SelectTrigger
            className={createDtoErrors.project_id ? "border-destructive" : ""}
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
        {createDtoErrors.project_id && (
          <p className="text-sm text-destructive">
            {createDtoErrors.project_id}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">
          Nom du chantier <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Ex: Site principal - Villa"
          value={createDto.name || ""}
          onChange={(e) => setCreateField("name", e.target.value)}
          required
          disabled={isCreatePending}
          className={createDtoErrors.name ? "border-destructive" : ""}
        />
        {createDtoErrors.name && (
          <p className="text-sm text-destructive">{createDtoErrors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">
          Localisation <span className="text-destructive">*</span>
        </Label>
        <Input
          id="location"
          placeholder="Ex: 123 Rue des Oliviers, 13100 Aix-en-Provence"
          value={createDto.location || ""}
          onChange={(e) => setCreateField("location", e.target.value)}
          required
          disabled={isCreatePending}
          className={createDtoErrors.location ? "border-destructive" : ""}
        />
        {createDtoErrors.location && (
          <p className="text-sm text-destructive">{createDtoErrors.location}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select
            value={createDto.status || "planifié"}
            onValueChange={(value) => setCreateField("status", value as any)}
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
            value={createDto.progress || 0}
            onChange={(e) =>
              setCreateField("progress", parseInt(e.target.value) || 0)
            }
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
            value={createDto.start_date || ""}
            onChange={(e) => setCreateField("start_date", e.target.value)}
            disabled={isCreatePending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date">Date de fin</Label>
          <Input
            id="end_date"
            type="date"
            value={createDto.end_date || ""}
            onChange={(e) => setCreateField("end_date", e.target.value)}
            disabled={isCreatePending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Description du chantier..."
          value={createDto.description || ""}
          onChange={(e) => setCreateField("description", e.target.value)}
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
