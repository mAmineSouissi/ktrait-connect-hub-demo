import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";  
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Eye,
  FileText,
  Send,
  CheckCircle,
  XCircle,
  Download,
} from "lucide-react";
import { useState } from "react";

const mockDevis = [
  {
    id: "DEV-2024-001",
    client: "Jean Dupont",
    project: "Villa Moderne",
    amount: "450 000 €",
    date: "15/01/2024",
    status: "Validé",
  },
  {
    id: "DEV-2024-002",
    client: "SCI Lyon Invest",
    project: "Immeuble Lyon",
    amount: "2 500 000 €",
    date: "01/02/2024",
    status: "En attente",
  },
  {
    id: "DEV-2024-003",
    client: "Entreprise ABC",
    project: "Rénovation Bureau",
    amount: "180 000 €",
    date: "15/02/2024",
    status: "En attente",
  },
  {
    id: "DEV-2024-004",
    client: "Marie Martin",
    project: "Extension Commerce",
    amount: "95 000 €",
    date: "01/09/2023",
    status: "Refusé",
  },
];

const mockFactures = [
  {
    id: "FAC-2024-001",
    client: "Jean Dupont",
    project: "Villa Moderne",
    amount: "45 000 €",
    date: "15/02/2024",
    status: "Payée",
    dueDate: "15/03/2024",
  },
  {
    id: "FAC-2024-002",
    client: "Jean Dupont",
    project: "Villa Moderne",
    amount: "90 000 €",
    date: "15/03/2024",
    status: "Payée",
    dueDate: "15/04/2024",
  },
  {
    id: "FAC-2024-003",
    client: "Jean Dupont",
    project: "Villa Moderne",
    amount: "90 000 €",
    date: "15/04/2024",
    status: "En attente",
    dueDate: "15/05/2024",
  },
  {
    id: "FAC-2024-004",
    client: "SCI Lyon Invest",
    project: "Immeuble Lyon",
    amount: "250 000 €",
    date: "01/03/2024",
    status: "En retard",
    dueDate: "01/04/2024",
  },
];

export default function AdminInvoices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDevisOpen, setIsAddDevisOpen] = useState(false);

  return (
    <div className="min-h-screen flex w-full bg-background">
      <main className="flex-1 flex flex-col">

        <div className="flex-1 p-6 space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">3 225 000 €</p>
                  <p className="text-sm text-muted-foreground">Total Devis</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-kpi-success">
                    475 000 €
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Factures Payées
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-kpi-warning">
                    90 000 €
                  </p>
                  <p className="text-sm text-muted-foreground">En attente</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-kpi-danger">
                    250 000 €
                  </p>
                  <p className="text-sm text-muted-foreground">En retard</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="devis" className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <TabsList>
                <TabsTrigger value="devis">Devis</TabsTrigger>
                <TabsTrigger value="factures">Factures</TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <Dialog open={isAddDevisOpen} onOpenChange={setIsAddDevisOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nouveau devis
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Créer un devis</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label>Client</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un client" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Jean Dupont</SelectItem>
                            <SelectItem value="2">Marie Martin</SelectItem>
                            <SelectItem value="3">SCI Lyon Invest</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Projet</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un projet" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Villa Moderne</SelectItem>
                            <SelectItem value="2">Immeuble Lyon</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Montant HT</Label>
                        <Input placeholder="Ex: 100 000 €" />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input placeholder="Description du devis" />
                      </div>
                      <div className="flex justify-end gap-2 pt-4">
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => setIsAddDevisOpen(false)}
                        >
                          Annuler
                        </Button>
                        <Button type="submit">Créer le devis</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <TabsContent value="devis">
              <Card>
                <CardHeader>
                  <CardTitle>Liste des Devis</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>N° Devis</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Projet</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockDevis.map((devis) => (
                        <TableRow key={devis.id}>
                          <TableCell className="font-medium">
                            {devis.id}
                          </TableCell>
                          <TableCell>{devis.client}</TableCell>
                          <TableCell>{devis.project}</TableCell>
                          <TableCell>{devis.amount}</TableCell>
                          <TableCell>{devis.date}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                devis.status === "Validé"
                                  ? "default"
                                  : devis.status === "En attente"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {devis.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Send className="h-4 w-4" />
                              </Button>
                              {devis.status === "En attente" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-kpi-success"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              {devis.status === "Validé" && (
                                <Button variant="ghost" size="icon">
                                  <FileText className="h-4 w-4" />
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

            <TabsContent value="factures">
              <Card>
                <CardHeader>
                  <CardTitle>Liste des Factures</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>N° Facture</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Projet</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Échéance</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockFactures.map((facture) => (
                        <TableRow key={facture.id}>
                          <TableCell className="font-medium">
                            {facture.id}
                          </TableCell>
                          <TableCell>{facture.client}</TableCell>
                          <TableCell>{facture.project}</TableCell>
                          <TableCell>{facture.amount}</TableCell>
                          <TableCell>{facture.date}</TableCell>
                          <TableCell>{facture.dueDate}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                facture.status === "Payée"
                                  ? "default"
                                  : facture.status === "En attente"
                                  ? "secondary"
                                  : "destructive"
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
                              <Button variant="ghost" size="icon">
                                <Send className="h-4 w-4" />
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
          </Tabs>
        </div>
      </main>
    </div>
  );
}
