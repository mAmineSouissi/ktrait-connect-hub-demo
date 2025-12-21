"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import type { ClientDetail } from "@/types/client.types";
import { usePaymentCreateSheet } from "@/components/admin/payments/modals/PaymentCreateSheet";
import { usePaymentUpdateSheet } from "@/components/admin/payments/modals/PaymentUpdateSheet";
import { PaymentDeleteDialog } from "@/components/admin/payments/modals/PaymentDeleteDialog";
import type { PaymentWithDetails } from "@/types/payment.types";
import type { Project } from "@/types/project.types";

interface ClientPaymentTableProps {
  client: ClientDetail;
}

const statusMap: Record<string, string> = {
  en_attente: "En attente",
  payé: "Payé",
  partiel: "Partiel",
  annulé: "Annulé",
};

const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("fr-FR");
};

const formatAmount = (amount: number | string) => {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(numAmount);
};

export const ClientPaymentTable = ({ client }: ClientPaymentTableProps) => {
  const queryClient = useQueryClient();
  const clientId = client.id;

  // Fetch payments for this client
  const {
    data: paymentsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["payments", "client", clientId],
    queryFn: () =>
      api.admin.payments.list({
        client_id: clientId,
        limit: 100,
      }),
    enabled: !!clientId,
  });

  // Fetch projects for the payment form
  const { data: projectsData } = useQuery({
    queryKey: ["projects", "client", clientId],
    queryFn: () =>
      api.admin.projects.list({
        client_id: clientId,
        limit: 100,
      }),
  });

  const projects = projectsData?.projects || [];

  // State for payments
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentWithDetails | null>(null);

  // Create payment mutation
  const createPaymentMutation = useMutation({
    mutationFn: api.admin.payments.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payments", "client", clientId],
      });
      queryClient.invalidateQueries({ queryKey: ["client", clientId] });
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
        queryKey: ["payments", "client", clientId],
      });
      queryClient.invalidateQueries({ queryKey: ["client", clientId] });
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
        queryKey: ["payments", "client", clientId],
      });
      queryClient.invalidateQueries({ queryKey: ["client", clientId] });
      setIsDeleteDialogOpen(false);
      setSelectedPayment(null);
      toast.success("Paiement supprimé avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la suppression du paiement");
    },
  });

  // Payment handlers
  const handleCreatePayment = async (data: any) => {
    createPaymentMutation.mutate({
      ...data,
      client_id: clientId,
      amount: parseFloat(data.amount.toString()),
    });
  };

  const handleUpdatePayment = async ({
    id,
    data,
  }: {
    id: string;
    data: any;
  }) => {
    updatePaymentMutation.mutate({
      id,
      data: {
        ...data,
        amount: data.amount ? parseFloat(data.amount.toString()) : undefined,
      },
    });
  };

  const handleDeletePayment = (paymentId: string) => {
    deletePaymentMutation.mutate(paymentId);
  };

  const openEditPayment = (payment: PaymentWithDetails) => {
    setIsDeleteDialogOpen(false);
    setSelectedPayment(payment);
    openUpdatePaymentSheet();
  };

  const openDeletePayment = (payment: PaymentWithDetails) => {
    setSelectedPayment(payment);
    setIsDeleteDialogOpen(true);
  };

  // Payment sheets
  const {
    createPaymentSheet,
    openCreatePaymentSheet,
    closeCreatePaymentSheet,
  } = usePaymentCreateSheet({
    createPayment: handleCreatePayment,
    isCreatePending: createPaymentMutation.isPending,
    resetPayment: () => {},
    projects,
    clients: [client],
    defaultClientId: clientId,
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
    projects,
    clients: [client],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-destructive">
        Erreur lors du chargement des paiements
      </div>
    );
  }

  const payments = paymentsData?.payments || [];

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={openCreatePaymentSheet} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un paiement
        </Button>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Aucun paiement pour ce client
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Projet</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment: PaymentWithDetails) => (
              <TableRow key={payment.id}>
                <TableCell>{formatDate(payment.date)}</TableCell>
                <TableCell className="font-medium">
                  {payment.description || "N/A"}
                </TableCell>
                <TableCell>{payment.project_name || "N/A"}</TableCell>
                <TableCell>{formatAmount(payment.amount)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      payment.status === "payé"
                        ? "default"
                        : payment.status === "annulé"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {statusMap[payment.status] || payment.status}
                  </Badge>
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

      {/* Payment Sheets */}
      {createPaymentSheet}
      {updatePaymentSheet}

      {/* Payment Delete Dialog */}
      <PaymentDeleteDialog
        payment={selectedPayment}
        onDelete={handleDeletePayment}
        isDeleting={deletePaymentMutation.isPending}
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedPayment(null);
        }}
      />
    </>
  );
};
