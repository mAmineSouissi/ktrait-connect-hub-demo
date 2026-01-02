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
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { formatDate } from "@/lib/date.util";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

import { toast } from "sonner";
import { useRouter } from "next/router";

const PartnerDashboard = () => {
  const router = useRouter();

  // Fetch tasks
  const { data: tasksData, isLoading: tasksLoading } = useQuery({
    queryKey: ["partner-dashboard-tasks"],
    queryFn: () => api.partner.tasks.list({ limit: 10 }),
  });

  const allTasks = tasksData?.tasks || [];

  // Calculate statistics
  const stats = {
    total: allTasks.length,
    en_cours: allTasks.filter((t) => t.status === "en_cours").length,
    terminé: allTasks.filter((t) => t.status === "terminé").length,
    urgentes: allTasks.filter(
      (t) => t.priority === "urgente" && t.status !== "terminé"
    ).length,
  };

  // Get recent tasks (not completed, sorted by due_date)
  const recentTasks = allTasks
    .filter((t) => t.status !== "terminé")
    .sort((a, b) => {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    })
    .slice(0, 3);

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
                value={tasksLoading ? "..." : stats.en_cours.toString()}
                icon={Clock}
                variant="warning"
              />
            </div>
            <KPICard
              title="Tâches Terminées"
              value={tasksLoading ? "..." : stats.terminé.toString()}
              icon={CheckSquare}
              variant="success"
            />
            <div
              onClick={() => router.push("/partner/tasks")}
              className="cursor-pointer"
            >
              <KPICard
                title="Urgentes"
                value={tasksLoading ? "..." : stats.urgentes.toString()}
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
                {tasksLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : recentTasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Aucune tâche en cours
                  </p>
                ) : (
                  recentTasks.map((task) => {
                    const isOverdue =
                      task.due_date && new Date(task.due_date) < new Date();
                    const priorityVariant =
                      task.priority === "urgente"
                        ? "destructive"
                        : task.priority === "élevée"
                        ? "default"
                        : "secondary";

                    return (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors cursor-pointer"
                        onClick={() => {
                          if (task.project?.id) {
                            router.push(`/partner/projects/${task.project.id}`);
                          } else {
                            router.push("/partner/tasks");
                          }
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {task.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {task.due_date && (
                              <p
                                className={cn(
                                  "text-xs text-muted-foreground",
                                  isOverdue && "text-destructive font-medium"
                                )}
                              >
                                {isOverdue
                                  ? "En retard"
                                  : `Échéance: ${formatDate(task.due_date)}`}
                              </p>
                            )}
                            {task.project && (
                              <p className="text-xs text-muted-foreground truncate">
                                • {task.project.name}
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant={priorityVariant}
                          className="ml-2 shrink-0"
                        >
                          {task.priority === "urgente"
                            ? "Urgent"
                            : task.priority === "élevée"
                            ? "Élevée"
                            : task.priority === "moyenne"
                            ? "Moyenne"
                            : "Faible"}
                        </Badge>
                      </div>
                    );
                  })
                )}
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
