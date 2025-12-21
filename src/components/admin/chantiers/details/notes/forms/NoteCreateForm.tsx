"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CreateNoteRequest } from "@/api/admin/chantiers";
import { useAuth } from "@/contexts/AuthContext";

interface NoteCreateFormProps {
  className?: string;
  createNote?: (data: CreateNoteRequest) => void;
  isCreatePending?: boolean;
  chantierId: string;
}

export const NoteCreateForm: React.FC<NoteCreateFormProps> = ({
  className,
  createNote,
  isCreatePending = false,
  chantierId,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = React.useState<CreateNoteRequest>({
    author: user?.full_name || "Admin KTRAIT",
    content: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.author.trim()) {
      newErrors.author = "L'auteur est requis";
    }
    if (!formData.content.trim()) {
      newErrors.content = "Le contenu est requis";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    createNote?.(formData);
  };

  const handleChange = (field: keyof CreateNoteRequest, value: string) => {
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
        <Label htmlFor="author">
          Auteur <span className="text-destructive">*</span>
        </Label>
        <Input
          id="author"
          placeholder="Ex: Michel Dupuis"
          value={formData.author}
          onChange={(e) => handleChange("author", e.target.value)}
          required
          disabled={isCreatePending}
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
          disabled={isCreatePending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">
          Contenu <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="content"
          placeholder="Contenu de la note..."
          value={formData.content}
          onChange={(e) => handleChange("content", e.target.value)}
          required
          disabled={isCreatePending}
          rows={6}
          className={errors.content ? "border-destructive" : ""}
        />
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isCreatePending}>
          {isCreatePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Ajouter
        </Button>
      </div>
    </form>
  );
};
