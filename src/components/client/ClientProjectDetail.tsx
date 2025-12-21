import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  FileText,
  CreditCard,
  Image,
} from "lucide-react";
import { useRouter } from "next/navigation";

const projectData = {
  id: 1,
  name: "Villa Moderne",
  status: "En cours",
  progress: 65,
  budget: "450 000 €",
  spent: "292 500 €",
  startDate: "15/01/2024",
  endDate: "15/12/2024",
  location: "123 Rue des Oliviers, 13100 Aix-en-Provence",
  partner: "Cabinet Martin Architecture",
  description:
    "Construction d'une villa moderne de 200m² avec piscine et garage double.",
  phases: [
    { id: 1, name: "Études & Plans", progress: 100, status: "Terminé" },
    { id: 2, name: "Fondations", progress: 100, status: "Terminé" },
    { id: 3, name: "Gros œuvre", progress: 80, status: "En cours" },
    { id: 4, name: "Second œuvre", progress: 20, status: "En cours" },
    { id: 5, name: "Finitions", progress: 0, status: "À venir" },
  ],
  documents: [
    { id: 1, name: "Contrat signé", type: "PDF", date: "15/01/2024" },
    { id: 2, name: "Plans architecturaux", type: "PDF", date: "20/01/2024" },
    { id: 3, name: "Permis de construire", type: "PDF", date: "10/01/2024" },
    { id: 4, name: "Planning chantier", type: "PDF", date: "25/01/2024" },
  ],
  payments: [
    {
      id: 1,
      date: "15/02/2024",
      description: "Acompte initial",
      amount: "45 000 €",
      status: "Payé",
    },
    {
      id: 2,
      date: "15/03/2024",
      description: "Phase fondations",
      amount: "90 000 €",
      status: "Payé",
    },
    {
      id: 3,
      date: "15/04/2024",
      description: "Phase structure",
      amount: "90 000 €",
      status: "En attente",
    },
  ],
  gallery: [
    { id: 1, title: "Fondations terminées", date: "15/02/2024" },
    { id: 2, title: "Élévation murs RDC", date: "15/03/2024" },
    { id: 3, title: "Dalle premier étage", date: "28/03/2024" },
  ],
};
interface ClientProjectDetailProps {
  id: string;
}

export const ClientProjectDetail = ({ id }: ClientProjectDetailProps) => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex w-full bg-background">
      <main className="flex-1 flex flex-col">
          <div className="flex-1 p-6 space-y-6">
            <Button
              variant="ghost"
              onClick={() => router.push("/client/projects")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux projets
            </Button>

            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">
                        {projectData.name}
                      </CardTitle>
                      <p className="text-muted-foreground mt-1">
                        {projectData.description}
                      </p>
                    </div>
                    <Badge>{projectData.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Adresse</p>
                        <p className="font-medium">{projectData.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Période</p>
                        <p className="font-medium">
                          {projectData.startDate} - {projectData.endDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Architecte
                        </p>
                        <p className="font-medium">{projectData.partner}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Avancement global</span>
                      <span className="font-medium">
                        {projectData.progress}%
                      </span>
                    </div>
                    <Progress value={projectData.progress} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Budget</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">
                      {projectData.budget}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Budget total
                    </p>
                  </div>
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payé</span>
                      <span className="font-medium">{projectData.spent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Restant</span>
                      <span className="font-medium text-kpi-success">
                        157 500 €
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="phases" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="phases">Avancement</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="payments">Paiements</TabsTrigger>
                <TabsTrigger value="gallery">Galerie</TabsTrigger>
              </TabsList>

              <TabsContent value="phases">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {projectData.phases.map((phase) => (
                        <div
                          key={phase.id}
                          className="flex items-center gap-4 p-4 rounded-lg border"
                        >
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{phase.name}</span>
                              <Badge
                                variant={
                                  phase.status === "Terminé"
                                    ? "secondary"
                                    : phase.status === "En cours"
                                    ? "default"
                                    : "outline"
                                }
                              >
                                {phase.status}
                              </Badge>
                            </div>
                            <Progress value={phase.progress} className="h-2" />
                          </div>
                          <span className="text-sm font-medium w-12 text-right">
                            {phase.progress}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents">
                <Card>
                  <CardContent className="pt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Document</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projectData.documents.map((doc) => (
                          <TableRow key={doc.id}>
                            <TableCell className="font-medium flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              {doc.name}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{doc.type}</Badge>
                            </TableCell>
                            <TableCell>{doc.date}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                Télécharger
                              </Button>
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
                  <CardContent className="pt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Montant</TableHead>
                          <TableHead>Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projectData.payments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>{payment.date}</TableCell>
                            <TableCell className="font-medium flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-muted-foreground" />
                              {payment.description}
                            </TableCell>
                            <TableCell>{payment.amount}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  payment.status === "Payé"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {payment.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="gallery">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {projectData.gallery.map((item) => (
                        <div
                          key={item.id}
                          className="aspect-video rounded-lg bg-muted flex flex-col items-center justify-center border"
                        >
                          <Image className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.date}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
      </main>
    </div>
  );
};
