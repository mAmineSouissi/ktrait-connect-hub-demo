"use client";

import React from "react";
import { useRouter } from "next/router";
import { api } from "@/api";
import { useDebounce } from "@/hooks/useDebounce";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/shared/data-tables/data-table";
import { DataTableConfig } from "@/components/shared/data-tables/types";
import { useInvoiceColumns } from "./columns/useInvoiceColumns";
import { useInvoiceCreateSheet } from "./modals/InvoiceCreateSheet";
import { useInvoiceUpdateSheet } from "./modals/InvoiceUpdateSheet";
import { useInvoiceDeleteDialog } from "./modals/useInvoiceDeleteDialog";
import { useInvoiceStore } from "@/hooks/stores/useInvoiceStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Invoice } from "@/types/invoice.types";
import type {
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
} from "@/types/invoice.types";

interface AdminInvoicesProps {
  className?: string;
}

export default function AdminInvoices({ className }: AdminInvoicesProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const invoiceStore = useInvoiceStore();
  const [activeTab, setActiveTab] = React.useState<"devis" | "factures">(
    "devis"
  );

  const [page, setPage] = React.useState(1);
  const { value: debouncedPage } = useDebounce<number>(page, 500);

  const [size, setSize] = React.useState(10);
  const { value: debouncedSize } = useDebounce<number>(size, 500);

  const [sortDetails, setSortDetails] = React.useState({
    order: true, // true = desc, false = asc
    sortKey: "created_at",
  });
  const { value: debouncedSortDetails } = useDebounce<typeof sortDetails>(
    sortDetails,
    500
  );

  const [searchTerm, setSearchTerm] = React.useState("");
  const { value: debouncedSearchTerm } = useDebounce<string>(searchTerm, 500);

  const offset = (debouncedPage - 1) * debouncedSize;

  // Fetch invoices
  const {
    data: invoicesResponse,
    isFetching: isInvoicesPending,
    refetch: refetchInvoices,
  } = useQuery({
    queryKey: [
      "invoices",
      activeTab,
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      api.admin.invoices.list({
        type: activeTab === "devis" ? "devis" : "facture",
        search: debouncedSearchTerm || undefined,
        limit: debouncedSize,
        offset,
        sortKey: debouncedSortDetails.sortKey,
        order: debouncedSortDetails.order ? "desc" : "asc",
      }),
  });

  const invoices = React.useMemo(() => {
    if (!invoicesResponse) return [];
    return invoicesResponse.invoices;
  }, [invoicesResponse]);

  const totalPageCount = React.useMemo(() => {
    if (!invoicesResponse) return 0;
    return Math.ceil((invoicesResponse.total || 0) / debouncedSize);
  }, [invoicesResponse, debouncedSize]);

  // Fetch clients and projects for forms
  const { data: clientsResponse } = useQuery({
    queryKey: ["clients", "for-invoices"],
    queryFn: () => api.admin.clients.list({ limit: 1000 }),
  });

  const { data: projectsResponse } = useQuery({
    queryKey: ["projects", "for-invoices"],
    queryFn: () => api.admin.projects.list({ limit: 1000 }),
  });

  // Fetch templates
  const { data: templatesResponse } = useQuery({
    queryKey: ["invoice-templates", activeTab],
    queryFn: () =>
      api.admin.invoiceTemplates.list({
        type: activeTab === "devis" ? "devis" : "facture",
        is_active: true,
      }),
  });

  const clients = React.useMemo(() => {
    return clientsResponse?.clients || [];
  }, [clientsResponse]);

  const projects = React.useMemo(() => {
    return projectsResponse?.projects || [];
  }, [projectsResponse]);

  const templates = React.useMemo(() => {
    return templatesResponse?.templates || [];
  }, [templatesResponse]);

  // Create invoice mutation
  const { mutate: createInvoice, isPending: isCreationPending } = useMutation({
    mutationFn: (data: CreateInvoiceRequest) => api.admin.invoices.create(data),
    onSuccess: () => {
      toast.success("Facture créée avec succès");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      invoiceStore.reset();
      closeCreateInvoiceSheet();
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de la création de la facture");
    },
  });

  // Update invoice mutation
  const { mutate: updateInvoice, isPending: isUpdatePending } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInvoiceRequest }) =>
      api.admin.invoices.update({ id, data }),
    onSuccess: () => {
      toast.success("Facture mise à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      invoiceStore.reset();
      closeUpdateInvoiceSheet();
    },
    onError: (error: any) => {
      toast.error(
        error.message || "Erreur lors de la mise à jour de la facture"
      );
    },
  });

  // Delete invoice mutation
  const { mutate: deleteInvoice, isPending: isDeletionPending } = useMutation({
    mutationFn: (id: string) => api.admin.invoices.delete(id, true),
    onSuccess: () => {
      toast.success("Facture supprimée définitivement avec succès");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      closeDeleteInvoiceDialog();
    },
    onError: (error: any) => {
      toast.error(
        error.message || "Erreur lors de la suppression de la facture"
      );
    },
  });

  // Calculate totals for KPI cards
  const totals = React.useMemo(() => {
    const allInvoices = invoicesResponse?.invoices || [];
    const devisTotal = allInvoices
      .filter((i) => i.type === "devis")
      .reduce((sum, i) => sum + i.total_amount, 0);
    const facturesPaid = allInvoices
      .filter((i) => i.type === "facture" && i.status === "paid")
      .reduce((sum, i) => sum + i.total_amount, 0);
    const facturesPending = allInvoices
      .filter((i) => i.type === "facture" && i.status === "sent")
      .reduce((sum, i) => sum + i.total_amount, 0);
    const facturesOverdue = allInvoices
      .filter((i) => i.type === "facture" && i.status === "overdue")
      .reduce((sum, i) => sum + i.total_amount, 0);

    return {
      devisTotal,
      facturesPaid,
      facturesPending,
      facturesOverdue,
    };
  }, [invoicesResponse]);

  const handleCreateSubmit = (data: CreateInvoiceRequest) => {
    createInvoice(data);
  };

  const handleUpdateSubmit = (data: UpdateInvoiceRequest) => {
    const invoice = invoiceStore.response;
    if (!invoice) {
      toast.error("Aucune facture sélectionnée");
      return;
    }

    updateInvoice({ id: invoice.id, data });
  };

  const handleOpenEdit = async (invoice: Invoice) => {
    try {
      const { invoice: invoiceDetail } = await api.admin.invoices.getById(
        invoice.id
      );
      invoiceStore.set("response", invoiceDetail);
      invoiceStore.initializeUpdateDto(invoiceDetail);
      openUpdateInvoiceSheet();
    } catch (error: any) {
      console.error("Error fetching invoice details:", error);
      toast.error("Erreur lors du chargement des détails de la facture");
    }
  };

  const handleDelete = (invoice: Invoice) => {
    invoiceStore.set("response", invoice as any);
    openDeleteInvoiceDialog();
  };

  const {
    createInvoiceSheet,
    openCreateInvoiceSheet,
    closeCreateInvoiceSheet,
  } = useInvoiceCreateSheet({
    createInvoice: (data) => {
      handleCreateSubmit(data);
    },
    isCreatePending: isCreationPending,
    resetInvoice: () => invoiceStore.reset(),
    clients,
    projects,
    templates,
    defaultType: activeTab === "devis" ? "devis" : "facture",
  });

  const {
    updateInvoiceSheet,
    openUpdateInvoiceSheet,
    closeUpdateInvoiceSheet,
  } = useInvoiceUpdateSheet({
    updateInvoice: (data) => {
      handleUpdateSubmit(data);
    },
    isUpdatePending: isUpdatePending,
    resetInvoice: () => invoiceStore.reset(),
    invoice: invoiceStore.response,
    clients,
    projects,
    templates,
  });

  const {
    deleteInvoiceDialog,
    openDeleteInvoiceDialog,
    closeDeleteInvoiceDialog,
  } = useInvoiceDeleteDialog({
    deleteInvoice: (id: string) => deleteInvoice(id),
    isDeleting: isDeletionPending,
    invoice: invoiceStore.response as any,
  });

  // Data table context
  const context: DataTableConfig<Invoice> = {
    singularName: activeTab === "devis" ? "devis" : "facture",
    pluralName: activeTab === "devis" ? "devis" : "factures",
    page: debouncedPage,
    size: debouncedSize,
    totalPageCount,
    setPage,
    setSize,
    order: debouncedSortDetails.order,
    sortKey: debouncedSortDetails.sortKey,
    setSortDetails: (order, sortKey) => setSortDetails({ order, sortKey }),
    searchTerm: debouncedSearchTerm,
    setSearchTerm,
    targetEntity: (entity) => {
      invoiceStore.set("response", entity as any);
    },
    inspectCallback: (entity) => {
      router.push(`/admin/invoices/${entity.id}`);
    },
    updateCallback: handleOpenEdit,
    deleteCallback: handleDelete,
  };

  const columns = useInvoiceColumns(context);

  return (
    <div className={cn("space-y-6", className)}>
      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                  maximumFractionDigits: 0,
                }).format(totals.devisTotal)}
              </p>
              <p className="text-sm text-muted-foreground">Total Devis</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-kpi-success">
                {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                  maximumFractionDigits: 0,
                }).format(totals.facturesPaid)}
              </p>
              <p className="text-sm text-muted-foreground">Factures Payées</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-kpi-warning">
                {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                  maximumFractionDigits: 0,
                }).format(totals.facturesPending)}
              </p>
              <p className="text-sm text-muted-foreground">En attente</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-kpi-danger">
                {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                  maximumFractionDigits: 0,
                }).format(totals.facturesOverdue)}
              </p>
              <p className="text-sm text-muted-foreground">En retard</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "devis" | "factures")}
        className="w-full"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <TabsList>
            <TabsTrigger value="devis">Devis</TabsTrigger>
            <TabsTrigger value="factures">Factures</TabsTrigger>
          </TabsList>

          <Button onClick={openCreateInvoiceSheet}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau {activeTab === "devis" ? "devis" : "facture"}
          </Button>
        </div>

        <TabsContent value={activeTab}>
          <DataTable<Invoice, unknown>
            data={invoices}
            columns={columns}
            context={context}
            isPending={isInvoicesPending}
            footerPagination={true}
          />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {createInvoiceSheet}
      {updateInvoiceSheet}
      {deleteInvoiceDialog}
    </div>
  );
}
