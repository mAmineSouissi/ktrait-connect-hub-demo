"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { Loader2, X, Image } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import type { UpdateGalleryItemRequest } from "@/api/admin/gallery";
import type { ProjectGalleryItem } from "@/types/gallery.types";

interface GalleryUpdateFormProps {
  className?: string;
  updateGalleryItem?: (data: {
    projectId: string;
    galleryId: string;
    data: UpdateGalleryItemRequest;
  }) => void;
  isUpdatePending?: boolean;
  galleryItem?: ProjectGalleryItem | null;
  projectId: string;
}

const mediaTypeOptions = [
  { value: "photo", label: "Photo" },
  { value: "video", label: "Vidéo" },
];

export const GalleryUpdateForm: React.FC<GalleryUpdateFormProps> = ({
  className,
  updateGalleryItem,
  isUpdatePending = false,
  galleryItem,
  projectId,
}) => {
  const [formData, setFormData] = useState<UpdateGalleryItemRequest>({
    title: "",
    description: "",
    media_type: "photo",
    file_url: "",
    date: null,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (galleryItem) {
      setFormData({
        title: galleryItem.title || "",
        description: galleryItem.description || "",
        media_type: galleryItem.media_type || "photo",
        file_url: galleryItem.file_url || "",
        date: galleryItem.date || null,
      });
      setPreviewUrl(galleryItem.file_url || null);
      setSelectedFile(null);
      setErrors({});
    }
  }, [galleryItem]);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  // File upload handler
  const uploadFileToStorage = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      setUploadProgress(10);

      // Add timeout to prevent hanging
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
        }, 60000); // 60 second timeout
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

  // Handle file selection
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

    // Create preview for images
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

    if (!formData.title?.trim()) {
      setErrors({ title: "Le titre est requis" });
      return;
    }

    if (!galleryItem?.id) {
      toast.error("ID de l'élément de galerie manquant");
      return;
    }

    try {
      let fileUrl = formData.file_url;

      // Upload new file if selected
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
          return; // Stop execution if upload fails
        }
        setIsUploading(false);
      }

      // Only call updateGalleryItem if upload succeeded or no upload needed
      updateGalleryItem?.({
        projectId,
        galleryId: galleryItem.id,
        data: {
          ...formData,
          file_url: selectedFile ? fileUrl : formData.file_url,
        },
      });
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast.error(
        error.message || "Erreur lors de la modification de l'élément"
      );
      setIsUploading(false);
      setUploadProgress(0);
    }
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

  const removeFile = () => {
    setSelectedFile(null);
    if (galleryItem?.file_url) {
      setPreviewUrl(galleryItem.file_url);
    } else {
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
          disabled={isUpdatePending || isUploading}
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
          disabled={isUpdatePending || isUploading}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="media_type">Type de média</Label>
          <Select
            value={formData.media_type}
            onValueChange={(value) => handleChange("media_type", value as any)}
            disabled={isUpdatePending || isUploading}
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
            disabled={isUpdatePending || isUploading}
          />
        </div>
      </div>

      {/* File Preview/Upload Area */}
      <div className="space-y-2">
        <Label>Fichier</Label>
        {(selectedFile || formData.file_url) && (
          <div className="relative border rounded-lg p-4">
            {previewUrl && formData.media_type === "photo" && (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg mb-2"
              />
            )}
            {previewUrl && formData.media_type === "video" && (
              <div className="w-full h-48 bg-muted rounded-lg mb-2 flex items-center justify-center">
                <Image className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {selectedFile?.name || "Fichier actuel"}
                </p>
                {selectedFile && (
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                )}
              </div>
              {selectedFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={removeFile}
                  disabled={isUpdatePending || isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {isUploading && (
              <div className="mt-2">
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload en cours... {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        )}

        {!selectedFile && (
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileInputChange}
              className="hidden"
              disabled={isUpdatePending || isUploading}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUpdatePending || isUploading}
            >
              <Image className="h-4 w-4 mr-2" />
              {formData.file_url
                ? "Remplacer le fichier"
                : "Sélectionner un fichier"}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Images et vidéos jusqu'à 50MB
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isUpdatePending || isUploading}>
          {(isUpdatePending || isUploading) && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {isUploading ? "Upload en cours..." : "Enregistrer les modifications"}
        </Button>
      </div>
    </form>
  );
};
