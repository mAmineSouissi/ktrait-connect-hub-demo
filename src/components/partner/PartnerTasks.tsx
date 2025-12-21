import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MessageSquare } from "lucide-react";
import { useState } from "react";

const allTasks = [
  {
    id: 1,
    name: "Finaliser plans détaillés étage",
    project: "Villa Moderne Dupont",
    status: "En cours",
    deadline: "05/04/2024",
    priority: "Haute",
    comments: 3,
  },
  {
    id: 2,
    name: "Validation plans structure",
    project: "Villa Moderne Dupont",
    status: "En attente",
    deadline: "10/04/2024",
    priority: "Normale",
    comments: 1,
  },
  {
    id: 3,
    name: "Rapport d'avancement mensuel",
    project: "Villa Moderne Dupont",
    status: "À faire",
    deadline: "01/04/2024",
    priority: "Haute",
    comments: 0,
  },
  {
    id: 4,
    name: "Plans préliminaires façade",
    project: "Immeuble Lyon",
    status: "En cours",
    deadline: "15/04/2024",
    priority: "Normale",
    comments: 2,
  },
  {
    id: 5,
    name: "Étude thermique",
    project: "Immeuble Lyon",
    status: "À faire",
    deadline: "20/04/2024",
    priority: "Haute",
    comments: 0,
  },
  {
    id: 6,
    name: "Révision plans parking",
    project: "Immeuble Lyon",
    status: "En attente",
    deadline: "25/04/2024",
    priority: "Basse",
    comments: 1,
  },
  {
    id: 7,
    name: "Dossier finitions intérieures",
    project: "Immeuble Lyon",
    status: "À faire",
    deadline: "01/05/2024",
    priority: "Normale",
    comments: 0,
  },
  {
    id: 8,
    name: "Contrôle qualité final",
    project: "Rénovation Bureau",
    status: "Terminé",
    deadline: "10/01/2024",
    priority: "Haute",
    comments: 5,
  },
];

export default function PartnerTasks() {
  const [selectedTab, setSelectedTab] = useState("all");

  const getFilteredTasks = () => {
    switch (selectedTab) {
      case "todo":
        return allTasks.filter((t) => t.status === "À faire");
      case "inprogress":
        return allTasks.filter((t) => t.status === "En cours");
      case "waiting":
        return allTasks.filter((t) => t.status === "En attente");
      case "done":
        return allTasks.filter((t) => t.status === "Terminé");
      default:
        return allTasks.filter((t) => t.status !== "Terminé");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Haute":
        return "destructive";
      case "Normale":
        return "default";
      case "Basse":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En cours":
        return "default";
      case "Terminé":
        return "secondary";
      case "En attente":
        return "outline";
      default:
        return "destructive";
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <main className="flex-1 flex flex-col">
        <div className="flex-1 p-6 space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-kpi-danger">3</p>
                  <p className="text-sm text-muted-foreground">À faire</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">2</p>
                  <p className="text-sm text-muted-foreground">En cours</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-kpi-warning">2</p>
                  <p className="text-sm text-muted-foreground">En attente</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-kpi-success">1</p>
                  <p className="text-sm text-muted-foreground">Terminé</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="all" onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="todo">À faire</TabsTrigger>
              <TabsTrigger value="inprogress">En cours</TabsTrigger>
              <TabsTrigger value="waiting">En attente</TabsTrigger>
              <TabsTrigger value="done">Terminées</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-6">
              <div className="space-y-4">
                {getFilteredTasks().map((task) => (
                  <Card key={task.id}>
                    <CardContent className="py-4">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          className="mt-1"
                          checked={task.status === "Terminé"}
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">{task.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {task.project}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                              <Badge variant={getStatusColor(task.status)}>
                                {task.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {task.deadline}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              {task.comments} commentaire(s)
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Voir
                          </Button>
                          {task.status !== "Terminé" && (
                            <Button size="sm">Terminer</Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
