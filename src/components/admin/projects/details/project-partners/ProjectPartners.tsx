"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Edit,
  Loader2,
  Plus,
  Trash2,
  HardHat,
  Mail,
  Phone,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useProjectPartnerAddSheet } from "./modals/ProjectPartnerAddSheet";
import { useProjectPartnerUpdateSheet } from "./modals/ProjectPartnerUpdateSheet";
import { ProjectPartnerDeleteDialog } from "./modals/ProjectPartnerDeleteDialog";
import type { ProjectPartnerWithDetails } from "@/api/admin/project-partners";
import type { Partner } from "@/types/partner.types";

interface ProjectPartnersProps {
  projectId: string;
}

// Partner type mapping for display
const partnerTypeMap: Record<string, string> = {
  architecte: "Architecte",
  bureau_études: "Bureau d'études",
  maître_d_œuvre: "Maître d'œuvre",
  artisan: "Artisan",
  fournisseur: "Fournisseur",
  autre: "Autre",
};

export const ProjectPartners = ({ projectId }: ProjectPartnersProps) => {
  const queryClient = useQueryClient();

  // State for partners
  const [isPartnerDeleteDialogOpen, setIsPartnerDeleteDialogOpen] =
    React.useState(false);
  const [selectedPartner, setSelectedPartner] =
    React.useState<ProjectPartnerWithDetails | null>(null);

  // Fetch partners for this project
  const { data: projectPartnersData, isLoading: isLoadingPartners } = useQuery({
    queryKey: ["projectPartners", "project", projectId],
    queryFn: () => api.admin.projectPartners.list(projectId),
    enabled: !!projectId,
  });

  // Fetch all available partners for selection
  const { data: allPartnersData } = useQuery({
    queryKey: ["partners", "all"],
    queryFn: async () => {
      const response = await fetch("/api/admin/partners?limit=1000");
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch partners");
      }
      return response.json();
    },
  });

  // Add partner mutation
  const addPartnerMutation = useMutation({
    mutationFn: (data: {
      partner_id: string;
      role?: string;
      is_primary?: boolean;
    }) => api.admin.projectPartners.add(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projectPartners", "project", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      closeAddPartnerSheet();
      toast.success("Partenaire ajouté au projet avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de l'ajout du partenaire");
    },
  });

  // Update partner mutation
  const updatePartnerMutation = useMutation({
    mutationFn: ({
      partnerId,
      data,
    }: {
      partnerId: string;
      data: { role?: string | null; is_primary?: boolean };
    }) => api.admin.projectPartners.update(projectId, partnerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projectPartners", "project", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      closeUpdatePartnerSheet();
      setSelectedPartner(null);
      toast.success("Partenaire modifié avec succès");
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Erreur lors de la modification du partenaire"
      );
    },
  });

  // Delete partner mutation
  const deletePartnerMutation = useMutation({
    mutationFn: (projectPartnerId: string) =>
      api.admin.projectPartners.remove(projectId, projectPartnerId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projectPartners", "project", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      setIsPartnerDeleteDialogOpen(false);
      setSelectedPartner(null);
      toast.success("Partenaire retiré du projet avec succès");
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Erreur lors de la suppression du partenaire"
      );
    },
  });

  // Partner handlers
  const handleAddPartner = async (data: {
    partner_id: string;
    role?: string;
    is_primary?: boolean;
  }) => {
    addPartnerMutation.mutate(data);
  };

  const handleUpdatePartner = async ({
    partnerId,
    data,
  }: {
    partnerId: string;
    data: { role?: string | null; is_primary?: boolean };
  }) => {
    updatePartnerMutation.mutate({ partnerId, data });
  };

  const handleDeletePartner = (projectPartnerId: string) => {
    deletePartnerMutation.mutate(projectPartnerId);
  };

  const openEditPartner = (partner: ProjectPartnerWithDetails) => {
    setIsPartnerDeleteDialogOpen(false);
    setSelectedPartner(partner);
    openUpdatePartnerSheet();
  };

  const openDeletePartner = (partner: ProjectPartnerWithDetails) => {
    setSelectedPartner(partner);
    setIsPartnerDeleteDialogOpen(true);
  };

  // Partner sheets
  const { addPartnerSheet, openAddPartnerSheet, closeAddPartnerSheet } =
    useProjectPartnerAddSheet({
      addPartner: handleAddPartner,
      isAddPending: addPartnerMutation.isPending,
      resetPartner: () => {},
      projectId,
      existingPartnerIds:
        projectPartnersData?.partners.map((p) => p.partner_id) || [],
      allPartners: allPartnersData?.partners || [],
    });

  const {
    updatePartnerSheet,
    openUpdatePartnerSheet,
    closeUpdatePartnerSheet,
  } = useProjectPartnerUpdateSheet({
    updatePartner: handleUpdatePartner,
    isUpdatePending: updatePartnerMutation.isPending,
    resetPartner: () => setSelectedPartner(null),
    projectPartner: selectedPartner,
    projectId,
  });

  const partners = projectPartnersData?.partners || [];

  return (
    <React.Fragment>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Partenaires</CardTitle>
          <Button onClick={openAddPartnerSheet} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un partenaire
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoadingPartners ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : partners.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun partenaire assigné à ce projet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partenaire</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partners.map((projectPartner: ProjectPartnerWithDetails) => (
                  <TableRow key={projectPartner.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <HardHat className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {projectPartner.partner?.name || "N/A"}
                          </p>
                          {projectPartner.is_primary && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              Principal
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {projectPartner.partner?.type ? (
                        <Badge variant="outline">
                          {partnerTypeMap[projectPartner.partner.type] ||
                            projectPartner.partner.type}
                        </Badge>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>
                      {projectPartner.role || (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        {projectPartner.partner?.email && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span className="text-xs">
                              {projectPartner.partner.email}
                            </span>
                          </div>
                        )}
                        {projectPartner.partner?.phone && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span className="text-xs">
                              {projectPartner.partner.phone}
                            </span>
                          </div>
                        )}
                        {!projectPartner.partner?.email &&
                          !projectPartner.partner?.phone && (
                            <span className="text-muted-foreground">—</span>
                          )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          projectPartner.partner?.status === "Actif"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {projectPartner.partner?.status || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditPartner(projectPartner)}
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => openDeletePartner(projectPartner)}
                          title="Retirer"
                          disabled={deletePartnerMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      {addPartnerSheet}
      {updatePartnerSheet}

      {/* Partner Delete Dialog */}
      <ProjectPartnerDeleteDialog
        projectPartner={selectedPartner}
        onDelete={handleDeletePartner}
        isDeleting={deletePartnerMutation.isPending}
        isOpen={isPartnerDeleteDialogOpen}
        onClose={() => {
          setIsPartnerDeleteDialogOpen(false);
          setSelectedPartner(null);
        }}
        projectId={projectId}
      />
    </React.Fragment>
  );
};
