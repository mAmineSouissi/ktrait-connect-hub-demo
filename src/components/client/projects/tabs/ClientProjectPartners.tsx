"use client";

import React from "react";
import { api } from "@/api";
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
import { HardHat, Mail, Phone, Star, Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useClientProjectPartnerAddSheet } from "../modals/ClientProjectPartnerAddSheet";
import { useClientProjectPartnerUpdateSheet } from "../modals/ClientProjectPartnerUpdateSheet";
import { ClientProjectPartnerDeleteDialog } from "../modals/ClientProjectPartnerDeleteDialog";

interface ClientProjectPartnersProps {
  projectId: string;
}

const partnerTypeMap: Record<string, string> = {
  architecte: "Architecte",
  bureau_études: "Bureau d'études",
  maître_d_œuvre: "Maître d'œuvre",
  artisan: "Artisan",
  fournisseur: "Fournisseur",
  autre: "Autre",
};

interface ProjectPartnerWithDetails {
  id: string;
  project_id: string;
  partner_id: string;
  role: string | null;
  is_primary: boolean;
  created_at: string;
  partner: {
    id: string;
    name: string;
    type: string;
    contact_person: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    status: string | null;
  } | null;
}

export const ClientProjectPartners = ({
  projectId,
}: ClientProjectPartnersProps) => {
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedPartner, setSelectedPartner] = React.useState<ProjectPartnerWithDetails | null>(null);

  // Fetch partners for this project
  const { data: projectPartnersData, isLoading: isLoadingPartners } = useQuery({
    queryKey: ["client-project-partners", "project", projectId],
    queryFn: () => api.client.projects.listPartners(projectId),
    enabled: !!projectId,
  });

  // Fetch all available partners for selection
  const { data: allPartnersData } = useQuery({
    queryKey: ["client-partners", "all"],
    queryFn: () => api.client.partners.list({ limit: 1000 }),
  });

  // Add partner mutation
  const addPartnerMutation = useMutation({
    mutationFn: (data: {
      partner_id: string;
      role?: string;
      is_primary?: boolean;
    }) => api.client.projects.addPartner(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["client-project-partners", "project", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["client-project", projectId] });
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
    }) => api.client.projects.updatePartner(projectId, partnerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["client-project-partners", "project", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["client-project", projectId] });
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
      api.client.projects.removePartner(projectId, projectPartnerId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["client-project-partners", "project", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["client-project", projectId] });
      setIsDeleteDialogOpen(false);
      setSelectedPartner(null);
      toast.success("Partenaire retiré du projet avec succès");
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Erreur lors de la suppression du partenaire"
      );
    },
  });

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
    setIsDeleteDialogOpen(false);
    setSelectedPartner(partner);
    openUpdatePartnerSheet();
  };

  const openDeletePartner = (partner: ProjectPartnerWithDetails) => {
    setSelectedPartner(partner);
    setIsDeleteDialogOpen(true);
  };

  const existingPartnerIds = (projectPartnersData?.partners || []).map(
    (pp) => pp.partner_id
  );
  const allPartners = allPartnersData?.partners || [];

  const {
    addPartnerSheet,
    openAddPartnerSheet,
    closeAddPartnerSheet,
  } = useClientProjectPartnerAddSheet({
    addPartner: handleAddPartner,
    isAddPending: addPartnerMutation.isPending,
    resetPartner: () => {},
    projectId,
    existingPartnerIds,
    allPartners,
  });

  const {
    updatePartnerSheet,
    openUpdatePartnerSheet,
    closeUpdatePartnerSheet,
  } = useClientProjectPartnerUpdateSheet({
    updatePartner: handleUpdatePartner,
    isUpdatePending: updatePartnerMutation.isPending,
    resetPartner: () => setSelectedPartner(null),
    projectPartner: selectedPartner,
    projectId,
  });

  const partners = projectPartnersData?.partners || [];

  return (
    <>
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
                {partners.map((projectPartner: ProjectPartnerWithDetails) => {
                  const partner = projectPartner.partner;
                  if (!partner) return null;

                  return (
                    <TableRow key={projectPartner.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <HardHat className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{partner.name}</p>
                            {partner.contact_person && (
                              <p className="text-xs text-muted-foreground">
                                {partner.contact_person}
                              </p>
                            )}
                          </div>
                          {projectPartner.is_primary && (
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {partnerTypeMap[partner.type] || partner.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {projectPartner.role || "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {partner.email && (
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3" />
                              <span>{partner.email}</span>
                            </div>
                          )}
                          {partner.phone && (
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3" />
                              <span>{partner.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{partner.status || "Actif"}</Badge>
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
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      {addPartnerSheet}
      {updatePartnerSheet}
      <ClientProjectPartnerDeleteDialog
        projectPartner={selectedPartner}
        onDelete={handleDeletePartner}
        isDeleting={deletePartnerMutation.isPending}
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedPartner(null);
        }}
        projectId={projectId}
      />
    </>
  );
};
