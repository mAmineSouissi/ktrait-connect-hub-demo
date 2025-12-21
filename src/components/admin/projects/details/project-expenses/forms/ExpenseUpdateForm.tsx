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
import type { UpdateExpenseRequest } from "@/api/admin/expenses";
import type { ExpenseWithDetails } from "@/types/expense.types";
import type { Project } from "@/types/project.types";

interface ExpenseUpdateFormProps {
  className?: string;
  updateExpense?: (data: { id: string; data: UpdateExpenseRequest }) => void;
  isUpdatePending?: boolean;
  expense?: ExpenseWithDetails | null;
  projects?: Project[];
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

export const ExpenseUpdateForm: React.FC<ExpenseUpdateFormProps> = ({
  className,
  updateExpense,
  isUpdatePending = false,
  expense,
  projects = [],
}) => {
  const [formData, setFormData] = useState<UpdateExpenseRequest>({
    date: "",
    amount: "",
    description: "",
    category: null,
    supplier: null,
    invoice_number: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (expense) {
      setFormData({
        date: expense.date || "",
        amount: expense.amount?.toString() || "",
        description: expense.description || "",
        category: (expense.category as any) || null,
        supplier: expense.supplier || null,
        invoice_number: expense.invoice_number || null,
      });
      setErrors({});
    }
  }, [expense]);

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

    if (!expense?.id) {
      toast.error("ID de la dépense manquant");
      return;
    }

    updateExpense?.({ id: expense.id, data: formData });
  };

  const handleChange = (
    field: keyof UpdateExpenseRequest,
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

  if (!expense) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune dépense sélectionnée
      </div>
    );
  }

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

      <div className="space-y-2">
        <Label htmlFor="description">
          Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Description de la dépense..."
          value={formData.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          required
          disabled={isUpdatePending}
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
            value={formData.category || "__none__"}
            onValueChange={(value) =>
              handleChange("category", value === "__none__" ? null : value)
            }
            disabled={isUpdatePending}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Aucune catégorie</SelectItem>
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
            value={formData.supplier || ""}
            onChange={(e) => handleChange("supplier", e.target.value || null)}
            disabled={isUpdatePending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="invoice_number">Numéro de facture</Label>
        <Input
          id="invoice_number"
          placeholder="Ex: FACT-2024-001"
          value={formData.invoice_number || ""}
          onChange={(e) =>
            handleChange("invoice_number", e.target.value || null)
          }
          disabled={isUpdatePending}
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
