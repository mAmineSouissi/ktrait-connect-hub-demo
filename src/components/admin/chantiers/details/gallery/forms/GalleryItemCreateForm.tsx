"use client";

import React, { useState, useRef, useCallback } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Upload, Image, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import type { CreateGalleryItemRequest } from "@/api/admin/chantiers";

interface GalleryItemCreateFormProps {
  className?: string;
  createGalleryItem?: (data: CreateGalleryItemRequest) => void;
  isCreatePending?: boolean;
  chantierId: string;
}

const mediaTypeOptions = [
  { value: "photo", label: "Photo" },
  { value: "video", label: "Vidéo" },
];

export const GalleryItemCreateForm: React.FC<GalleryItemCreateFormProps> = ({
  className,
  createGalleryItem,
  isCreatePending = false,
  chantierId,
}) => {
  const [formData, setFormData] = useState<CreateGalleryItemRequest>({
    title: "",
    description: "",
    media_type: "photo",
    file_url: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const uploadFileToStorage = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;
      const filePath = `chantier-gallery/${fileName}`;

      setUploadProgress(10);

      const uploadPromise = supabase.storage
        .from("documents")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(
            new Error(
              "Upload timeout: L'upload prend trop de temps. Vérifiez votre connexion."
            )
          );
        }, 60000);
      });

      const { data, error } = (await Promise.race([
        uploadPromise,
        timeoutPromise,
      ])) as { data: any; error: any };

      if (error) {
        console.error("Storage upload error:", error);

        if (
          error.message?.includes("Bucket not found") ||
          error.message?.includes("not found")
        ) {
          throw new Error(
            "Le bucket 'documents' n'existe pas. Veuillez créer le bucket dans Supabase Dashboard (Storage > Create Bucket) ou exécuter setup-supabase-storage.sql"
          );
        }

        if (
          error.message?.includes("row-level security") ||
          error.message?.includes("RLS") ||
          error.message?.includes("permission")
        ) {
          throw new Error(
            "Erreur de permissions. Vérifiez que les politiques RLS du bucket 'documents' permettent l'upload. Exécutez setup-supabase-storage.sql pour configurer les permissions."
          );
        }

        if (error.message?.includes("JWT")) {
          throw new Error(
            "Erreur d'authentification. Veuillez vous reconnecter."
          );
        }

        if (error.message?.includes("timeout")) {
          throw error;
        }

        throw new Error(
          `Erreur lors de l'upload: ${error.message || "Erreur inconnue"}`
        );
      }

      if (!data) {
        throw new Error("Aucune donnée retournée après l'upload");
      }

      setUploadProgress(90);

      const {
        data: { publicUrl },
      } = supabase.storage.from("documents").getPublicUrl(filePath);

      if (!publicUrl) {
        throw new Error("Impossible d'obtenir l'URL publique du fichier");
      }

      setUploadProgress(100);
      return publicUrl;
    } catch (error: any) {
      setUploadProgress(0);
      console.error("Upload error details:", error);
      throw error;
    }
  };

  const handleFileSelect = useCallback((file: File) => {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      toast.error("Veuillez sélectionner une image ou une vidéo");
      return;
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast.error("Le fichier est trop volumineux (max 50MB)");
      return;
    }

    setSelectedFile(file);
    setFormData((prev) => ({
      ...prev,
      media_type: isImage ? "photo" : "video",
    }));

    if (isImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.file;
      return newErrors;
    });
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!formData.title.trim()) {
      setErrors({ title: "Le titre est requis" });
      return;
    }

    if (!selectedFile && !formData.file_url) {
      setErrors({ file: "Veuillez sélectionner un fichier" });
      return;
    }

    try {
      let fileUrl = formData.file_url;

      if (selectedFile) {
        setIsUploading(true);
        setUploadProgress(0);
        try {
          fileUrl = await uploadFileToStorage(selectedFile);
        } catch (uploadError: any) {
          setIsUploading(false);
          setUploadProgress(0);
          toast.error(
            uploadError.message || "Erreur lors de l'upload du fichier"
          );
          return;
        }
        setIsUploading(false);
      }

      createGalleryItem?.({
        ...formData,
        file_url: fileUrl,
        description: formData.description || null,
        date: formData.date || null,
      });
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast.error(error.message || "Erreur lors de la création de l'élément");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleChange = (
    field: keyof CreateGalleryItemRequest,
    value: string
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

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormData((prev) => ({ ...prev, file_url: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label htmlFor="title">
          Titre <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          placeholder="Ex: Avancement des travaux"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          required
          disabled={isCreatePending || isUploading}
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
          onChange={(e) => handleChange("description", e.target.value)}
          disabled={isCreatePending || isUploading}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="media_type">Type de média</Label>
          <Select
            value={formData.media_type || "photo"}
            onValueChange={(value) => handleChange("media_type", value as any)}
            disabled={isCreatePending || isUploading}
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
            onChange={(e) => handleChange("date", e.target.value)}
            disabled={isCreatePending || isUploading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">
          Fichier <span className="text-destructive">*</span>
        </Label>
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25",
            errors.file ? "border-destructive" : ""
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            id="file"
            accept="image/*,video/*"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={isCreatePending || isUploading}
          />
          {selectedFile ? (
            <div className="space-y-2">
              {previewUrl && (
                <div className="mx-auto w-32 h-32 rounded-lg overflow-hidden border">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center justify-center gap-2">
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  disabled={isCreatePending || isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
              <div>
                <Label
                  htmlFor="file"
                  className="cursor-pointer text-primary hover:underline"
                >
                  Cliquez pour sélectionner
                </Label>
                <span className="text-muted-foreground">
                  {" "}
                  ou glissez-déposez
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Images ou vidéos (max 50MB)
              </p>
            </div>
          )}
        </div>
        {errors.file && (
          <p className="text-sm text-destructive">{errors.file}</p>
        )}
        {isUploading && (
          <div className="space-y-2">
            <Progress value={uploadProgress} />
            <p className="text-xs text-center text-muted-foreground">
              Upload en cours... {uploadProgress}%
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isCreatePending || isUploading}>
          {(isCreatePending || isUploading) && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {isUploading ? "Upload..." : "Ajouter"}
        </Button>
      </div>
    </form>
  );
};
