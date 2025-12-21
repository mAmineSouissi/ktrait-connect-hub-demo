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
import type { CreatePaymentRequest } from "@/api/admin/payments";
import type { Project } from "@/types/project.types";
import type { UserListItem } from "@/types/user-management.types";

interface PaymentCreateFormProps {
  className?: string;
  createPayment?: (data: CreatePaymentRequest) => void;
  isCreatePending?: boolean;
  projects?: Project[];
  clients?: UserListItem[];
  defaultProjectId?: string;
  defaultClientId?: string;
}

const statusOptions = [
  { value: "en_attente", label: "En attente" },
  { value: "payé", label: "Payé" },
  { value: "partiel", label: "Partiel" },
  { value: "annulé", label: "Annulé" },
];

const paymentMethodOptions = [
  { value: "virement", label: "Virement" },
  { value: "chèque", label: "Chèque" },
  { value: "espèces", label: "Espèces" },
  { value: "carte", label: "Carte bancaire" },
  { value: "autre", label: "Autre" },
];

export const PaymentCreateForm: React.FC<PaymentCreateFormProps> = ({
  className,
  createPayment,
  isCreatePending = false,
  projects = [],
  clients = [],
  defaultProjectId,
  defaultClientId,
}) => {
  const [formData, setFormData] = useState<CreatePaymentRequest>({
    client_id: defaultClientId || "",
    project_id: defaultProjectId || "",
    date: new Date().toISOString().split("T")[0],
    amount: "",
    description: "",
    status: "en_attente",
    payment_method: "",
    reference: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (!formData.client_id) {
      setErrors({ client_id: "Le client est requis" });
      return;
    }
    if (!formData.date) {
      setErrors({ date: "La date est requise" });
      return;
    }
    if (!formData.amount || parseFloat(formData.amount.toString()) <= 0) {
      setErrors({ amount: "Le montant doit être supérieur à 0" });
      return;
    }

    createPayment?.(formData);
  };

  const handleChange = (field: keyof CreatePaymentRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label htmlFor="client_id">
          Client <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.client_id}
          onValueChange={(value) => handleChange("client_id", value)}
          disabled={isCreatePending || !!defaultClientId}
        >
          <SelectTrigger
            className={errors.client_id ? "border-destructive" : ""}
          >
            <SelectValue placeholder="Sélectionner un client" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.full_name} ({client.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.client_id && (
          <p className="text-sm text-destructive">{errors.client_id}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="project_id">Projet associé</Label>
        <Select
          value={formData.project_id || undefined}
          onValueChange={(value) =>
            handleChange("project_id", value === "__none__" ? "" : value)
          }
          disabled={isCreatePending || !!defaultProjectId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un projet (optionnel)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">Aucun projet</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">
            Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
            required
            disabled={isCreatePending}
            className={errors.date ? "border-destructive" : ""}
          />
          {errors.date && (
            <p className="text-sm text-destructive">{errors.date}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">
            Montant <span className="text-destructive">*</span>
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            required
            disabled={isCreatePending}
            className={errors.amount ? "border-destructive" : ""}
          />
          {errors.amount && (
            <p className="text-sm text-destructive">{errors.amount}</p>
          )}
        </div>
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
          <Label htmlFor="payment_method">Méthode de paiement</Label>
          <Select
            value={formData.payment_method}
            onValueChange={(value) => handleChange("payment_method", value)}
            disabled={isCreatePending}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une méthode" />
            </SelectTrigger>
            <SelectContent>
              {paymentMethodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reference">Référence</Label>
        <Input
          id="reference"
          placeholder="Ex: CHQ-2024-001"
          value={formData.reference}
          onChange={(e) => handleChange("reference", e.target.value)}
          disabled={isCreatePending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Description du paiement..."
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          disabled={isCreatePending}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setFormData({
              client_id: defaultClientId || "",
              project_id: defaultProjectId || "",
              date: new Date().toISOString().split("T")[0],
              amount: "",
              description: "",
              status: "en_attente",
              payment_method: "",
              reference: "",
            });
            setErrors({});
          }}
          disabled={isCreatePending}
        >
          Réinitialiser
        </Button>
        <Button type="submit" disabled={isCreatePending}>
          {isCreatePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Créer le paiement
        </Button>
      </div>
    </form>
  );
};
