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
import type { CreateExpenseRequest } from "@/api/client/expenses";

interface ClientExpenseCreateFormProps {
  className?: string;
  createExpense?: (data: CreateExpenseRequest) => void;
  isCreatePending?: boolean;
  projectId: string;
}

const categoryOptions = [
  { value: "fondations", label: "Fondations" },
  { value: "gros_œuvre", label: "Gros œuvre" },
  { value: "second_œuvre", label: "Second œuvre" },
  { value: "finitions", label: "Finitions" },
  { value: "main_d_œuvre", label: "Main d'œuvre" },
  { value: "matériaux", label: "Matériaux" },
  { value: "équipements", label: "Équipements" },
  { value: "autres", label: "Autres" },
];

export const ClientExpenseCreateForm: React.FC<ClientExpenseCreateFormProps> = ({
  className,
  createExpense,
  isCreatePending = false,
  projectId,
}) => {
  const [formData, setFormData] = useState<Omit<CreateExpenseRequest, "project_id">>({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    description: "",
    category: undefined,
    supplier: "",
    invoice_number: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!formData.date) {
      setErrors({ date: "La date est requise" });
      return;
    }
    if (!formData.description?.trim()) {
      setErrors({ description: "La description est requise" });
      return;
    }
    if (!formData.amount || parseFloat(formData.amount.toString()) <= 0) {
      setErrors({ amount: "Le montant doit être supérieur à 0" });
      return;
    }

    createExpense?.({
      ...formData,
      project_id: projectId, // Always use the current project
    });
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
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

      <div className="space-y-2">
        <Label htmlFor="description">
          Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Description de la dépense..."
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          required
          disabled={isCreatePending}
          rows={3}
          className={errors.description ? "border-destructive" : ""}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Catégorie</Label>
          <Select
            value={formData.category || ""}
            onValueChange={(value) => handleChange("category", value as any)}
            disabled={isCreatePending}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="supplier">Fournisseur</Label>
          <Input
            id="supplier"
            placeholder="Nom du fournisseur"
            value={formData.supplier}
            onChange={(e) => handleChange("supplier", e.target.value)}
            disabled={isCreatePending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="invoice_number">Numéro de facture</Label>
        <Input
          id="invoice_number"
          placeholder="Ex: FACT-2024-001"
          value={formData.invoice_number}
          onChange={(e) => handleChange("invoice_number", e.target.value)}
          disabled={isCreatePending}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isCreatePending}>
          {isCreatePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Créer la dépense
        </Button>
      </div>
    </form>
  );
};

