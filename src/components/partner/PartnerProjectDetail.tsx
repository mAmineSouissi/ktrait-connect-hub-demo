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
  Upload,
  CheckSquare,
  Image,
} from "lucide-react";
import { useRouter } from "next/router";

const projectData = {
  id: 1,
  name: "Villa Moderne Dupont",
  client: "Jean Dupont",
  status: "En cours",
  progress: 65,
  role: "Architecte principal",
  startDate: "15/01/2024",
  deadline: "15/04/2024",
  location: "123 Rue des Oliviers, 13100 Aix-en-Provence",
  description:
    "Construction d'une villa moderne de 200m² avec piscine et garage double.",
  tasks: [
    {
      id: 1,
      name: "Finaliser plans détaillés étage",
      status: "En cours",
      deadline: "05/04/2024",
      priority: "Haute",
    },
    {
      id: 2,
      name: "Validation plans structure",
      status: "En attente",
      deadline: "10/04/2024",
      priority: "Normale",
    },
    {
      id: 3,
      name: "Rapport d'avancement mensuel",
      status: "À faire",
      deadline: "01/04/2024",
      priority: "Haute",
    },
  ],
  documents: [
    {
      id: 1,
      name: "Plans RDC v3",
      type: "DWG",
      date: "20/03/2024",
      status: "Validé",
    },
    {
      id: 2,
      name: "Plans Étage v2",
      type: "DWG",
      date: "25/03/2024",
      status: "En révision",
    },
    {
      id: 3,
      name: "Détails menuiseries",
      type: "PDF",
      date: "22/03/2024",
      status: "Validé",
    },
    {
      id: 4,
      name: "Rapport technique",
      type: "PDF",
      date: "15/03/2024",
      status: "Validé",
    },
  ],
  deliverables: [
    {
      id: 1,
      name: "Plans architecturaux complets",
      deadline: "01/02/2024",
      status: "Livré",
    },
    {
      id: 2,
      name: "Plans d'exécution RDC",
      deadline: "15/03/2024",
      status: "Livré",
    },
    {
      id: 3,
      name: "Plans d'exécution Étage",
      deadline: "15/04/2024",
      status: "En cours",
    },
    {
      id: 4,
      name: "Dossier finitions",
      deadline: "01/06/2024",
      status: "À venir",
    },
  ],
};

interface PartnerProjectDetailProps {
  id: string;
}

export const PartnerProjectDetail = ({ id }: PartnerProjectDetailProps) => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex w-full bg-background">
      <main className="flex-1 flex flex-col">
        <div className="flex-1 p-6 space-y-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/partner/projects")}
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
                <Badge variant="outline" className="text-base">
                  {projectData.role}
                </Badge>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Client</p>
                      <p className="font-medium">{projectData.client}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Localisation
                      </p>
                      <p className="font-medium">{projectData.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Deadline</p>
                      <p className="font-medium">{projectData.deadline}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Avancement</span>
                    <span className="font-medium">{projectData.progress}%</span>
                  </div>
                  <Progress value={projectData.progress} className="h-3" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tâches en cours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {projectData.tasks.map((task) => (
                  <div key={task.id} className="p-3 rounded-lg border">
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-medium text-sm">{task.name}</p>
                      <Badge
                        variant={
                          task.priority === "Haute" ? "destructive" : "outline"
                        }
                        className="text-xs"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{task.deadline}</span>
                      <Badge
                        variant={
                          task.status === "En cours" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/partner/tasks")}
                >
                  Voir toutes les tâches
                </Button>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="documents" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="deliverables">Livrables</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>

            <TabsContent value="documents">
              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Statut</TableHead>
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
                            <Badge
                              variant={
                                doc.status === "Validé"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {doc.status}
                            </Badge>
                          </TableCell>
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

            <TabsContent value="deliverables">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {projectData.deliverables.map((deliverable) => (
                      <div
                        key={deliverable.id}
                        className="flex items-center justify-between p-4 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          <CheckSquare
                            className={`h-5 w-5 ${
                              deliverable.status === "Livré"
                                ? "text-kpi-success"
                                : "text-muted-foreground"
                            }`}
                          />
                          <div>
                            <p className="font-medium">{deliverable.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Deadline: {deliverable.deadline}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            deliverable.status === "Livré"
                              ? "default"
                              : deliverable.status === "En cours"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {deliverable.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upload">
              <Card>
                <CardContent className="pt-6">
                  <div className="border-2 border-dashed rounded-lg p-12 text-center">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Déposer vos fichiers
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Glissez vos fichiers ici ou cliquez pour parcourir
                    </p>
                    <Button>Parcourir les fichiers</Button>
                    <p className="text-xs text-muted-foreground mt-4">
                      Formats acceptés: PDF, DWG, DXF, JPG, PNG (max 50MB)
                    </p>
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
