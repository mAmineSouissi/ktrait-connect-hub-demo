import { KPICard } from "@/components/dashboard/KPICard";
import {
  FolderKanban,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  FileText,
  MessageSquare,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/router";

const ClientDashboard = () => {
  const router = useRouter();

  const projects = [
    {
      id: 1,
      name: "Villa Moderne - Dakar",
      progress: 65,
      status: "Fondations terminées",
      phase: "Gros œuvre",
    },
    {
      id: 2,
      name: "Rénovation Appartement",
      progress: 40,
      status: "Plans validés",
      phase: "Préparation",
    },
  ];

  const documents = [
    {
      id: 1,
      name: "Plan architecture - Villa",
      type: "PDF",
      date: "Il y a 2h",
    },
    {
      id: 2,
      name: "Photos chantier - Semaine 12",
      type: "Images",
      date: "Il y a 1 jour",
    },
    { id: 3, name: "Facture #2024-045", type: "PDF", date: "Il y a 3 jours" },
  ];

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-1">
        <main className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Bienvenue dans votre Espace
            </h1>
            <p className="text-muted-foreground">
              Suivez l'avancement de vos projets en temps réel
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div
              onClick={() => router.push("/client/projects")}
              className="cursor-pointer"
            >
              <KPICard
                title="Mes Projets"
                value="3"
                icon={FolderKanban}
                variant="info"
              />
            </div>
            <div
              onClick={() => router.push("/client/projects")}
              className="cursor-pointer"
            >
              <KPICard
                title="En Cours"
                value="2"
                icon={Clock}
                variant="warning"
              />
            </div>
            <KPICard
              title="Terminés"
              value="1"
              icon={CheckCircle}
              variant="success"
            />
            <div
              onClick={() => router.push("/client/invoices")}
              className="cursor-pointer"
            >
              <KPICard
                title="Actions Requises"
                value="1"
                icon={AlertCircle}
                variant="default"
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Mes Projets en Cours</CardTitle>
                  <CardDescription>
                    Suivi de l'avancement de vos chantiers
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => router.push("/client/projects")}
                >
                  Voir tous mes projets
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="space-y-3 p-4 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/client/projects/${project.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-base">{project.name}</p>
                      <Badge variant="outline" className="mt-1">
                        {project.phase}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-primary">
                        {project.progress}%
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/client/projects/${project.id}`);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {project.status}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Actions Requises</CardTitle>
                    <CardDescription>
                      Documents ou validations en attente
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border border-warning/20 bg-warning/5">
                    <p className="font-medium text-sm">
                      Validation du devis #2024-089
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      En attente depuis 2 jours
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        onClick={() => router.push("/client/invoices")}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Voir le devis
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push("/client/support")}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Contacter
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Derniers Documents</CardTitle>
                    <CardDescription>
                      Récemment ajoutés à vos projets
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/client/documents")}
                  >
                    Voir tout
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors cursor-pointer"
                      onClick={() => router.push("/client/documents")}
                    >
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.date}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push("/client/documents");
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col"
                  onClick={() => router.push("/client/projects")}
                >
                  <FolderKanban className="h-6 w-6 mb-2" />
                  Mes Projets
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col"
                  onClick={() => router.push("/client/documents")}
                >
                  <FileText className="h-6 w-6 mb-2" />
                  Documents
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col"
                  onClick={() => router.push("/client/invoices")}
                >
                  <AlertCircle className="h-6 w-6 mb-2" />
                  Facturation
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col"
                  onClick={() => router.push("/client/support")}
                >
                  <MessageSquare className="h-6 w-6 mb-2" />
                  Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;
