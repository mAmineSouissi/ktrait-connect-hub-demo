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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useProjectStore } from "@/hooks/stores/useProjectStore";
import type { CreateProjectRequest } from "@/api/admin/projects";
import type { ClientListItem } from "@/types/client.types";
import type { Partner } from "@/types/partner.types";

// Re-export for convenience
export type { CreateProjectRequest };

interface ProjectCreateFormProps {
  className?: string;
  createProject?: (
    data: CreateProjectRequest & { selectedPartnerIds?: string[] }
  ) => void;
  isCreatePending?: boolean;
  clients?: ClientListItem[];
}

// Partner type mapping for display
const partnerTypeMap: Record<string, string> = {
  architecte: "Architecte",
  bureau_études: "Bureau d'études",
  maître_d_œuvre: "Maître d'œuvre",
  artisan: "Artisan",
  fournisseur: "Fournisseur",
  autre: "Autre",
};

const statusOptions = [
  { value: "planifié", label: "Planifié" },
  { value: "en_cours", label: "En cours" },
  { value: "en_attente", label: "En attente" },
  { value: "terminé", label: "Terminé" },
  { value: "annulé", label: "Annulé" },
];

export const ProjectCreateForm: React.FC<ProjectCreateFormProps> = ({
  className,
  createProject,
  isCreatePending = false,
  clients = [],
}) => {
  const { createDto, setCreateField, createDtoErrors } = useProjectStore();
  const [selectedPartnerIds, setSelectedPartnerIds] = useState<string[]>([]);

  // Fetch all available partners for selection
  const { data: allPartnersData } = useQuery({
    queryKey: ["partners", "all"],
    queryFn: async () => {
      const response = await fetch("/api/admin/partners?limit=1000");
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch partners");
      }
      return response.json();
    },
  });

  const allPartners: Partner[] = allPartnersData?.partners || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!createDto.name?.trim()) {
      return;
    }
    if (!createDto.client_id) {
      return;
    }

    createProject?.({ ...createDto, selectedPartnerIds });
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
        <Label htmlFor="client_id">
          Client <span className="text-destructive">*</span>
        </Label>
        <Select
          value={createDto.client_id || ""}
          onValueChange={(value) => setCreateField("client_id", value)}
          disabled={isCreatePending}
        >
          <SelectTrigger
            className={createDtoErrors.client_id ? "border-destructive" : ""}
          >
            <SelectValue placeholder="Sélectionner un client" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name} ({client.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {createDtoErrors.client_id && (
          <p className="text-sm text-destructive">
            {createDtoErrors.client_id}
          </p>
        )}
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

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Description du projet..."
          value={createDto.description || ""}
          onChange={(e) => setCreateField("description", e.target.value)}
          disabled={isCreatePending}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Partenaires (optionnel)</Label>
        <div className="border rounded-md p-4 max-h-48 overflow-y-auto space-y-2">
          {allPartners.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Chargement des partenaires...
            </p>
          ) : (
            allPartners.map((partner) => (
              <div key={partner.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`partner-${partner.id}`}
                  checked={selectedPartnerIds.includes(partner.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedPartnerIds([
                        ...selectedPartnerIds,
                        partner.id,
                      ]);
                    } else {
                      setSelectedPartnerIds(
                        selectedPartnerIds.filter((id) => id !== partner.id)
                      );
                    }
                  }}
                  disabled={isCreatePending}
                />
                <Label
                  htmlFor={`partner-${partner.id}`}
                  className="text-sm font-normal cursor-pointer flex-1"
                >
                  <div className="flex items-center justify-between">
                    <span>{partner.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {partnerTypeMap[partner.type] || partner.type}
                    </span>
                  </div>
                </Label>
              </div>
            ))
          )}
        </div>
        {selectedPartnerIds.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {selectedPartnerIds.length} partenaire
            {selectedPartnerIds.length > 1 ? "s" : ""} sélectionné
            {selectedPartnerIds.length > 1 ? "s" : ""}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            // Reset is handled by the store reset in the sheet
            setSelectedPartnerIds([]);
          }}
          disabled={isCreatePending}
        >
          Réinitialiser
        </Button>
        <Button type="submit" disabled={isCreatePending}>
          {isCreatePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Créer le projet
        </Button>
      </div>
    </form>
  );
};
