"use client";

import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, FileText, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import type { CreateDocumentRequest } from "@/api/client/documents";

interface ClientDocumentCreateFormProps {
  className?: string;
  createDocument?: (data: CreateDocumentRequest) => void;
  isCreatePending?: boolean;
  projectId: string;
}

// Common folder names
const folderNames = [
  "Contrats",
  "Plans",
  "Devis",
  "Factures",
  "Permis",
  "Rapports",
];

export const ClientDocumentCreateForm: React.FC<ClientDocumentCreateFormProps> = ({
  className,
  createDocument,
  isCreatePending = false,
  projectId,
}) => {
  const [formData, setFormData] = useState<Omit<CreateDocumentRequest, "project_id">>({
    name: "",
    folder: "",
    file_type: "PDF",
    status: "en_attente",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  // File upload handler
  const uploadFileToStorage = async (
    file: File
  ): Promise<{ file_url: string; file_size: number }> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      setUploadProgress(10);

      const { data, error } = await supabase.storage
        .from("documents")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Storage upload error:", error);
        throw new Error(
          error.message || "Erreur lors de l'upload du fichier"
        );
      }

      setUploadProgress(50);

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("documents").getPublicUrl(filePath);

      setUploadProgress(100);

      return {
        file_url: publicUrl,
        file_size: file.size,
      };
    } catch (error: any) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleFileSelect = useCallback((file: File) => {
    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast.error("Le fichier est trop volumineux (max 50MB)");
      return;
    }

    // Auto-detect file type from extension
    const ext = file.name.split(".").pop()?.toUpperCase();
    const fileTypes = ["PDF", "DWG", "DOC", "DOCX", "XLS", "XLSX", "JPG", "PNG"];
    const detectedType = fileTypes.find((type) => ext === type) || "PDF";

    setSelectedFile(file);
    setFormData((prev) => ({
      ...prev,
      file_type: detectedType,
      name: prev.name || file.name.replace(/\.[^/.]+$/, ""), // Auto-fill name without extension
    }));
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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!formData.name?.trim()) {
      setErrors({ name: "Le nom du document est requis" });
      return;
    }

    if (!selectedFile) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadResult = await uploadFileToStorage(selectedFile);

      createDocument?.({
        project_id: projectId, // Always use the current project
        name: formData.name,
        folder: formData.folder || undefined,
        file_type: formData.file_type || undefined,
        file_url: uploadResult.file_url,
        file_size: uploadResult.file_size,
        status: formData.status || "en_attente",
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Erreur lors de l'upload du fichier");
      setIsUploading(false);
      setUploadProgress(0);
    }
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

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label htmlFor="name">
          Nom du document <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Ex: Contrat Villa Dupont"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
          disabled={isCreatePending || isUploading}
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="folder">Dossier</Label>
        <Select
          value={formData.folder}
          onValueChange={(value) => handleChange("folder", value)}
          disabled={isCreatePending || isUploading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un dossier" />
          </SelectTrigger>
          <SelectContent>
            {folderNames.map((folder) => (
              <SelectItem key={folder} value={folder}>
                {folder}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="file_type">Type de fichier</Label>
        <Select
          value={formData.file_type}
          onValueChange={(value) => handleChange("file_type", value)}
          disabled={isCreatePending || isUploading}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PDF">PDF</SelectItem>
            <SelectItem value="DWG">DWG</SelectItem>
            <SelectItem value="DOC">DOC</SelectItem>
            <SelectItem value="DOCX">DOCX</SelectItem>
            <SelectItem value="XLS">XLS</SelectItem>
            <SelectItem value="XLSX">XLSX</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">
          Fichier <span className="text-destructive">*</span>
        </Label>
        <input
          ref={fileInputRef}
          id="file"
          type="file"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isCreatePending || isUploading}
        />
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50",
            (isCreatePending || isUploading) && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          {selectedFile ? (
            <div className="space-y-2">
              <FileText className="h-8 w-8 mx-auto text-primary" />
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(selectedFile.size)}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                disabled={isUploading}
              >
                <X className="h-4 w-4 mr-2" />
                Retirer
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Glissez-déposez un fichier ici ou cliquez pour sélectionner
              </p>
              <p className="text-xs text-muted-foreground">
                Taille max: 50MB
              </p>
            </div>
          )}
        </div>
        {isUploading && (
          <div className="space-y-2">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Upload en cours... {uploadProgress}%
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="submit"
          disabled={isCreatePending || isUploading || !selectedFile}
        >
          {isUploading || isCreatePending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isUploading ? "Upload..." : "Création..."}
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Créer le document
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

