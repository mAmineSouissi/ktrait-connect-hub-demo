"use client";

import React from "react";
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
import { formatDate } from "@/lib/date.util";
import { formatAmount } from "@/lib/currency.util";
import { ExpenseWithDetails } from "@/types/expense.types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useClientExpenseCreateSheet } from "../modals/ClientExpenseCreateSheet";
import { useClientExpenseUpdateSheet } from "../modals/ClientExpenseUpdateSheet";
import { ClientExpenseDeleteDialog } from "../modals/ClientExpenseDeleteDialog";

interface ClientProjectExpensesProps {
  projectId: string;
}

const expenseCategoryMap: Record<string, string> = {
  fondations: "Fondations",
  gros_œuvre: "Gros œuvre",
  second_œuvre: "Second œuvre",
  finitions: "Finitions",
  main_d_œuvre: "Main d'œuvre",
  matériaux: "Matériaux",
  équipements: "Équipements",
  autres: "Autres",
};

export const ClientProjectExpenses = ({
  projectId,
}: ClientProjectExpensesProps) => {
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedExpense, setSelectedExpense] = React.useState<ExpenseWithDetails | null>(null);

  // Fetch expenses for this project
  const { data: projectExpenses, isLoading: isLoadingExpenses } = useQuery({
    queryKey: ["client-expenses", "project", projectId],
    queryFn: () =>
      api.client.expenses.list({
        project_id: projectId,
        limit: 100,
      }),
    enabled: !!projectId,
  });

  // Create expense mutation
  const createExpenseMutation = useMutation({
    mutationFn: api.client.expenses.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["client-expenses", "project", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["client-project", projectId] });
      closeCreateExpenseSheet();
      toast.success("Dépense créée avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la création de la dépense");
    },
  });

  // Update expense mutation
  const updateExpenseMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.client.expenses.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["client-expenses", "project", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["client-project", projectId] });
      closeUpdateExpenseSheet();
      setSelectedExpense(null);
      toast.success("Dépense modifiée avec succès");
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Erreur lors de la modification de la dépense"
      );
    },
  });

  // Delete expense mutation
  const deleteExpenseMutation = useMutation({
    mutationFn: api.client.expenses.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["client-expenses", "project", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["client-project", projectId] });
      setIsDeleteDialogOpen(false);
      setSelectedExpense(null);
      toast.success("Dépense supprimée avec succès");
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Erreur lors de la suppression de la dépense"
      );
    },
  });

  const handleCreateExpense = async (data: any) => {
    createExpenseMutation.mutate({
      ...data,
      project_id: projectId, // Always use the current project
      amount: parseFloat(data.amount.toString()),
    });
  };

  const handleUpdateExpense = async ({
    id,
    data,
  }: {
    id: string;
    data: any;
  }) => {
    updateExpenseMutation.mutate({
      id,
      data: {
        ...data,
        amount: data.amount ? parseFloat(data.amount.toString()) : undefined,
      },
    });
  };

  const handleDeleteExpense = (expenseId: string) => {
    deleteExpenseMutation.mutate(expenseId);
  };

  const openEditExpense = (expense: ExpenseWithDetails) => {
    setIsDeleteDialogOpen(false);
    setSelectedExpense(expense);
    openUpdateExpenseSheet();
  };

  const openDeleteExpense = (expense: ExpenseWithDetails) => {
    setSelectedExpense(expense);
    setIsDeleteDialogOpen(true);
  };

  const {
    createExpenseSheet,
    openCreateExpenseSheet,
    closeCreateExpenseSheet,
  } = useClientExpenseCreateSheet({
    createExpense: handleCreateExpense,
    isCreatePending: createExpenseMutation.isPending,
    resetExpense: () => {},
    projectId,
  });

  const {
    updateExpenseSheet,
    openUpdateExpenseSheet,
    closeUpdateExpenseSheet,
  } = useClientExpenseUpdateSheet({
    updateExpense: handleUpdateExpense,
    isUpdatePending: updateExpenseMutation.isPending,
    resetExpense: () => setSelectedExpense(null),
    expense: selectedExpense,
  });

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Dépenses</CardTitle>
          <Button onClick={openCreateExpenseSheet} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une dépense
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoadingExpenses ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : projectExpenses?.expenses?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune dépense enregistrée
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectExpenses?.expenses?.map((expense: ExpenseWithDetails) => (
                  <TableRow key={expense.id}>
                    <TableCell>{formatDate(expense.date)}</TableCell>
                    <TableCell className="font-medium">
                      {expense.description || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {expense.category
                          ? expenseCategoryMap[expense.category] || expense.category
                          : "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatAmount(expense.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditExpense(expense)}
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => openDeleteExpense(expense)}
                          title="Supprimer"
                          disabled={deleteExpenseMutation.isPending}
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
      {createExpenseSheet}
      {updateExpenseSheet}
      <ClientExpenseDeleteDialog
        expense={selectedExpense}
        onDelete={handleDeleteExpense}
        isDeleting={deleteExpenseMutation.isPending}
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedExpense(null);
        }}
      />
    </>
  );
};
