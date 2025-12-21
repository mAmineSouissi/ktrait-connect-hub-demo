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
import { cn } from "@/lib/utils";
import type { UpdateGalleryItemRequest } from "@/api/admin/chantiers";
import type { ChantierGalleryRow } from "@/types/supabase-database.types";

interface GalleryItemUpdateFormProps {
  className?: string;
  updateGalleryItem?: (data: UpdateGalleryItemRequest) => void;
  isUpdatePending?: boolean;
  galleryItem?: ChantierGalleryRow | null;
}

const mediaTypeOptions = [
  { value: "photo", label: "Photo" },
  { value: "video", label: "Vidéo" },
];

export const GalleryItemUpdateForm: React.FC<GalleryItemUpdateFormProps> = ({
  className,
  updateGalleryItem,
  isUpdatePending = false,
  galleryItem,
}) => {
  const [formData, setFormData] = React.useState<UpdateGalleryItemRequest>({
    title: "",
    description: null,
    media_type: "photo",
    date: null,
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  useEffect(() => {
    if (galleryItem) {
      setFormData({
        title: galleryItem.title,
        description: galleryItem.description || null,
        media_type: galleryItem.media_type,
        date: galleryItem.date || null,
      });
    }
  }, [galleryItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (formData.title !== undefined && !formData.title.trim()) {
      newErrors.title = "Le titre est requis";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    updateGalleryItem?.(formData);
  };

  const handleChange = (
    field: keyof UpdateGalleryItemRequest,
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

  if (!galleryItem) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun élément de galerie sélectionné
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label htmlFor="title">
          Titre <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          placeholder="Ex: Avancement des travaux"
          value={formData.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          required
          disabled={isUpdatePending}
          className={errors.title ? "border-destructive" : ""}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Description de l'élément..."
          value={formData.description || ""}
          onChange={(e) => handleChange("description", e.target.value || null)}
          disabled={isUpdatePending}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="media_type">Type de média</Label>
          <Select
            value={formData.media_type || galleryItem.media_type}
            onValueChange={(value) => handleChange("media_type", value as any)}
            disabled={isUpdatePending}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mediaTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date || ""}
            onChange={(e) => handleChange("date", e.target.value || null)}
            disabled={isUpdatePending}
          />
        </div>
      </div>

      {galleryItem.file_url && (
        <div className="space-y-2">
          <Label>Fichier actuel</Label>
          <div className="border rounded-lg p-4">
            {galleryItem.media_type === "photo" ? (
              <img
                src={galleryItem.file_url}
                alt={galleryItem.title}
                className="max-w-full h-auto rounded-lg"
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Vidéo: {galleryItem.title}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isUpdatePending}>
          {isUpdatePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Mettre à jour
        </Button>
      </div>
    </form>
  );
};
