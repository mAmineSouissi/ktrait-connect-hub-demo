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
import { ExpenseWithDetails } from "@/types/expense.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Eye, Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { useExpenseCreateSheet } from "./modals/ExpenseCreateSheet";
import { useExpenseUpdateSheet } from "./modals/ExpenseUpdateSheet";
import { ExpenseDeleteDialog } from "./modals/ExpenseDeleteDialog";

interface ProjectExpensesProps {
  projectId: string;
}

export const ProjectExpenses = ({ projectId }: ProjectExpensesProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: projectData } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const result = await api.admin.projects.getById(projectId);
      return result.project;
    },
    enabled: !!projectId,
  });

  const { data: projectExpenses, isLoading: isLoadingExpenses } = useQuery({
    queryKey: ["expenses", "project", projectId],
    queryFn: () =>
      api.admin.expenses.list({
        project_id: projectId,
        limit: 100,
      }),
    enabled: !!projectId,
  });

  // State for expenses
  const [isExpenseDeleteDialogOpen, setIsExpenseDeleteDialogOpen] =
    React.useState(false);
  const [selectedExpense, setSelectedExpense] =
    React.useState<ExpenseWithDetails | null>(null);

  // Create expense mutation
  const createExpenseMutation = useMutation({
    mutationFn: api.admin.expenses.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses", "project", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
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
      api.admin.expenses.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses", "project", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
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
    mutationFn: api.admin.expenses.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses", "project", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      setIsExpenseDeleteDialogOpen(false);
      setSelectedExpense(null);
      toast.success("Dépense supprimée avec succès");
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Erreur lors de la suppression de la dépense"
      );
    },
  });

  // Expense handlers
  const handleCreateExpense = async (data: any) => {
    createExpenseMutation.mutate({
      ...data,
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
    setIsExpenseDeleteDialogOpen(false);
    setSelectedExpense(expense);
    openUpdateExpenseSheet();
  };

  const openDeleteExpense = (expense: ExpenseWithDetails) => {
    setSelectedExpense(expense);
    setIsExpenseDeleteDialogOpen(true);
  };

  // Expense sheets
  const {
    createExpenseSheet,
    openCreateExpenseSheet,
    closeCreateExpenseSheet,
  } = useExpenseCreateSheet({
    createExpense: handleCreateExpense,
    isCreatePending: createExpenseMutation.isPending,
    resetExpense: () => {},
    projects: projectData ? [projectData] : [],
    defaultProjectId: projectId,
  });

  const {
    updateExpenseSheet,
    openUpdateExpenseSheet,
    closeUpdateExpenseSheet,
  } = useExpenseUpdateSheet({
    updateExpense: handleUpdateExpense,
    isUpdatePending: updateExpenseMutation.isPending,
    resetExpense: () => setSelectedExpense(null),
    expense: selectedExpense,
    projects: projectData ? [projectData] : [],
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
          ) : (projectExpenses?.expenses || []).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune dépense pour ce projet
            </div>
          ) : (
            (() => {
              const expenses = projectExpenses?.expenses || [];
              const categoryMap: Record<string, string> = {
                fondations: "Fondations",
                gros_œuvre: "Gros œuvre",
                second_œuvre: "Second œuvre",
                finitions: "Finitions",
                main_d_œuvre: "Main d'œuvre",
                matériaux: "Matériaux",
                équipements: "Équipements",
                autres: "Autres",
              };

              return (
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
                    {expenses.map((expense: ExpenseWithDetails) => (
                      <TableRow key={expense.id}>
                        <TableCell>{formatDate(expense.date)}</TableCell>
                        <TableCell className="font-medium">
                          {expense.description}
                        </TableCell>
                        <TableCell>
                          {expense.category ? (
                            <Badge variant="outline">
                              {categoryMap[expense.category] ||
                                expense.category}
                            </Badge>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatAmount(expense.amount)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                router.push(`/admin/expenses/${expense.id}`)
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
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
              );
            })()
          )}
        </CardContent>
      </Card>
      {createExpenseSheet}
      {updateExpenseSheet}

      {/* Expense Delete Dialog */}
      <ExpenseDeleteDialog
        expense={selectedExpense}
        onDelete={handleDeleteExpense}
        isDeleting={deleteExpenseMutation.isPending}
        isOpen={isExpenseDeleteDialogOpen}
        onClose={() => {
          setIsExpenseDeleteDialogOpen(false);
          setSelectedExpense(null);
        }}
      />
    </>
  );
};
