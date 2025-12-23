import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Eye, Calendar, MapPin, Users } from "lucide-react";
import { useRouter } from "next/router";

const clientProjects = [
  {
    id: 1,
    name: "Villa Moderne",
    status: "En cours",
    progress: 65,
    budget: "450 000 €",
    startDate: "15/01/2024",
    endDate: "15/12/2024",
    location: "Aix-en-Provence",
    partner: "Cabinet Martin Architecture",
  },
  {
    id: 2,
    name: "Extension Garage",
    status: "Terminé",
    progress: 100,
    budget: "35 000 €",
    startDate: "01/06/2023",
    endDate: "15/09/2023",
    location: "Aix-en-Provence",
    partner: "Cabinet Martin Architecture",
  },
  {
    id: 3,
    name: "Rénovation Cuisine",
    status: "Planifié",
    progress: 0,
    budget: "25 000 €",
    startDate: "01/05/2024",
    endDate: "01/07/2024",
    location: "Aix-en-Provence",
    partner: "Leroy Design",
  },
];

export const ClientProjects = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex w-full bg-background">
      <main className="flex-1 flex flex-col">
        <div className="flex-1 p-6 space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientProjects.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
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
                      <span>
                        {project.startDate} - {project.endDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{project.partner}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="text-lg font-bold text-primary">
                      {project.budget}
                    </p>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() =>
                      router.push(`/client/projects/${project.id}`)
                    }
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Voir les détails
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
