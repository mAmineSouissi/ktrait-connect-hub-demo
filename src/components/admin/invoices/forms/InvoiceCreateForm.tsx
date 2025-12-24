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
import { Loader2, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CreateInvoiceRequest } from "@/types/invoice.types";
import type { UserListItem } from "@/types/user-management.types";
import type { Project } from "@/types/project.types";
import type { InvoiceTemplate } from "@/types/invoice-template.types";

// Helper function to format date to YYYY-MM-DD for date input
const formatDateForInput = (date: string | Date | null | undefined): string => {
  if (!date) return "";
  try {
    let dateObj: Date;
    if (typeof date === "string") {
      // Handle different date string formats
      // If it's already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
      }
      // Try parsing as ISO string or other formats
      dateObj = new Date(date);
    } else {
      dateObj = date;
    }
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return "";
    }
    
    // Format to YYYY-MM-DD
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch {
    return "";
  }
};

interface InvoiceCreateFormProps {
  className?: string;
  createInvoice?: (data: CreateInvoiceRequest) => void;
  isCreatePending?: boolean;
  clients?: UserListItem[];
  projects?: Project[];
  templates?: InvoiceTemplate[];
  defaultType?: "devis" | "facture";
  defaultClientId?: string;
  defaultProjectId?: string;
}

export const InvoiceCreateForm: React.FC<InvoiceCreateFormProps> = ({
  className,
  createInvoice,
  isCreatePending = false,
  clients = [],
  projects = [],
  templates = [],
  defaultType = "devis",
  defaultClientId,
  defaultProjectId,
}) => {
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState<CreateInvoiceRequest>({
    type: defaultType,
    client_id: defaultClientId || "",
    project_id: defaultProjectId || null,
    template_id: null,
    issue_date: getTodayDate(),
    due_date: null,
    tax_rate: 20.0,
    notes: null,
    terms: null,
    reference: null,
    items: [
      {
        description: "",
        quantity: 1,
        unit_price: 0,
        unit: "unité",
        tax_rate: null,
      },
    ],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<InvoiceTemplate[]>(
    []
  );

  // Filter projects by selected client
  useEffect(() => {
    if (formData.client_id) {
      const clientProjects = projects.filter(
        (p) => p.client_id === formData.client_id
      );
      setFilteredProjects(clientProjects);
      // Reset project if it doesn't belong to selected client
      if (
        formData.project_id &&
        !clientProjects.find((p) => p.id === formData.project_id)
      ) {
        setFormData((prev) => ({ ...prev, project_id: null }));
      }
    } else {
      setFilteredProjects([]);
      setFormData((prev) => ({ ...prev, project_id: null }));
    }
  }, [formData.client_id, projects]);

  // Filter templates by invoice type
  useEffect(() => {
    const typeTemplates = templates.filter(
      (t) => t.type === formData.type && t.is_active
    );
    setFilteredTemplates(typeTemplates);
    // Reset template if it doesn't match the type
    if (formData.template_id) {
      const selectedTemplate = templates.find(
        (t) => t.id === formData.template_id
      );
      if (!selectedTemplate || selectedTemplate.type !== formData.type) {
        setFormData((prev) => ({ ...prev, template_id: null }));
      }
    }
  }, [formData.type, templates, formData.template_id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.client_id) {
      newErrors.client_id = "Le client est requis";
    }
    if (!formData.issue_date) {
      newErrors.issue_date = "La date est requise";
    }
    if (formData.type === "facture" && !formData.due_date) {
      newErrors.due_date = "La date d'échéance est requise pour une facture";
    }
    if (!formData.items || formData.items.length === 0) {
      newErrors.items = "Au moins un article est requis";
    } else {
      formData.items.forEach((item, index) => {
        if (!item.description) {
          newErrors[`item_${index}_description`] = "La description est requise";
        }
        if (item.quantity <= 0) {
          newErrors[`item_${index}_quantity`] = "La quantité doit être > 0";
        }
        if (item.unit_price <= 0) {
          newErrors[`item_${index}_unit_price`] =
            "Le prix unitaire doit être > 0";
        }
      });
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    createInvoice?.(formData);
  };

  const handleChange = (field: keyof CreateInvoiceRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          description: "",
          quantity: 1,
          unit_price: 0,
          unit: "unité",
          tax_rate: null,
        },
      ],
    }));
  };

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateItem = (
    index: number,
    field: keyof CreateInvoiceRequest["items"][0],
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
    const errorKey = `item_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // Calculate totals
  const subtotal = formData.items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  );
  const taxAmount = subtotal * ((formData.tax_rate || 20) / 100);
  const total = subtotal + taxAmount;

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      {/* Invoice Type */}
      <div className="space-y-2">
        <Label htmlFor="type">
          Type <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.type}
          onValueChange={(value) => handleChange("type", value)}
          disabled={isCreatePending}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="devis">Devis</SelectItem>
            <SelectItem value="facture">Facture</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Client Selection */}
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

      {/* Project Selection */}
      <div className="space-y-2">
        <Label htmlFor="project_id">Projet associé</Label>
        <Select
          value={formData.project_id || undefined}
          onValueChange={(value) =>
            handleChange("project_id", value === "__none__" ? null : value)
          }
          disabled={
            isCreatePending || !formData.client_id || !!defaultProjectId
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un projet (optionnel)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">Aucun projet</SelectItem>
            {filteredProjects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Template Selection */}
      <div className="space-y-2">
        <Label htmlFor="template_id">Modèle</Label>
        <Select
          value={formData.template_id || undefined}
          onValueChange={(value) =>
            handleChange("template_id", value === "__none__" ? null : value)
          }
          disabled={isCreatePending}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un modèle (optionnel)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">Aucun modèle</SelectItem>
            {filteredTemplates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.name}
                {template.is_default && " (Par défaut)"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {filteredTemplates.length === 0 && formData.type && (
          <p className="text-xs text-muted-foreground">
            Aucun modèle disponible pour les{" "}
            {formData.type === "devis" ? "devis" : "factures"}. Vous pouvez en
            créer un dans les paramètres.
          </p>
        )}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="issue_date">
            Date d'émission <span className="text-destructive">*</span>
          </Label>
          <Input
            id="issue_date"
            type="date"
            value={formData.issue_date || getTodayDate()}
            onChange={(e) => handleChange("issue_date", e.target.value)}
            required
            disabled={isCreatePending}
            className={errors.issue_date ? "border-destructive" : ""}
          />
          {errors.issue_date && (
            <p className="text-sm text-destructive">{errors.issue_date}</p>
          )}
        </div>

        {formData.type === "facture" && (
          <div className="space-y-2">
            <Label htmlFor="due_date">
              Date d'échéance <span className="text-destructive">*</span>
            </Label>
            <Input
              id="due_date"
              type="date"
              value={formData.due_date || ""}
              onChange={(e) => handleChange("due_date", e.target.value || null)}
              required={formData.type === "facture"}
              disabled={isCreatePending}
              className={errors.due_date ? "border-destructive" : ""}
            />
            {errors.due_date && (
              <p className="text-sm text-destructive">{errors.due_date}</p>
            )}
          </div>
        )}
      </div>

      {/* Tax Rate */}
      <div className="space-y-2">
        <Label htmlFor="tax_rate">Taux de TVA (%)</Label>
        <Input
          id="tax_rate"
          type="number"
          step="0.01"
          min="0"
          max="100"
          value={formData.tax_rate || 20}
          onChange={(e) =>
            handleChange("tax_rate", parseFloat(e.target.value) || 20)
          }
          disabled={isCreatePending}
        />
      </div>

      {/* Line Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>
            Articles <span className="text-destructive">*</span>
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addItem}
            disabled={isCreatePending}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un article
          </Button>
        </div>

        {errors.items && (
          <p className="text-sm text-destructive">{errors.items}</p>
        )}

        <div className="space-y-4 border rounded-lg p-4">
          {formData.items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-4 items-start p-4 border rounded-lg bg-muted/50"
            >
              <div className="col-span-12 md:col-span-5 space-y-2">
                <Label>Description</Label>
                <Input
                  value={item.description}
                  onChange={(e) =>
                    updateItem(index, "description", e.target.value)
                  }
                  placeholder="Description de l'article"
                  disabled={isCreatePending}
                  className={
                    errors[`item_${index}_description`]
                      ? "border-destructive"
                      : ""
                  }
                />
                {errors[`item_${index}_description`] && (
                  <p className="text-xs text-destructive">
                    {errors[`item_${index}_description`]}
                  </p>
                )}
              </div>

              <div className="col-span-6 md:col-span-2 space-y-2">
                <Label>Quantité</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(
                      index,
                      "quantity",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  disabled={isCreatePending}
                  className={
                    errors[`item_${index}_quantity`] ? "border-destructive" : ""
                  }
                />
                {errors[`item_${index}_quantity`] && (
                  <p className="text-xs text-destructive">
                    {errors[`item_${index}_quantity`]}
                  </p>
                )}
              </div>

              <div className="col-span-6 md:col-span-2 space-y-2">
                <Label>Unité</Label>
                <Input
                  value={item.unit || "unité"}
                  onChange={(e) => updateItem(index, "unit", e.target.value)}
                  placeholder="unité"
                  disabled={isCreatePending}
                />
              </div>

              <div className="col-span-10 md:col-span-2 space-y-2">
                <Label>Prix unitaire (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={item.unit_price}
                  onChange={(e) =>
                    updateItem(
                      index,
                      "unit_price",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  disabled={isCreatePending}
                  className={
                    errors[`item_${index}_unit_price`]
                      ? "border-destructive"
                      : ""
                  }
                />
                {errors[`item_${index}_unit_price`] && (
                  <p className="text-xs text-destructive">
                    {errors[`item_${index}_unit_price`]}
                  </p>
                )}
              </div>

              <div className="col-span-2 flex items-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(index)}
                  disabled={isCreatePending || formData.items.length === 1}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="col-span-12 text-right">
                <span className="text-sm font-medium">
                  Total:{" "}
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(item.quantity * item.unit_price)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals Summary */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Sous-total HT:</span>
          <span className="font-medium">
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
            }).format(subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span>TVA ({formData.tax_rate || 20}%):</span>
          <span className="font-medium">
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
            }).format(taxAmount)}
          </span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t pt-2">
          <span>Total TTC:</span>
          <span>
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
            }).format(total)}
          </span>
        </div>
      </div>

      {/* Notes and Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Notes internes..."
            value={formData.notes || ""}
            onChange={(e) => handleChange("notes", e.target.value || null)}
            disabled={isCreatePending}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="terms">Conditions de paiement</Label>
          <Textarea
            id="terms"
            placeholder="Ex: Paiement à 30 jours..."
            value={formData.terms || ""}
            onChange={(e) => handleChange("terms", e.target.value || null)}
            disabled={isCreatePending}
            rows={3}
          />
        </div>
      </div>

      {/* Reference */}
      <div className="space-y-2">
        <Label htmlFor="reference">Référence</Label>
        <Input
          id="reference"
          placeholder="Référence externe (optionnel)"
          value={formData.reference || ""}
          onChange={(e) => handleChange("reference", e.target.value || null)}
          disabled={isCreatePending}
        />
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setFormData({
              type: defaultType,
              client_id: defaultClientId || "",
              project_id: defaultProjectId || null,
              template_id: null,
              issue_date: getTodayDate(),
              due_date: null,
              tax_rate: 20.0,
              notes: null,
              terms: null,
              reference: null,
              items: [
                {
                  description: "",
                  quantity: 1,
                  unit_price: 0,
                  unit: "unité",
                  tax_rate: null,
                },
              ],
            });
            setErrors({});
          }}
          disabled={isCreatePending}
        >
          Réinitialiser
        </Button>
        <Button type="submit" disabled={isCreatePending}>
          {isCreatePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Créer le {formData.type === "devis" ? "devis" : "facture"}
        </Button>
      </div>
    </form>
  );
};
