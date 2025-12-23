import { KPICard } from "@/components/dashboard/KPICard";
import {
  Users,
  FolderKanban,
  UserCheck,
  HardHat,
  FileText,
  TrendingUp,
  Eye,
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
import { useRouter } from "next/navigation";

export const AdminDashboard = () => {
  const navigate = useRouter();
  const recentProjects = [
    {
      id: 1,
      name: "Villa Moderne - Dakar",
      status: "En cours",
      date: "Il y a 2h",
    },
    {
      id: 2,
      name: "Immeuble R+5 - Plateau",
      status: "Devis",
      date: "Il y a 5h",
    },
    {
      id: 3,
      name: "Centre Commercial - Almadies",
      status: "Planning",
      date: "Hier",
    },
  ];

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-1">
        <div className="p-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div
              onClick={() => navigate.push("/admin/projects")}
              className="cursor-pointer"
            >
              <KPICard
                title="Projets Actifs"
                value="24"
                icon={FolderKanban}
                trend={{ value: "+12% ce mois", isPositive: true }}
                variant="info"
              />
            </div>
            <div
              onClick={() => navigate.push("/admin/clients")}
              className="cursor-pointer"
            >
              <KPICard
                title="Clients Total"
                value="156"
                icon={Users}
                trend={{ value: "+8 nouveaux", isPositive: true }}
                variant="success"
              />
            </div>
            <div
              onClick={() => navigate.push("/admin/partners")}
              className="cursor-pointer"
            >
              <KPICard
                title="Partenaires"
                value="42"
                icon={UserCheck}
                variant="default"
              />
            </div>
            <div
              onClick={() => navigate.push("/admin/chantiers")}
              className="cursor-pointer"
            >
              <KPICard
                title="Chantiers en Cours"
                value="18"
                icon={HardHat}
                variant="warning"
              />
            </div>
            <div
              onClick={() => navigate.push("/admin/invoices")}
              className="cursor-pointer"
            >
              <KPICard
                title="Devis en Attente"
                value="9"
                icon={FileText}
                variant="default"
              />
            </div>
            <KPICard
              title="CA du Mois"
              value="450K €"
              icon={TrendingUp}
              trend={{ value: "+18%", isPositive: true }}
              variant="success"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
                <CardDescription>
                  Accès directs aux fonctionnalités principales
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => navigate.push("/admin/projects")}
                >
                  <FolderKanban className="mr-2 h-4 w-4" />
                  Ajouter un Projet
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => navigate.push("/admin/clients")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Ajouter un Client
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => navigate.push("/admin/partners")}
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  Voir les Partenaires
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => navigate.push("/admin/chantiers")}
                >
                  <HardHat className="mr-2 h-4 w-4" />
                  Gérer les Chantiers
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => navigate.push("/admin/invoices")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Devis & Factures
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Derniers Projets</CardTitle>
                    <CardDescription>
                      Projets récemment créés ou modifiés
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate.push("/admin/projects")}
                  >
                    Voir tout
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors cursor-pointer"
                      onClick={() =>
                        navigate.push(`/admin/projects/${project.id}`)
                      }
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{project.name}</p>
                        <Badge variant="outline" className="mt-1">
                          {project.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">
                          {project.date}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate.push(`/admin/projects/${project.id}`);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    // </SidebarProvider>
  );
};
