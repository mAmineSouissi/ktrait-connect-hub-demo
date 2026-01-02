"use client";

import { api } from "@/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableRow,
  TableHeader,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { formatAmount } from "@/lib/currency.util";
import { formatDate } from "@/lib/date.util";
import { PaymentWithDetails } from "@/types/payment.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Loader2, Plus, Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { usePaymentCreateSheet } from "./modals/PaymentCreateSheet";
import { usePaymentUpdateSheet } from "./modals/PaymentUpdateSheet";
import { PaymentDeleteDialog } from "./modals/PaymentDeleteDialog";

interface ProjectPaymentsProps {
  projectId: string;
}

const statusLabels: Record<string, string> = {
  en_attente: "En attente",
  payé: "Payé",
  partiel: "Partiel",
  annulé: "Annulé",
};

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  en_attente: "outline",
  payé: "default",
  partiel: "secondary",
  annulé: "destructive",
};

export const ProjectPayments = ({ projectId }: ProjectPaymentsProps) => {
  const queryClient = useQueryClient();

  const { data: projectData } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const result = await api.admin.projects.getById(projectId);
      return result.project;
    },
    enabled: !!projectId,
  });

  const { data: projectPayments, isLoading: isLoadingPayments } = useQuery({
    queryKey: ["payments", "project", projectId],
    queryFn: () =>
      api.admin.payments.list({
        project_id: projectId,
        limit: 100,
      }),
    enabled: !!projectId,
  });

  // State for payments
  const [isPaymentDeleteDialogOpen, setIsPaymentDeleteDialogOpen] =
    React.useState(false);
  const [selectedPayment, setSelectedPayment] =
    React.useState<PaymentWithDetails | null>(null);

  // Create payment mutation
  const createPaymentMutation = useMutation({
    mutationFn: api.admin.payments.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payments", "project", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      closeCreatePaymentSheet();
      toast.success("Paiement créé avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la création du paiement");
    },
  });

  // Update payment mutation
  const updatePaymentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.admin.payments.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payments", "project", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      closeUpdatePaymentSheet();
      setSelectedPayment(null);
      toast.success("Paiement modifié avec succès");
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Erreur lors de la modification du paiement"
      );
    },
  });

  // Delete payment mutation
  const deletePaymentMutation = useMutation({
    mutationFn: api.admin.payments.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payments", "project", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      setIsPaymentDeleteDialogOpen(false);
      setSelectedPayment(null);
      toast.success("Paiement supprimé avec succès");
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Erreur lors de la suppression du paiement"
      );
    },
  });

  const handleCreatePayment = async (data: any) => {
    createPaymentMutation.mutate({
      ...data,
      project_id: projectId,
      client_id: projectData?.client?.id || "",
    });
  };

  const handleUpdatePayment = async ({
    id,
    data,
  }: {
    id: string;
    data: any;
  }) => {
    updatePaymentMutation.mutate({ id, data });
  };

  const handleDeletePayment = (paymentId: string) => {
    deletePaymentMutation.mutate(paymentId);
  };

  const openEditPayment = (payment: PaymentWithDetails) => {
    setIsPaymentDeleteDialogOpen(false);
    setSelectedPayment(payment);
    openUpdatePaymentSheet();
  };

  const openDeletePayment = (payment: PaymentWithDetails) => {
    setSelectedPayment(payment);
    setIsPaymentDeleteDialogOpen(true);
  };

  const {
    createPaymentSheet,
    openCreatePaymentSheet,
    closeCreatePaymentSheet,
  } = usePaymentCreateSheet({
    createPayment: handleCreatePayment,
    isCreatePending: createPaymentMutation.isPending,
    resetPayment: () => {},
    projects: projectData ? [projectData] : [],
    clients: projectData?.client
      ? [
          {
            id: projectData.client.id,
            full_name: projectData.client.full_name || "",
            email: projectData.client.email || "",
            is_active: true,
            email_verified: true,
            role: "client" as const,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]
      : [],
    defaultProjectId: projectId,
    defaultClientId: projectData?.client?.id,
  });

  const {
    updatePaymentSheet,
    openUpdatePaymentSheet,
    closeUpdatePaymentSheet,
  } = usePaymentUpdateSheet({
    updatePayment: handleUpdatePayment,
    isUpdatePending: updatePaymentMutation.isPending,
    resetPayment: () => setSelectedPayment(null),
    payment: selectedPayment,
    projects: projectData ? [projectData] : [],
    clients: projectData?.client
      ? [
          {
            id: projectData.client.id,
            full_name: projectData.client.full_name || "",
            email: projectData.client.email || "",
            is_active: true,
            email_verified: true,
            role: "client" as const,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]
      : [],
  });

  const payments = projectPayments?.payments || [];

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Paiements</CardTitle>
          <Button onClick={openCreatePaymentSheet} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un paiement
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoadingPayments ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun paiement enregistré
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Méthode</TableHead>
                  <TableHead>Référence</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment: PaymentWithDetails) => (
                  <TableRow key={payment.id}>
                    <TableCell>{formatDate(payment.date)}</TableCell>
                    <TableCell className="font-medium">
                      {formatAmount(payment.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[payment.status] || "outline"}>
                        {statusLabels[payment.status] || payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.payment_method || "-"}</TableCell>
                    <TableCell>{payment.reference || "-"}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {payment.description || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditPayment(payment)}
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => openDeletePayment(payment)}
                          title="Supprimer"
                          disabled={deletePaymentMutation.isPending}
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
      {createPaymentSheet}
      {updatePaymentSheet}
      <PaymentDeleteDialog
        payment={selectedPayment}
        onDelete={handleDeletePayment}
        isDeleting={deletePaymentMutation.isPending}
        isOpen={isPaymentDeleteDialogOpen}
        onClose={() => {
          setIsPaymentDeleteDialogOpen(false);
          setSelectedPayment(null);
        }}
      />
    </>
  );
};

