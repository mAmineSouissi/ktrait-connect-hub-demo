"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  Loader2,
  FileText,
  Building2,
  Receipt,
} from "lucide-react";
import { useRouter } from "next/router";
import { api } from "@/api";
import { formatDate } from "@/lib/date.util";
import { formatAmount } from "@/lib/currency.util";
import type { Expense } from "@/types/expense.types";

interface AdminExpenseDetailProps {
  projectId?: string;
  expenseId: string;
}

// Category mapping for display
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

export const AdminExpenseDetail = ({
  projectId,
  expenseId,
}: AdminExpenseDetailProps) => {
  const router = useRouter();

  const {
    data: expenseData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["expense", expenseId],
    queryFn: async () => {
      const result = await api.admin.expenses.getById(expenseId);
      return result;
    },
    enabled: !!expenseId,
  });

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <Button
          variant="ghost"
          onClick={() => {
            if (projectId) {
              router.push(`/admin/projects/${projectId}`);
            } else {
              router.push("/admin/projects");
            }
          }}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au projet
        </Button>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (isError || !expenseData) {
    return (
      <div className="w-full space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/projects")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux projets
        </Button>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-destructive mb-4">
            {error instanceof Error
              ? error.message
              : "Erreur lors du chargement de la dépense"}
          </p>
          <Button
            variant="outline"
            onClick={() => router.push("/admin/projects")}
          >
            Retour aux projets
          </Button>
        </div>
      </div>
    );
  }

  const expense: Expense = expenseData.expense;

  return (
    <div className="w-full space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.push(`/admin/projects/${expense.project_id}`)}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour au projet
      </Button>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{expense.description}</CardTitle>
              {expense.category && (
                <Badge variant="outline" className="mt-2">
                  {categoryMap[expense.category] || expense.category}
                </Badge>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Montant</p>
              <p className="text-2xl font-bold text-primary">
                {formatAmount(expense.amount)}
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{formatDate(expense.date)}</p>
                </div>
              </div>
              {expense.category && (
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Catégorie</p>
                    <p className="font-medium">
                      {categoryMap[expense.category] || expense.category}
                    </p>
                  </div>
                </div>
              )}
              {expense.supplier && (
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Fournisseur</p>
                    <p className="font-medium">{expense.supplier}</p>
                  </div>
                </div>
              )}
              {expense.invoice_number && (
                <div className="flex items-center gap-3">
                  <Receipt className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Numéro de facture
                    </p>
                    <p className="font-medium">{expense.invoice_number}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Créé le</p>
                  <p className="font-medium">
                    {formatDate(expense.created_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Modifié le</p>
                  <p className="font-medium">
                    {formatDate(expense.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                ID de la dépense
              </p>
              <p className="text-sm font-mono">{expense.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">ID du projet</p>
              <p className="text-sm font-mono">{expense.project_id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Montant</p>
              <p className="text-2xl font-bold text-primary">
                {formatAmount(expense.amount)}
              </p>
            </div>
            {expense.category && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Catégorie</p>
                <Badge variant="outline">
                  {categoryMap[expense.category] || expense.category}
                </Badge>
              </div>
            )}
            {expense.supplier && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Fournisseur
                </p>
                <p className="text-sm font-medium">{expense.supplier}</p>
              </div>
            )}
            {expense.invoice_number && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Numéro de facture
                </p>
                <p className="text-sm font-medium">{expense.invoice_number}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
