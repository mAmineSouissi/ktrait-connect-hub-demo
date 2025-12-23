import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Eye, Calendar, MapPin, Users, Upload } from "lucide-react";
import { useRouter } from "next/router";

const partnerProjects = [
  {
    id: 1,
    name: "Villa Moderne Dupont",
    client: "Jean Dupont",
    status: "En cours",
    progress: 65,
    role: "Architecte principal",
    startDate: "15/01/2024",
    deadline: "15/04/2024",
    location: "Aix-en-Provence",
    tasks: 3,
  },
  {
    id: 2,
    name: "Immeuble Résidentiel Lyon",
    client: "SCI Lyon Invest",
    status: "Planifié",
    progress: 10,
    role: "Architecte principal",
    startDate: "01/02/2024",
    deadline: "01/06/2024",
    location: "Lyon",
    tasks: 5,
  },
  {
    id: 3,
    name: "Rénovation Bureau Paris",
    client: "Entreprise ABC",
    status: "Terminé",
    progress: 100,
    role: "Consultant",
    startDate: "01/10/2023",
    deadline: "15/01/2024",
    location: "Paris",
    tasks: 0,
  },
];

export default function PartnerProjects() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex w-full bg-background">
      <main className="flex-1 flex flex-col">
        <div className="flex-1 p-6 space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerProjects.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {project.client}
                      </p>
                    </div>
                    <Badge
                      variant={
                        project.status === "En cours"
                          ? "default"
                          : project.status === "Terminé"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Badge variant="outline">{project.role}</Badge>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Avancement</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Deadline: {project.deadline}</span>
                    </div>
                  </div>

                  {project.tasks > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-kpi-warning font-medium">
                        {project.tasks} tâche(s) en attente
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() =>
                        router.push(`/partner/projects/${project.id}`)
                      }
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Détails
                    </Button>
                    <Button variant="outline">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
