"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UpdateNoteRequest } from "@/api/admin/chantiers";
import type { ChantierNoteRow } from "@/types/supabase-database.types";

interface NoteUpdateFormProps {
  className?: string;
  updateNote?: (data: UpdateNoteRequest) => void;
  isUpdatePending?: boolean;
  note?: ChantierNoteRow | null;
}

export const NoteUpdateForm: React.FC<NoteUpdateFormProps> = ({
  className,
  updateNote,
  isUpdatePending = false,
  note,
}) => {
  const [formData, setFormData] = React.useState<UpdateNoteRequest>({
    author: "",
    content: "",
    date: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  useEffect(() => {
    if (note) {
      setFormData({
        author: note.author,
        content: note.content,
        date: note.date,
      });
    }
  }, [note]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (formData.author !== undefined && !formData.author.trim()) {
      newErrors.author = "L'auteur est requis";
    }
    if (formData.content !== undefined && !formData.content.trim()) {
      newErrors.content = "Le contenu est requis";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    updateNote?.(formData);
  };

  const handleChange = (field: keyof UpdateNoteRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  };

  if (!note) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune note sélectionnée
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label htmlFor="author">
          Auteur <span className="text-destructive">*</span>
        </Label>
        <Input
          id="author"
          placeholder="Ex: Michel Dupuis"
          value={formData.author || ""}
          onChange={(e) => handleChange("author", e.target.value)}
          required
          disabled={isUpdatePending}
          className={errors.author ? "border-destructive" : ""}
        />
        {errors.author && (
          <p className="text-sm text-destructive">{errors.author}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date || ""}
          onChange={(e) => handleChange("date", e.target.value)}
          disabled={isUpdatePending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">
          Contenu <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="content"
          placeholder="Contenu de la note..."
          value={formData.content || ""}
          onChange={(e) => handleChange("content", e.target.value)}
          required
          disabled={isUpdatePending}
          rows={6}
          className={errors.content ? "border-destructive" : ""}
        />
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isUpdatePending}>
          {isUpdatePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Mettre à jour
        </Button>
      </div>
    </form>
  );
};
