import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Eye, MapPin, Calendar, Users } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const mockChantiers = [
  {
    id: 1,
    name: "Villa Moderne Dupont",
    location: "Aix-en-Provence",
    progress: 65,
    status: "En cours",
    team: 8,
    startDate: "15/01/2024",
    endDate: "15/12/2024",
  },
  {
    id: 2,
    name: "Immeuble Résidentiel Lyon",
    location: "Lyon 6ème",
    progress: 30,
    status: "En cours",
    team: 15,
    startDate: "01/02/2024",
    endDate: "30/11/2024",
  },
  {
    id: 3,
    name: "Rénovation Bureau Paris",
    location: "Paris 8ème",
    progress: 0,
    status: "Planifié",
    team: 0,
    startDate: "01/04/2024",
    endDate: "01/08/2024",
  },
  {
    id: 4,
    name: "Extension Commerce",
    location: "Marseille",
    progress: 100,
    status: "Terminé",
    team: 0,
    startDate: "01/10/2023",
    endDate: "15/02/2024",
  },
  {
    id: 5,
    name: "Maison Écologique",
    location: "Bordeaux",
    progress: 10,
    status: "En attente",
    team: 4,
    startDate: "15/03/2024",
    endDate: "15/01/2025",
  },
];

export default function AdminChantiers() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useRouter();

  const filteredChantiers = mockChantiers.filter(
    (chantier) =>
      chantier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chantier.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En cours":
        return "default";
      case "Terminé":
        return "secondary";
      case "Planifié":
        return "outline";
      default:
        return "destructive";
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un chantier..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredChantiers.map((chantier) => (
            <Card
              key={chantier.id}
              className="cursor-pointer transition-shadow hover:shadow-lg"
              onClick={() => navigate.push(`/admin/chantiers/${chantier.id}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{chantier.name}</CardTitle>
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {chantier.location}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(chantier.status)}>
                    {chantier.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-muted-foreground">Avancement</span>
                    <span className="font-medium">{chantier.progress}%</span>
                  </div>
                  <Progress value={chantier.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Début</p>
                      <p className="font-medium">{chantier.startDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Équipe</p>
                      <p className="font-medium">{chantier.team} personnes</p>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate.push(`/admin/chantiers/${chantier.id}`);
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Voir le chantier
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
