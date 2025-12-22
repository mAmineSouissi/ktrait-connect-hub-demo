import React from "react";
import { api } from "@/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Upload, FileText } from "lucide-react";
import type { InvoiceTemplate } from "@/types/invoice-template.types";
import type { CreateTemplateRequest } from "@/types/invoice-template.types";

interface InvoiceTemplateManagementProps {
  className?: string;
}

export const InvoiceTemplateManagement = ({
  className,
}: InvoiceTemplateManagementProps) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = React.useState<"devis" | "facture">(
    "devis"
  );
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    template_file_type: "pdf" as "pdf" | "html",
    is_default: false,
  });

  // Fetch templates
  const { data: templatesResponse, isLoading } = useQuery({
    queryKey: ["invoice-templates", activeTab],
    queryFn: () =>
      api.admin.invoiceTemplates.list({
        type: activeTab,
      }),
  });

  const templates = templatesResponse?.templates || [];

  // Create template mutation
  const { mutate: createTemplate, isPending: isCreating } = useMutation({
    mutationFn: (data: CreateTemplateRequest) =>
      api.admin.invoiceTemplates.create(data),
    onSuccess: () => {
      toast.success("Modèle créé avec succès");
      queryClient.invalidateQueries({ queryKey: ["invoice-templates"] });
      setFormData({
        name: "",
        description: "",
        template_file_type: "pdf",
        is_default: false,
      });
      setSelectedFile(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de la création du modèle");
    },
  });

  // Delete template mutation
  const { mutate: deleteTemplate, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => api.admin.invoiceTemplates.delete(id),
    onSuccess: () => {
      toast.success("Modèle supprimé avec succès");
      queryClient.invalidateQueries({ queryKey: ["invoice-templates"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de la suppression du modèle");
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      if (fileExt === "pdf") {
        setFormData((prev) => ({ ...prev, template_file_type: "pdf" }));
      } else if (fileExt === "html" || fileExt === "htm") {
        setFormData((prev) => ({ ...prev, template_file_type: "html" }));
      } else {
        toast.error("Format de fichier non supporté. Utilisez PDF ou HTML.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error("Le nom est requis");
      return;
    }

    if (!selectedFile) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }

    createTemplate({
      name: formData.name,
      type: activeTab,
      description: formData.description || null,
      template_file: selectedFile,
      template_file_type: formData.template_file_type,
      is_default: formData.is_default,
      is_active: true,
    });
  };

  return (
    <div className={className}>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "devis" | "facture")}
        className="w-full"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="devis">Modèles Devis</TabsTrigger>
            <TabsTrigger value="facture">Modèles Factures</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="space-y-6">
          {/* Create Template Form */}
          <Card>
            <CardHeader>
              <CardTitle>Ajouter un nouveau modèle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Nom du modèle <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Ex: Modèle standard devis"
                    required
                    disabled={isCreating}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Description du modèle..."
                    disabled={isCreating}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template_file">
                    Fichier modèle <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="template_file"
                      type="file"
                      accept=".pdf,.html,.htm"
                      onChange={handleFileSelect}
                      disabled={isCreating}
                      className="flex-1"
                    />
                    {selectedFile && (
                      <Badge variant="secondary">
                        <FileText className="h-3 w-3 mr-1" />
                        {selectedFile.name}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Formats acceptés: PDF, HTML
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_default"
                    checked={formData.is_default}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        is_default: e.target.checked,
                      }))
                    }
                    disabled={isCreating}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="is_default" className="cursor-pointer">
                    Définir comme modèle par défaut
                  </Label>
                </div>

                <Button type="submit" disabled={isCreating || !selectedFile}>
                  <Upload className="h-4 w-4 mr-2" />
                  {isCreating ? "Création..." : "Créer le modèle"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Templates List */}
          <Card>
            <CardHeader>
              <CardTitle>Modèles disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Chargement...
                </div>
              ) : templates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun modèle disponible. Créez-en un ci-dessus.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Type de fichier</TableHead>
                      <TableHead>Par défaut</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templates.map((template: InvoiceTemplate) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">
                          {template.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {template.template_file_type.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {template.is_default ? (
                            <Badge variant="default">Oui</Badge>
                          ) : (
                            <span className="text-muted-foreground">Non</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {template.is_active ? (
                            <Badge variant="default">Actif</Badge>
                          ) : (
                            <Badge variant="secondary">Inactif</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTemplate(template.id)}
                            disabled={isDeleting}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
