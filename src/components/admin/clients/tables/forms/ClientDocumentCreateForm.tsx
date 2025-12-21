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
import type { CreateDocumentRequest } from "@/api/admin/documents";

interface ClientDocumentCreateFormProps {
  className?: string;
  createDocument?: (data: CreateDocumentRequest) => void;
  isCreatePending?: boolean;
  clientId: string;
  onReset?: () => void;
}

// Common folder names
const folderNames = [
  "Contrats",
  "Plans",
  "Devis",
  "Factures",
  "Permis",
  "Rapports",
  "Autres",
];

const fileTypeOptions = [
  { value: "PDF", label: "PDF" },
  { value: "DOC", label: "DOC" },
  { value: "DOCX", label: "DOCX" },
  { value: "XLS", label: "XLS" },
  { value: "XLSX", label: "XLSX" },
  { value: "IMAGE", label: "Image" },
  { value: "AUTRE", label: "Autre" },
];

const statusOptions = [
  { value: "en_attente", label: "En attente" },
  { value: "validé", label: "Validé" },
  { value: "rejeté", label: "Rejeté" },
];

export const ClientDocumentCreateForm: React.FC<
  ClientDocumentCreateFormProps
> = ({
  className,
  createDocument,
  isCreatePending = false,
  clientId,
  onReset,
}) => {
  const [formData, setFormData] = useState<CreateDocumentRequest>({
    name: "",
    folder: "",
    client_id: clientId,
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
  ): Promise<{ file_url: string; file_size: string }> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      setUploadProgress(10);

      const uploadPromise = supabase.storage
        .from("documents")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, timeoutReject) => {
        setTimeout(() => {
          timeoutReject(
            new Error("Upload timeout: Le téléchargement a pris trop de temps")
          );
        }, 60000); // 60 second timeout
      });

      // Race between upload and timeout
      const { data, error } = (await Promise.race([
        uploadPromise,
        timeoutPromise,
      ])) as any;

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

      return {
        file_url: publicUrl,
        file_size: file.size.toString(),
      };
    } catch (error: any) {
      setUploadProgress(0);
      setIsUploading(false);
      throw error;
    }
  };

  const handleFileSelect = useCallback((file: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/acad",
      "application/x-dwg",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    const allowedExtensions = ["pdf", "dwg", "doc", "docx", "xls", "xlsx"];

    const fileExt = file.name.split(".").pop()?.toLowerCase();
    const isValidType =
      allowedTypes.includes(file.type) ||
      (fileExt && allowedExtensions.includes(fileExt));

    if (!isValidType) {
      toast.error(
        "Type de fichier non supporté. Formats acceptés: PDF, DWG, DOC, DOCX, XLS, XLSX"
      );
      return;
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast.error("Le fichier est trop volumineux. Taille maximale: 50MB");
      return;
    }

    setSelectedFile(file);
    if (fileExt) {
      const typeMap: Record<string, string> = {
        pdf: "PDF",
        dwg: "DWG",
        doc: "DOC",
        docx: "DOCX",
        xls: "XLS",
        xlsx: "XLSX",
      };
      setFormData((prev) => ({
        ...prev,
        name: prev.name || file.name.split(".")[0],
        file_type: typeMap[fileExt] || "PDF",
      }));
    }
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

  const resetForm = React.useCallback(() => {
    setFormData({
      name: "",
      folder: "",
      client_id: clientId,
      file_type: "PDF",
      status: "en_attente",
    });
    setSelectedFile(null);
    setErrors({});
    setIsUploading(false);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onReset?.();
  }, [clientId, onReset]);

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

      await createDocument?.({
        name: formData.name,
        folder: formData.folder || undefined,
        client_id: clientId,
        file_type: formData.file_type || undefined,
        file_url: uploadResult.file_url,
        file_size: uploadResult.file_size,
        status: formData.status || "en_attente",
      });

      // Reset form after successful creation
      resetForm();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Erreur lors de l'upload du fichier");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleChange = (field: keyof CreateDocumentRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Reset form when isCreatePending changes from true to false (success)
  React.useEffect(() => {
    if (!isCreatePending && !isUploading) {
      // Form was successfully submitted, reset it after a short delay
      const timer = setTimeout(() => {
        resetForm();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isCreatePending, isUploading, resetForm]);

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      {/* File Upload Area */}
      <div className="space-y-2">
        <Label>
          Fichier <span className="text-destructive">*</span>
        </Label>
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25",
            selectedFile && "border-primary"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {selectedFile ? (
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <FileText className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveFile}
                  className="ml-auto"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {isUploading && (
                <div className="space-y-2">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Téléchargement en cours... {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  Glissez-déposez un fichier ici
                </p>
                <p className="text-xs text-muted-foreground">
                  ou cliquez pour sélectionner
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isCreatePending || isUploading}
              >
                Sélectionner un fichier
              </Button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileInputChange}
            accept=".pdf,.dwg,.doc,.docx,.xls,.xlsx"
          />
        </div>
      </div>

      {/* Document Name */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Nom du document <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Ex: Contrat de construction"
          value={formData.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          required
          disabled={isCreatePending || isUploading}
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      {/* Folder */}
      <div className="space-y-2">
        <Label htmlFor="folder">Dossier</Label>
        <Select
          value={formData.folder || ""}
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

      {/* File Type and Status */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="file_type">Type de fichier</Label>
          <Select
            value={formData.file_type || "PDF"}
            onValueChange={(value) => handleChange("file_type", value)}
            disabled={isCreatePending || isUploading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fileTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select
            value={formData.status || "en_attente"}
            onValueChange={(value) =>
              handleChange(
                "status",
                value as "en_attente" | "validé" | "rejeté"
              )
            }
            disabled={isCreatePending || isUploading}
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
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="submit"
          disabled={isCreatePending || isUploading || !selectedFile}
          className="min-w-[120px]"
        >
          {isCreatePending || isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isUploading ? "Téléchargement..." : "Création..."}
            </>
          ) : (
            "Créer le document"
          )}
        </Button>
      </div>
    </form>
  );
};
