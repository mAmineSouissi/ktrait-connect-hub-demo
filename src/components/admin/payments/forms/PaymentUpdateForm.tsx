"use client";

import React, { useState, useEffect } from "react";
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
import type { UpdatePaymentRequest } from "@/api/admin/payments";
import type { PaymentWithDetails } from "@/types/payment.types";
import type { Project } from "@/types/project.types";
import type { UserListItem } from "@/types/user-management.types";

interface PaymentUpdateFormProps {
  className?: string;
  updatePayment?: (data: { id: string; data: UpdatePaymentRequest }) => void;
  isUpdatePending?: boolean;
  payment?: PaymentWithDetails | null;
  projects?: Project[];
  clients?: UserListItem[];
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

export const PaymentUpdateForm: React.FC<PaymentUpdateFormProps> = ({
  className,
  updatePayment,
  isUpdatePending = false,
  payment,
  projects = [],
  clients = [],
}) => {
  const [formData, setFormData] = useState<UpdatePaymentRequest>({
    date: "",
    amount: "",
    description: "",
    status: "en_attente",
    payment_method: "",
    reference: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (payment) {
      setFormData({
        date: payment.date || "",
        amount: payment.amount?.toString() || "",
        description: payment.description || "",
        status: (payment.status as any) || "en_attente",
        payment_method: payment.payment_method || "",
        reference: payment.reference || "",
        project_id: payment.project_id || null,
      });
      setErrors({});
    }
  }, [payment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!formData.date) {
      setErrors({ date: "La date est requise" });
      return;
    }
    if (!formData.amount || parseFloat(formData.amount.toString()) <= 0) {
      setErrors({ amount: "Le montant doit être supérieur à 0" });
      return;
    }

    if (!payment?.id) {
      toast.error("ID du paiement manquant");
      return;
    }

    updatePayment?.({ id: payment.id, data: formData });
  };

  const handleChange = (
    field: keyof UpdatePaymentRequest,
    value: string | null
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

  if (!payment) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun paiement sélectionné
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label htmlFor="project_id">Projet associé</Label>
        <Select
          value={formData.project_id || "__none__"}
          onValueChange={(value) =>
            handleChange("project_id", value === "__none__" ? null : value)
          }
          disabled={isUpdatePending}
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
            disabled={isUpdatePending}
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
            disabled={isUpdatePending}
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
          <Label htmlFor="payment_method">Méthode de paiement</Label>
          <Select
            value={formData.payment_method || ""}
            onValueChange={(value) => handleChange("payment_method", value)}
            disabled={isUpdatePending}
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
          value={formData.reference || ""}
          onChange={(e) => handleChange("reference", e.target.value)}
          disabled={isUpdatePending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Description du paiement..."
          value={formData.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          disabled={isUpdatePending}
          rows={3}
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
