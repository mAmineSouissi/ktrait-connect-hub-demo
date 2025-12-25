"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { api } from "@/api";
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
  Download,
  FileText,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
} from "lucide-react";
import { formatAmount } from "@/lib/currency.util";
import { formatDate } from "@/lib/date.util";
import { INVOICE_STATUS_LABELS, INVOICE_TYPE_LABELS } from "@/types/enums";
import type { InvoiceWithDetails } from "@/types/invoice.types";

interface ClientInvoiceDetailProps {
  id: string;
}

const statusVariants: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  draft: "outline",
  sent: "secondary",
  validated: "default",
  rejected: "destructive",
  paid: "default",
  overdue: "destructive",
  cancelled: "outline",
};

export const ClientInvoiceDetail = ({ id }: ClientInvoiceDetailProps) => {
  const router = useRouter();

  // Fetch invoice details
  const {
    data: invoiceResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["client-invoice", id],
    queryFn: async () => {
      const result = await api.client.invoices.getById(id);
      return result.invoice;
    },
    enabled: !!id,
  });

  const invoice = invoiceResponse as InvoiceWithDetails | undefined;

  const handleDownload = () => {
    if (invoice?.generated_pdf_url) {
      window.open(invoice.generated_pdf_url, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !invoice) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <p className="text-destructive mb-4">
          {error instanceof Error
            ? error.message
            : "Erreur lors du chargement de la facture"}
        </p>
        <Button
          variant="outline"
          onClick={() => router.push("/client/invoices")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux factures
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-background">
      <main className="flex-1 flex flex-col">
        <div className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.push("/client/invoices")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div className="flex gap-2">
              {invoice.generated_pdf_url && (
                <Button onClick={handleDownload} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger PDF
                </Button>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Invoice Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">
                        {INVOICE_TYPE_LABELS[invoice.type] || invoice.type}
                      </CardTitle>
                      <p className="text-muted-foreground mt-1">
                        {invoice.invoice_number}
                      </p>
                    </div>
                    <Badge
                      variant={statusVariants[invoice.status] || "outline"}
                      className="text-sm"
                    >
                      {INVOICE_STATUS_LABELS[invoice.status] || invoice.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Invoice Items */}
                  <div>
                    <h3 className="font-semibold mb-4">Détails</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Quantité</TableHead>
                          <TableHead className="text-right">
                            Prix unitaire
                          </TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoice.items && invoice.items.length > 0 ? (
                          invoice.items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.description}</TableCell>
                              <TableCell className="text-right">
                                {item.quantity} {item.unit || ""}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatAmount(item.unit_price)}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {formatAmount(item.line_total)}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={4}
                              className="text-center text-muted-foreground"
                            >
                              Aucun élément
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Totals */}
                  <div className="flex justify-end">
                    <div className="w-full max-w-md space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Sous-total
                        </span>
                        <span className="font-medium">
                          {formatAmount(invoice.subtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          TVA ({invoice.tax_rate}%)
                        </span>
                        <span className="font-medium">
                          {formatAmount(invoice.tax_amount)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t text-lg font-bold">
                        <span>Total</span>
                        <span>{formatAmount(invoice.total_amount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes and Terms */}
                  {invoice.notes && (
                    <div>
                      <h4 className="font-semibold mb-2">Notes</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {invoice.notes}
                      </p>
                    </div>
                  )}

                  {invoice.terms && (
                    <div>
                      <h4 className="font-semibold mb-2">Conditions</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {invoice.terms}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Date d'émission</span>
                    </div>
                    <p className="font-medium">
                      {formatDate(invoice.issue_date)}
                    </p>
                  </div>

                  {invoice.due_date && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Date d'échéance</span>
                      </div>
                      <p className="font-medium">
                        {formatDate(invoice.due_date)}
                      </p>
                    </div>
                  )}

                  {invoice.project && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        <span>Projet</span>
                      </div>
                      <p className="font-medium">{invoice.project.name}</p>
                    </div>
                  )}

                  {invoice.reference && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>Référence</span>
                      </div>
                      <p className="font-medium">{invoice.reference}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {invoice.client && (
                <Card>
                  <CardHeader>
                    <CardTitle>Client</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="font-medium">{invoice.client.full_name}</p>
                      {invoice.client.company_name && (
                        <p className="text-sm text-muted-foreground">
                          {invoice.client.company_name}
                        </p>
                      )}
                    </div>

                    {invoice.client.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{invoice.client.email}</span>
                      </div>
                    )}

                    {invoice.client.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{invoice.client.phone}</span>
                      </div>
                    )}

                    {(invoice.client.address || invoice.client.city) && (
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          {invoice.client.address && (
                            <p>{invoice.client.address}</p>
                          )}
                          {invoice.client.city && (
                            <p>
                              {invoice.client.city}
                              {invoice.client.postal_code &&
                                ` ${invoice.client.postal_code}`}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
