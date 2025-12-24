"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { api } from "@/api";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard,
  Euro,
  Clock,
  CheckCircle,
} from "lucide-react";
import { formatAmount } from "@/lib/currency.util";
import { DataTable } from "@/components/shared/data-tables/data-table";
import { DataTableConfig } from "@/components/shared/data-tables/types";
import { useClientInvoiceColumns } from "./billing/columns/useClientInvoiceColumns";
import { useClientPaymentColumns } from "./billing/columns/useClientPaymentColumns";
import { useDebounce } from "@/hooks/useDebounce";
import type { Invoice } from "@/types/invoice.types";
import type { PaymentWithDetails } from "@/types/payment.types";

export const ClientBilling = () => {
  const router = useRouter();

  // State for factures tab
  const [facturesPage, setFacturesPage] = React.useState(1);
  const [facturesSize, setFacturesSize] = React.useState(10);
  const [facturesSearchTerm, setFacturesSearchTerm] = React.useState("");
  const [facturesSortDetails, setFacturesSortDetails] = React.useState<{
    order: boolean;
    sortKey: string;
  }>({
    order: true,
    sortKey: "created_at",
  });

  // State for devis tab
  const [devisPage, setDevisPage] = React.useState(1);
  const [devisSize, setDevisSize] = React.useState(10);
  const [devisSearchTerm, setDevisSearchTerm] = React.useState("");
  const [devisSortDetails, setDevisSortDetails] = React.useState<{
    order: boolean;
    sortKey: string;
  }>({
    order: true,
    sortKey: "created_at",
  });

  // State for payments tab
  const [paymentsPage, setPaymentsPage] = React.useState(1);
  const [paymentsSize, setPaymentsSize] = React.useState(10);
  const [paymentsSearchTerm, setPaymentsSearchTerm] = React.useState("");
  const [paymentsSortDetails, setPaymentsSortDetails] = React.useState<{
    order: boolean;
    sortKey: string;
  }>({
    order: true,
    sortKey: "date",
  });

  // Debounce values
  const { value: debouncedFacturesPage } = useDebounce(facturesPage, 300);
  const { value: debouncedFacturesSize } = useDebounce(facturesSize, 300);
  const { value: debouncedFacturesSearchTerm } = useDebounce(facturesSearchTerm, 500);
  const { value: debouncedFacturesSortDetails } = useDebounce(facturesSortDetails, 300);

  const { value: debouncedDevisPage } = useDebounce(devisPage, 300);
  const { value: debouncedDevisSize } = useDebounce(devisSize, 300);
  const { value: debouncedDevisSearchTerm } = useDebounce(devisSearchTerm, 500);
  const { value: debouncedDevisSortDetails } = useDebounce(devisSortDetails, 300);

  const { value: debouncedPaymentsPage } = useDebounce(paymentsPage, 300);
  const { value: debouncedPaymentsSize } = useDebounce(paymentsSize, 300);
  const { value: debouncedPaymentsSearchTerm } = useDebounce(paymentsSearchTerm, 500);
  const { value: debouncedPaymentsSortDetails } = useDebounce(paymentsSortDetails, 300);

  // Calculate offsets
  const facturesOffset = (debouncedFacturesPage - 1) * debouncedFacturesSize;
  const devisOffset = (debouncedDevisPage - 1) * debouncedDevisSize;
  const paymentsOffset = (debouncedPaymentsPage - 1) * debouncedPaymentsSize;

  // Fetch factures (invoices)
  const {
    data: facturesData,
    isFetching: isLoadingFactures,
  } = useQuery({
    queryKey: [
      "client-invoices",
      "facture",
      debouncedFacturesPage,
      debouncedFacturesSize,
      debouncedFacturesSortDetails.order,
      debouncedFacturesSortDetails.sortKey,
      debouncedFacturesSearchTerm,
    ],
    queryFn: () =>
      api.client.invoices.list({
        type: "facture",
        limit: debouncedFacturesSize,
        offset: facturesOffset,
        sortKey: debouncedFacturesSortDetails.sortKey,
        order: debouncedFacturesSortDetails.order ? "desc" : "asc",
        search: debouncedFacturesSearchTerm || undefined,
      }),
  });

  // Fetch devis (quotes)
  const {
    data: devisData,
    isFetching: isLoadingDevis,
  } = useQuery({
    queryKey: [
      "client-invoices",
      "devis",
      debouncedDevisPage,
      debouncedDevisSize,
      debouncedDevisSortDetails.order,
      debouncedDevisSortDetails.sortKey,
      debouncedDevisSearchTerm,
    ],
    queryFn: () =>
      api.client.invoices.list({
        type: "devis",
        limit: debouncedDevisSize,
        offset: devisOffset,
        sortKey: debouncedDevisSortDetails.sortKey,
        order: debouncedDevisSortDetails.order ? "desc" : "asc",
        search: debouncedDevisSearchTerm || undefined,
      }),
  });

  // Fetch payment history
  const {
    data: paymentsData,
    isFetching: isLoadingPayments,
  } = useQuery({
    queryKey: [
      "client-payments",
      debouncedPaymentsPage,
      debouncedPaymentsSize,
      debouncedPaymentsSortDetails.order,
      debouncedPaymentsSortDetails.sortKey,
      debouncedPaymentsSearchTerm,
    ],
    queryFn: () =>
      api.client.payments.list({
        limit: debouncedPaymentsSize,
        offset: paymentsOffset,
        sortKey: debouncedPaymentsSortDetails.sortKey,
        order: debouncedPaymentsSortDetails.order ? "desc" : "asc",
        search: debouncedPaymentsSearchTerm || undefined,
      }),
  });

  // Get data
  const factures = React.useMemo(() => {
    return facturesData?.invoices || [];
  }, [facturesData]);

  const devis = React.useMemo(() => {
    return devisData?.invoices || [];
  }, [devisData]);

  const payments = React.useMemo(() => {
    return paymentsData?.payments || [];
  }, [paymentsData]);

  // Calculate totals for summary cards (from all factures, not just current page)
  const { data: allFacturesData } = useQuery({
    queryKey: ["client-invoices", "facture", "all"],
    queryFn: () => api.client.invoices.list({ type: "facture", limit: 1000 }),
  });

  const allFactures = allFacturesData?.invoices || [];
  const totalFactures = allFactures.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
  const paidFactures = allFactures
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
  const pendingFactures = allFactures
    .filter((inv) => inv.status === "sent" || inv.status === "validated")
    .reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
  const remaining = totalFactures - paidFactures;

  // Calculate page counts
  const facturesTotalPageCount = React.useMemo(() => {
    if (!facturesData) return 0;
    return Math.ceil((facturesData.total || 0) / debouncedFacturesSize);
  }, [facturesData, debouncedFacturesSize]);

  const devisTotalPageCount = React.useMemo(() => {
    if (!devisData) return 0;
    return Math.ceil((devisData.total || 0) / debouncedDevisSize);
  }, [devisData, debouncedDevisSize]);

  const paymentsTotalPageCount = React.useMemo(() => {
    if (!paymentsData) return 0;
    return Math.ceil((paymentsData.total || 0) / debouncedPaymentsSize);
  }, [paymentsData, debouncedPaymentsSize]);

  // Data table contexts
  const facturesContext: DataTableConfig<Invoice> = {
    singularName: "facture",
    pluralName: "factures",
    page: debouncedFacturesPage,
    size: debouncedFacturesSize,
    totalPageCount: facturesTotalPageCount,
    setPage: setFacturesPage,
    setSize: setFacturesSize,
    order: debouncedFacturesSortDetails.order,
    sortKey: debouncedFacturesSortDetails.sortKey,
    setSortDetails: (order, sortKey) => setFacturesSortDetails({ order, sortKey }),
    searchTerm: debouncedFacturesSearchTerm,
    setSearchTerm: setFacturesSearchTerm,
    inspectCallback: (invoice) => {
      router.push(`/client/billing/${invoice.id}`);
    },
  };

  const devisContext: DataTableConfig<Invoice> = {
    singularName: "devis",
    pluralName: "devis",
    page: debouncedDevisPage,
    size: debouncedDevisSize,
    totalPageCount: devisTotalPageCount,
    setPage: setDevisPage,
    setSize: setDevisSize,
    order: debouncedDevisSortDetails.order,
    sortKey: debouncedDevisSortDetails.sortKey,
    setSortDetails: (order, sortKey) => setDevisSortDetails({ order, sortKey }),
    searchTerm: debouncedDevisSearchTerm,
    setSearchTerm: setDevisSearchTerm,
    inspectCallback: (invoice) => {
      router.push(`/client/billing/${invoice.id}`);
    },
  };

  const paymentsContext: DataTableConfig<PaymentWithDetails> = {
    singularName: "paiement",
    pluralName: "paiements",
    page: debouncedPaymentsPage,
    size: debouncedPaymentsSize,
    totalPageCount: paymentsTotalPageCount,
    setPage: setPaymentsPage,
    setSize: setPaymentsSize,
    order: debouncedPaymentsSortDetails.order,
    sortKey: debouncedPaymentsSortDetails.sortKey,
    setSortDetails: (order, sortKey) => setPaymentsSortDetails({ order, sortKey }),
    searchTerm: debouncedPaymentsSearchTerm,
    setSearchTerm: setPaymentsSearchTerm,
  };

  const facturesColumns = useClientInvoiceColumns(facturesContext);
  const devisColumns = useClientInvoiceColumns(devisContext);
  const paymentsColumns = useClientPaymentColumns(paymentsContext);

  return (
    <div className="min-h-screen flex w-full bg-background">
      <main className="flex-1 flex flex-col">
        <div className="flex-1 p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Euro className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {formatAmount(totalFactures)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total factures
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-kpi-success/10 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-kpi-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-kpi-success">
                      {formatAmount(paidFactures)}
                    </p>
                    <p className="text-sm text-muted-foreground">Payé</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-kpi-warning/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-kpi-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-kpi-warning">
                      {formatAmount(pendingFactures)}
                    </p>
                    <p className="text-sm text-muted-foreground">En attente</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {formatAmount(remaining)}
                    </p>
                    <p className="text-sm text-muted-foreground">Restant</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs with DataTables */}
          <Tabs defaultValue="factures" className="w-full">
            <TabsList>
              <TabsTrigger value="factures">Factures</TabsTrigger>
              <TabsTrigger value="devis">Devis</TabsTrigger>
              <TabsTrigger value="payments">Historique paiements</TabsTrigger>
            </TabsList>

            <TabsContent value="factures" className="space-y-4">
              <DataTable
                data={factures}
                columns={facturesColumns}
                context={facturesContext}
                isPending={isLoadingFactures}
              />
            </TabsContent>

            <TabsContent value="devis" className="space-y-4">
              <DataTable
                data={devis}
                columns={devisColumns}
                context={devisContext}
                isPending={isLoadingDevis}
              />
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              <DataTable
                data={payments}
                columns={paymentsColumns}
                context={paymentsContext}
                isPending={isLoadingPayments}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};
