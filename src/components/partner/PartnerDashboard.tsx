import { KPICard } from "@/components/dashboard/KPICard";
import {
  FolderKanban,
  CheckSquare,
  Clock,
  AlertCircle,
  Eye,
  FileText,
  MessageSquare,
  Settings,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { toast } from "sonner";
import { useRouter } from "next/router";

const PartnerDashboard = () => {
  const router = useRouter();

  const tasks = [
    {
      id: 1,
      task: "Plans architecturaux - Villa Dakar",
      deadline: "2 jours",
      priority: "high",
    },
    {
      id: 2,
      task: "Validation technique - Immeuble R+5",
      deadline: "5 jours",
      priority: "medium",
    },
    {
      id: 3,
      task: "Relevé de mesures - Centre Commercial",
      deadline: "1 semaine",
      priority: "low",
    },
  ];

  const projects = [
    {
      id: 1,
      name: "Villa Moderne - Dakar",
      role: "Architecte principal",
      status: "En cours",
    },
    {
      id: 2,
      name: "Immeuble R+5 - Plateau",
      role: "Plans techniques",
      status: "En attente",
    },
    {
      id: 3,
      name: "Centre Commercial",
      role: "Études structurelles",
      status: "Validé",
    },
  ];

  const documents = [
    { id: 1, name: "Plans d'exécution - Villa Dakar", status: "pending" },
    { id: 2, name: "Note de calcul - Structure R+5", status: "pending" },
    { id: 3, name: "Devis fournisseur - Matériaux", status: "pending" },
  ];

  const handleValidateDocument = (docName: string) => {
    toast.success(`Document "${docName}" validé avec succès`);
  };

  const handleDownloadDocument = (docName: string) => {
    toast.info(`Téléchargement de "${docName}" en cours...`);
  };

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-1">
        <main className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard Partenaire</h1>
            <p className="text-muted-foreground">
              Gérez vos projets et tâches assignées
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div
              onClick={() => router.push("/partner/projects")}
              className="cursor-pointer"
            >
              <KPICard
                title="Projets Assignés"
                value="8"
                icon={FolderKanban}
                variant="info"
              />
            </div>
            <div
              onClick={() => router.push("/partner/tasks")}
              className="cursor-pointer"
            >
              <KPICard
                title="Tâches en Cours"
                value="15"
                icon={Clock}
                variant="warning"
              />
            </div>
            <KPICard
              title="Tâches Terminées"
              value="42"
              icon={CheckSquare}
              variant="success"
            />
            <div
              onClick={() => router.push("/partner/tasks")}
              className="cursor-pointer"
            >
              <KPICard
                title="Urgentes"
                value="3"
                icon={AlertCircle}
                variant="default"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Mes Tâches</CardTitle>
                    <CardDescription>
                      Tâches assignées et deadlines
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {tasks.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => router.push("/partner/tasks")}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.task}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Dans {item.deadline}
                      </p>
                    </div>
                    <Badge
                      variant={
                        item.priority === "high"
                          ? "destructive"
                          : item.priority === "medium"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {item.priority === "high"
                        ? "Urgent"
                        : item.priority === "medium"
                        ? "Moyen"
                        : "Normal"}
                    </Badge>
                  </div>
                ))}
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => router.push("/partner/tasks")}
                >
                  Voir toutes les tâches
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Projets Récents</CardTitle>
                    <CardDescription>Derniers projets assignés</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/partner/projects")}
                  >
                    Voir tout
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors cursor-pointer"
                    onClick={() =>
                      router.push(`/partner/projects/${project.id}`)
                    }
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm">{project.name}</p>
                      <Badge variant="outline">{project.status}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {project.role}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/partner/projects/${project.id}`);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Documents à Valider</CardTitle>
                  <CardDescription>
                    Livrables en attente de votre validation
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/partner/documents")}
                >
                  Tous les documents
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <p className="text-sm font-medium">{doc.name}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadDocument(doc.name)}
                      >
                        Télécharger
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleValidateDocument(doc.name)}
                      >
                        Valider
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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
                  onClick={() => router.push("/partner/projects")}
                >
                  <FolderKanban className="h-6 w-6 mb-2" />
                  Mes Projets
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col"
                  onClick={() => router.push("/partner/documents")}
                >
                  <FileText className="h-6 w-6 mb-2" />
                  Documents
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col"
                  onClick={() => router.push("/partner/messages")}
                >
                  <MessageSquare className="h-6 w-6 mb-2" />
                  Messages
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col"
                  onClick={() => router.push("/partner/settings")}
                >
                  <Settings className="h-6 w-6 mb-2" />
                  Mon Profil
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default PartnerDashboard;
