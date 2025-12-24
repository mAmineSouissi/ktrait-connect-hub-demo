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
import type { CreatePaymentRequest } from "@/api/client/payments";

interface ClientPaymentCreateFormProps {
  className?: string;
  createPayment?: (data: CreatePaymentRequest) => void;
  isCreatePending?: boolean;
  projectId: string;
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

export const ClientPaymentCreateForm: React.FC<ClientPaymentCreateFormProps> = ({
  className,
  createPayment,
  isCreatePending = false,
  projectId,
}) => {
  const [formData, setFormData] = useState<CreatePaymentRequest>({
    project_id: projectId,
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
        <Label htmlFor="date">
          Date <span className="text-destructive">*</span>
        </Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
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
          value={formData.amount}
          onChange={(e) => handleChange("amount", e.target.value)}
          disabled={isCreatePending}
          placeholder="0.00"
          className={errors.amount ? "border-destructive" : ""}
        />
        {errors.amount && (
          <p className="text-sm text-destructive">{errors.amount}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Statut</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => handleChange("status", value as any)}
          disabled={isCreatePending}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un statut" />
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
          value={formData.payment_method || undefined}
          onValueChange={(value) =>
            handleChange("payment_method", value === "__none__" ? "" : value)
          }
          disabled={isCreatePending}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une méthode (optionnel)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">Aucune méthode</SelectItem>
            {paymentMethodOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reference">Référence</Label>
        <Input
          id="reference"
          type="text"
          value={formData.reference || ""}
          onChange={(e) => handleChange("reference", e.target.value)}
          disabled={isCreatePending}
          placeholder="Numéro de référence (optionnel)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          disabled={isCreatePending}
          placeholder="Description du paiement (optionnel)"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isCreatePending}>
          {isCreatePending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Création...
            </>
          ) : (
            "Créer le paiement"
          )}
        </Button>
      </div>
    </form>
  );
};

