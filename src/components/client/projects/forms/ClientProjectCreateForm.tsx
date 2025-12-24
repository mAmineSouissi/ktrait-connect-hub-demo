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
import { useQuery } from "@tanstack/react-query";
import { useProjectStore } from "@/hooks/stores/useProjectStore";
import type { CreateProjectRequest } from "@/api/client/projects";
import type { Partner } from "@/types/partner.types";
import {
  ProjectCategory,
  PROJECT_CATEGORY_LABELS,
  type ProjectCategoryType,
} from "@/types/enums/project-category.enum";
import {
  ProjectType,
  PROJECT_TYPE_LABELS,
  type ProjectTypeType,
} from "@/types/enums/project-type.enum";

interface ClientProjectCreateFormProps {
  className?: string;
  createProject?: (data: CreateProjectRequest) => void;
  isCreatePending?: boolean;
}

const statusOptions = [
  { value: "planifié", label: "Planifié" },
  { value: "en_cours", label: "En cours" },
  { value: "en_attente", label: "En attente" },
  { value: "terminé", label: "Terminé" },
  { value: "annulé", label: "Annulé" },
];

const categoryOptions = Object.values(ProjectCategory).map((category) => ({
  value: category,
  label: PROJECT_CATEGORY_LABELS[category],
}));

const typeOptions = Object.values(ProjectType).map((type) => ({
  value: type,
  label: PROJECT_TYPE_LABELS[type],
}));

export const ClientProjectCreateForm: React.FC<ClientProjectCreateFormProps> = ({
  className,
  createProject,
  isCreatePending = false,
}) => {
  const { createDto, setCreateField, createDtoErrors } = useProjectStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!createDto.name?.trim()) {
      return;
    }

    createProject?.(createDto);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label htmlFor="name">
          Nom du projet <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Ex: Villa Moderne"
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
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Description du projet..."
          value={createDto.description || ""}
          onChange={(e) => setCreateField("description", e.target.value)}
          disabled={isCreatePending}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Catégorie</Label>
          <Select
            value={createDto.category || "__none__"}
            onValueChange={(value) =>
              setCreateField("category", value === "__none__" ? undefined : (value as ProjectCategoryType))
            }
            disabled={isCreatePending}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Aucune</SelectItem>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={createDto.type || "__none__"}
            onValueChange={(value) =>
              setCreateField("type", value === "__none__" ? undefined : (value as ProjectTypeType))
            }
            disabled={isCreatePending}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Aucun</SelectItem>
              {typeOptions.map((option) => (
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
          <Label htmlFor="estimated_budget">Budget estimé</Label>
          <Input
            id="estimated_budget"
            type="number"
            placeholder="0"
            value={createDto.estimated_budget?.toString() || ""}
            onChange={(e) => setCreateField("estimated_budget", e.target.value)}
            disabled={isCreatePending}
            min="0"
            step="0.01"
          />
        </div>

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
        <Label htmlFor="address">Adresse</Label>
        <Input
          id="address"
          placeholder="Adresse du projet"
          value={createDto.address || ""}
          onChange={(e) => setCreateField("address", e.target.value)}
          disabled={isCreatePending}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isCreatePending}>
          {isCreatePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Créer le projet
        </Button>
      </div>
    </form>
  );
};

