import { SidebarProvider } from "@/components/ui/sidebar";
import { ClientSidebar } from "@/components/layout/ClientSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  Eye,
  CreditCard,
  Euro,
  Clock,
  CheckCircle,
} from "lucide-react";

const devis = [
  {
    id: "DEV-2024-001",
    project: "Villa Moderne",
    amount: "450 000 €",
    date: "15/01/2024",
    status: "Validé",
  },
  {
    id: "DEV-2024-003",
    project: "Rénovation Cuisine",
    amount: "25 000 €",
    date: "15/03/2024",
    status: "En attente",
  },
];

const factures = [
  {
    id: "FAC-2024-001",
    project: "Villa Moderne",
    description: "Acompte initial",
    amount: "45 000 €",
    date: "15/02/2024",
    dueDate: "15/03/2024",
    status: "Payée",
  },
  {
    id: "FAC-2024-002",
    project: "Villa Moderne",
    description: "Phase fondations",
    amount: "90 000 €",
    date: "15/03/2024",
    dueDate: "15/04/2024",
    status: "Payée",
  },
  {
    id: "FAC-2024-003",
    project: "Villa Moderne",
    description: "Phase structure",
    amount: "90 000 €",
    date: "15/04/2024",
    dueDate: "15/05/2024",
    status: "En attente",
  },
];

const payments = [
  {
    id: 1,
    date: "15/02/2024",
    facture: "FAC-2024-001",
    amount: "45 000 €",
    method: "Virement",
    status: "Confirmé",
  },
  {
    id: 2,
    date: "15/03/2024",
    facture: "FAC-2024-002",
    amount: "90 000 €",
    method: "Virement",
    status: "Confirmé",
  },
];

export const ClientBilling = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <ClientSidebar />
        <main className="flex-1 flex flex-col">
          <DashboardHeader title="Facturation" userName="Jean Dupont" />

          <div className="flex-1 p-6 space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Euro className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">510 000 €</p>
                      <p className="text-sm text-muted-foreground">
                        Total projets
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
                        135 000 €
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
                        90 000 €
                      </p>
                      <p className="text-sm text-muted-foreground">
                        En attente
                      </p>
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
                      <p className="text-2xl font-bold">285 000 €</p>
                      <p className="text-sm text-muted-foreground">Restant</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="factures" className="w-full">
              <TabsList>
                <TabsTrigger value="factures">Factures</TabsTrigger>
                <TabsTrigger value="devis">Devis</TabsTrigger>
                <TabsTrigger value="payments">Historique paiements</TabsTrigger>
              </TabsList>

              <TabsContent value="factures">
                <Card>
                  <CardHeader>
                    <CardTitle>Mes Factures</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>N° Facture</TableHead>
                          <TableHead>Projet</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Montant</TableHead>
                          <TableHead>Échéance</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {factures.map((facture) => (
                          <TableRow key={facture.id}>
                            <TableCell className="font-medium">
                              {facture.id}
                            </TableCell>
                            <TableCell>{facture.project}</TableCell>
                            <TableCell>{facture.description}</TableCell>
                            <TableCell>{facture.amount}</TableCell>
                            <TableCell>{facture.dueDate}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  facture.status === "Payée"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {facture.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="devis">
                <Card>
                  <CardHeader>
                    <CardTitle>Mes Devis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>N° Devis</TableHead>
                          <TableHead>Projet</TableHead>
                          <TableHead>Montant</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {devis.map((d) => (
                          <TableRow key={d.id}>
                            <TableCell className="font-medium">
                              {d.id}
                            </TableCell>
                            <TableCell>{d.project}</TableCell>
                            <TableCell>{d.amount}</TableCell>
                            <TableCell>{d.date}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  d.status === "Validé"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {d.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Download className="h-4 w-4" />
                                </Button>
                                {d.status === "En attente" && (
                                  <Button size="sm" className="ml-2">
                                    Valider
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payments">
                <Card>
                  <CardHeader>
                    <CardTitle>Historique des paiements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Facture</TableHead>
                          <TableHead>Montant</TableHead>
                          <TableHead>Méthode</TableHead>
                          <TableHead>Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>{payment.date}</TableCell>
                            <TableCell className="font-medium">
                              {payment.facture}
                            </TableCell>
                            <TableCell>{payment.amount}</TableCell>
                            <TableCell>{payment.method}</TableCell>
                            <TableCell>
                              <Badge variant="default">{payment.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
