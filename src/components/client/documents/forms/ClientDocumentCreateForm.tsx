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
import { Upload, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import type { CreateDocumentRequest } from "@/api/client/documents";
import type { Project } from "@/types/project.types";

interface ClientDocumentCreateFormProps {
  className?: string;
  createDocument?: (data: CreateDocumentRequest) => void;
  isCreatePending?: boolean;
  projects?: Project[];
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
  projects = [],
}) => {
  const [formData, setFormData] = useState<CreateDocumentRequest>({
    name: "",
    folder: "",
    project_id: "",
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

      const { data, error } = await supabase.storage
        .from("documents")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

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
        file_size: formatFileSize(file.size),
      };
    } catch (error: any) {
      setUploadProgress(0);
      throw error;
    }
  };

  // Handle file selection
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
        file_type: typeMap[fileExt] || "PDF",
      }));
    }
  }, []);

  // Drag and drop handlers
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

    if (!formData.project_id) {
      setErrors({ project_id: "Le projet est requis" });
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
        name: formData.name,
        project_id: formData.project_id,
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
        <Label htmlFor="project_id">
          Projet associé <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.project_id}
          onValueChange={(value) => handleChange("project_id", value)}
          disabled={isCreatePending || isUploading}
        >
          <SelectTrigger className={errors.project_id ? "border-destructive" : ""}>
            <SelectValue placeholder="Sélectionner un projet" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.project_id && (
          <p className="text-sm text-destructive">{errors.project_id}</p>
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
          accept=".pdf,.dwg,.doc,.docx,.xls,.xlsx"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isCreatePending || isUploading}
        />
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted hover:bg-muted/50",
            selectedFile ? "border-primary bg-primary/5" : "",
            (isCreatePending || isUploading) && "opacity-50 cursor-not-allowed"
          )}
        >
          {selectedFile ? (
            <div className="space-y-2">
              <FileText className="h-8 w-8 mx-auto text-primary mb-2" />
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(selectedFile.size)}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="mt-2"
                disabled={isCreatePending || isUploading}
              >
                Changer de fichier
              </Button>
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Cliquez ou glissez un fichier ici
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, DWG, DOC, DOCX, XLS, XLSX jusqu'à 50MB
              </p>
            </>
          )}
        </div>
        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Upload en cours...</span>
              <span className="font-medium">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setFormData({
              name: "",
              folder: "",
              project_id: "",
              file_type: "PDF",
              status: "en_attente",
            });
            setSelectedFile(null);
            setErrors({});
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
          disabled={isCreatePending || isUploading}
        >
          Réinitialiser
        </Button>
        <Button
          type="submit"
          disabled={isCreatePending || isUploading || !selectedFile}
        >
          {(isCreatePending || isUploading) && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {isUploading ? "Upload..." : "Créer"}
        </Button>
      </div>
    </form>
  );
};

