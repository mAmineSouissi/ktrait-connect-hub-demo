import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Send,
  Download,
  FileText,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
} from "lucide-react";
import { INVOICE_STATUS_LABELS, INVOICE_TYPE_LABELS } from "@/types/enums";
import { useInvoiceUpdateSheet } from "./modals/InvoiceUpdateSheet";
import { useInvoiceDeleteDialog } from "./modals/useInvoiceDeleteDialog";
import { useInvoiceStore } from "@/hooks/stores/useInvoiceStore";
import type { UpdateInvoiceRequest } from "@/types/invoice.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AdminInvoiceDetailProps {
  id: string;
}

export const AdminInvoiceDetail = ({ id }: AdminInvoiceDetailProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const invoiceStore = useInvoiceStore();
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [previewContent, setPreviewContent] = React.useState<string>("");
  const [isLoadingPreview, setIsLoadingPreview] = React.useState(false);

  // Fetch invoice details
  const {
    data: invoiceResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["invoice", id],
    queryFn: async () => {
      const result = await api.admin.invoices.getById(id);
      return result.invoice;
    },
    enabled: !!id,
  });

  // Fetch clients and projects for update form
  const { data: clientsResponse } = useQuery({
    queryKey: ["clients", "for-invoice-update"],
    queryFn: () => api.admin.clients.list({ limit: 1000 }),
  });

  const { data: projectsResponse } = useQuery({
    queryKey: ["projects", "for-invoice-update"],
    queryFn: () => api.admin.projects.list({ limit: 1000 }),
  });

  // Fetch templates
  const { data: templatesResponse } = useQuery({
    queryKey: ["invoice-templates", invoiceResponse?.type],
    queryFn: () =>
      api.admin.invoiceTemplates.list({
        type: invoiceResponse?.type || "devis",
        is_active: true,
      }),
    enabled: !!invoiceResponse?.type,
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

  // Update invoice mutation
  const { mutate: updateInvoice, isPending: isUpdatePending } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInvoiceRequest }) =>
      api.admin.invoices.update({ id, data }),
    onSuccess: () => {
      toast.success("Facture mise à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["invoice", id] });
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
      router.push("/admin/invoices");
    },
    onError: (error: any) => {
      toast.error(
        error.message || "Erreur lors de la suppression de la facture"
      );
    },
  });

  // Status update mutation
  const { mutate: updateStatus, isPending: isStatusPending } = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: UpdateInvoiceRequest["status"];
    }) => api.admin.invoices.update({ id, data: { status } }),
    onSuccess: () => {
      toast.success("Statut mis à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["invoice", id] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de la mise à jour du statut");
    },
  });

  const handleUpdateSubmit = (data: UpdateInvoiceRequest) => {
    updateInvoice({ id, data });
  };

  const handleOpenEdit = () => {
    if (invoiceResponse) {
      invoiceStore.set("response", invoiceResponse);
      invoiceStore.initializeUpdateDto(invoiceResponse);
      openUpdateInvoiceSheet();
    }
  };

  const handleDelete = () => {
    if (invoiceResponse) {
      invoiceStore.set("response", invoiceResponse);
      openDeleteInvoiceDialog();
    }
  };

  const handleStatusChange = (status: UpdateInvoiceRequest["status"]) => {
    if (status) {
      updateStatus({ id, status });
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(
        `/api/admin/invoices/${id}/generate?format=html&preview=false`
      );
      if (!response.ok) {
        throw new Error("Erreur lors de la génération du document");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${invoiceResponse?.invoice_number || "invoice"}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Document téléchargé avec succès");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors du téléchargement");
    }
  };

  const handlePreview = async () => {
    setIsLoadingPreview(true);
    setIsPreviewOpen(true);
    try {
      const response = await fetch(
        `/api/admin/invoices/${id}/generate?format=html&preview=true`
      );
      if (!response.ok) {
        throw new Error("Erreur lors de la génération de l'aperçu");
      }
      const html = await response.text();
      setPreviewContent(html);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors du chargement de l'aperçu");
      setIsPreviewOpen(false);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const {
    updateInvoiceSheet,
    openUpdateInvoiceSheet,
    closeUpdateInvoiceSheet,
  } = useInvoiceUpdateSheet({
    updateInvoice: handleUpdateSubmit,
    isUpdatePending: isUpdatePending,
    resetInvoice: () => invoiceStore.reset(),
    invoice: invoiceResponse || null,
    clients,
    projects,
    templates,
  });

  const {
    deleteInvoiceDialog,
    openDeleteInvoiceDialog,
    closeDeleteInvoiceDialog,
  } = useInvoiceDeleteDialog({
    deleteInvoice: (invoiceId) => deleteInvoice(invoiceId),
    isDeleting: isDeletionPending,
    invoice: invoiceResponse || null,
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/invoices")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (isError || !invoiceResponse) {
    return (
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/invoices")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>
        <p className="mt-4 text-sm text-muted-foreground">
          {error?.message || "Facture introuvable."}
        </p>
      </div>
    );
  }

  const invoice = invoiceResponse;
  const statusLabel = INVOICE_STATUS_LABELS[invoice.status];
  const typeLabel = INVOICE_TYPE_LABELS[invoice.type];

  const getStatusIcon = () => {
    switch (invoice.status) {
      case "paid":
      case "validated":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
      case "cancelled":
      case "overdue":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusVariant = () => {
    switch (invoice.status) {
      case "paid":
      case "validated":
        return "default";
      case "rejected":
      case "cancelled":
      case "overdue":
        return "destructive";
      case "sent":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <div className="flex flex-1 flex-col">
        <div className="flex-1 space-y-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.push("/admin/invoices")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la liste
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleOpenEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
              <Button variant="outline">
                <Send className="h-4 w-4 mr-2" />
                Envoyer
              </Button>
              <Button variant="outline" onClick={handlePreview}>
                <Eye className="h-4 w-4 mr-2" />
                Aperçu
              </Button>
              <Button variant="outline" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </div>

          {/* Invoice Header Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl">
                      {invoice.invoice_number}
                    </CardTitle>
                    <Badge variant={getStatusVariant()}>
                      {getStatusIcon()}
                      <span className="ml-1">{statusLabel}</span>
                    </Badge>
                    <Badge variant="secondary">{typeLabel}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Créé le{" "}
                    {new Date(invoice.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    {new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    }).format(invoice.total_amount)}
                  </div>
                  <p className="text-sm text-muted-foreground">Total TTC</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Client & Project Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Client
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {invoice.client ? (
                      <div className="space-y-2">
                        <p className="font-semibold">
                          {invoice.client.full_name}
                        </p>
                        {invoice.client.company_name && (
                          <p className="text-sm text-muted-foreground">
                            {invoice.client.company_name}
                          </p>
                        )}
                        {invoice.client.email && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {invoice.client.email}
                          </div>
                        )}
                        {invoice.client.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {invoice.client.phone}
                          </div>
                        )}
                        {invoice.client.address && (
                          <div className="flex items-start gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 mt-0.5" />
                            <div>
                              {invoice.client.address}
                              {invoice.client.city && (
                                <>
                                  <br />
                                  {invoice.client.city}{" "}
                                  {invoice.client.postal_code}
                                </>
                              )}
                            </div>
                          </div>
                        )}
                        {invoice.client.tax_id && (
                          <p className="text-sm text-muted-foreground">
                            SIRET: {invoice.client.tax_id}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Aucun client associé
                      </p>
                    )}
                  </CardContent>
                </Card>

                {invoice.project && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Projet
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="font-semibold">{invoice.project.name}</p>
                        {invoice.project.address && (
                          <div className="flex items-start gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 mt-0.5" />
                            {invoice.project.address}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Invoice Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Articles</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-center">Quantité</TableHead>
                        <TableHead className="text-center">Unité</TableHead>
                        <TableHead className="text-right">
                          Prix unitaire
                        </TableHead>
                        <TableHead className="text-right">Total HT</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoice.items && invoice.items.length > 0 ? (
                        invoice.items.map((item, index) => (
                          <TableRow key={item.id || index}>
                            <TableCell className="font-medium">
                              {item.description}
                            </TableCell>
                            <TableCell className="text-center">
                              {item.quantity}
                            </TableCell>
                            <TableCell className="text-center">
                              {item.unit || "unité"}
                            </TableCell>
                            <TableCell className="text-right">
                              {new Intl.NumberFormat("fr-FR", {
                                style: "currency",
                                currency: "EUR",
                              }).format(item.unit_price)}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {new Intl.NumberFormat("fr-FR", {
                                style: "currency",
                                currency: "EUR",
                              }).format(item.quantity * item.unit_price)}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center text-muted-foreground"
                          >
                            Aucun article
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Notes, Terms, Reference */}
              {(invoice.notes || invoice.terms || invoice.reference) && (
                <div className="grid md:grid-cols-2 gap-6">
                  {invoice.notes && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Notes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm whitespace-pre-wrap">
                          {invoice.notes}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {invoice.terms && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Conditions de paiement
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm whitespace-pre-wrap">
                          {invoice.terms}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {invoice.reference && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Référence</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{invoice.reference}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Invoice Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Détails</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Date d'émission
                    </p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">
                        {new Date(invoice.issue_date).toLocaleDateString(
                          "fr-FR"
                        )}
                      </p>
                    </div>
                  </div>

                  {invoice.due_date && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Date d'échéance
                      </p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">
                          {new Date(invoice.due_date).toLocaleDateString(
                            "fr-FR"
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {invoice.template && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Modèle</p>
                      <p className="font-medium">{invoice.template.name}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Totals Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Récapitulatif</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Sous-total HT:
                    </span>
                    <span className="font-medium">
                      {new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      }).format(invoice.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      TVA ({invoice.tax_rate}%):
                    </span>
                    <span className="font-medium">
                      {new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      }).format(invoice.tax_amount)}
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold">
                    <span>Total TTC:</span>
                    <span className="text-primary">
                      {new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      }).format(invoice.total_amount)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Status Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {invoice.status === "draft" && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleStatusChange("sent")}
                      disabled={isStatusPending}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Marquer comme envoyé
                    </Button>
                  )}
                  {invoice.status === "sent" && (
                    <>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleStatusChange("validated")}
                        disabled={isStatusPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Valider
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleStatusChange("rejected")}
                        disabled={isStatusPending}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rejeter
                      </Button>
                    </>
                  )}
                  {invoice.status === "validated" && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleStatusChange("paid")}
                      disabled={isStatusPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marquer comme payé
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {updateInvoiceSheet}
      {deleteInvoiceDialog}

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Aperçu - {invoice.invoice_number}</DialogTitle>
          </DialogHeader>
          {isLoadingPreview ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="mt-4">
              <iframe
                srcDoc={previewContent}
                className="w-full h-[70vh] border rounded"
                title="Invoice Preview"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
