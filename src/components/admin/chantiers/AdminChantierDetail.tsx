import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Image,
  MessageSquare,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";

const chantierData = {
  id: 1,
  name: "Villa Moderne Dupont",
  location: "123 Rue des Oliviers, 13100 Aix-en-Provence",
  progress: 65,
  status: "En cours",
  startDate: "15/01/2024",
  endDate: "15/12/2024",
  project: "Villa Moderne Dupont",
  team: [
    {
      id: 1,
      name: "Michel Dupuis",
      role: "Chef de chantier",
      phone: "06 11 22 33 44",
    },
    { id: 2, name: "Antoine Roux", role: "Maçon", phone: "06 22 33 44 55" },
    {
      id: 3,
      name: "Lucas Martin",
      role: "Électricien",
      phone: "06 33 44 55 66",
    },
    {
      id: 4,
      name: "Thomas Bernard",
      role: "Plombier",
      phone: "06 44 55 66 77",
    },
  ],
  planning: [
    { id: 1, task: "Fondations", start: "15/01", end: "15/02", progress: 100 },
    {
      id: 2,
      task: "Élévation murs RDC",
      start: "16/02",
      end: "15/03",
      progress: 100,
    },
    {
      id: 3,
      task: "Dalle premier étage",
      start: "16/03",
      end: "31/03",
      progress: 80,
    },
    {
      id: 4,
      task: "Élévation murs étage",
      start: "01/04",
      end: "30/04",
      progress: 20,
    },
    { id: 5, task: "Toiture", start: "01/05", end: "31/05", progress: 0 },
    { id: 6, task: "Second œuvre", start: "01/06", end: "30/09", progress: 0 },
  ],
  gallery: [
    { id: 1, title: "Fondations terminées", date: "15/02/2024", type: "photo" },
    { id: 2, title: "Élévation murs RDC", date: "15/03/2024", type: "photo" },
    { id: 3, title: "Visite de chantier", date: "20/03/2024", type: "video" },
    { id: 4, title: "Dalle premier étage", date: "28/03/2024", type: "photo" },
  ],
  notes: [
    {
      id: 1,
      date: "28/03/2024",
      author: "Michel Dupuis",
      content:
        "Dalle coulée avec succès. Temps de séchage 21 jours avant suite travaux.",
    },
    {
      id: 2,
      date: "20/03/2024",
      author: "Admin KTRAIT",
      content: "Visite client effectuée. Client satisfait de l'avancement.",
    },
    {
      id: 3,
      date: "15/03/2024",
      author: "Michel Dupuis",
      content: "Murs RDC terminés. Prêt pour la dalle.",
    },
  ],
};

interface AdminChantierDetailProps {
  id: string;
}

export const AdminChantierDetail = ({ id }: AdminChantierDetailProps) => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex w-full bg-background">
      <main className="flex-1 flex flex-col">
        <div className="flex-1 p-6 space-y-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/chantiers")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux chantiers
          </Button>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">
                      {chantierData.name}
                    </CardTitle>
                    <p className="text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4" /> {chantierData.location}
                    </p>
                  </div>
                  <Badge>{chantierData.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Période</p>
                      <p className="font-medium">
                        {chantierData.startDate} - {chantierData.endDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Équipe</p>
                      <p className="font-medium">
                        {chantierData.team.length} personnes
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Avancement global</span>
                    <span className="font-medium">
                      {chantierData.progress}%
                    </span>
                  </div>
                  <Progress value={chantierData.progress} className="h-3" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Équipe sur site</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {chantierData.team.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.role}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {member.phone}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="planning" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="planning">Planning</TabsTrigger>
              <TabsTrigger value="gallery">Galerie</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="planning">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {chantierData.planning.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-4 p-4 rounded-lg border"
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{task.task}</span>
                            <span className="text-sm text-muted-foreground">
                              {task.start} - {task.end}
                            </span>
                          </div>
                          <Progress value={task.progress} className="h-2" />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {task.progress}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gallery">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Photos & Vidéos</CardTitle>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {chantierData.gallery.map((item) => (
                      <div
                        key={item.id}
                        className="aspect-video rounded-lg bg-muted flex flex-col items-center justify-center border"
                      >
                        <Image className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.date}
                        </p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {item.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Notes de chantier</CardTitle>
                  <Button>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Ajouter une note
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {chantierData.notes.map((note) => (
                      <div key={note.id} className="p-4 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{note.author}</span>
                          <span className="text-sm text-muted-foreground">
                            {note.date}
                          </span>
                        </div>
                        <p className="text-sm">{note.content}</p>
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
