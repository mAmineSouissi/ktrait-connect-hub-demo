import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Briefcase, Building2, Users } from "lucide-react";
import { useRouter } from "next/router";

export const HomePage = () => {
  const router = useRouter();

  const portals = [
    {
      title: "Espace Admin",
      description: "Administration complète de la plateforme",
      icon: Building2,
      path: "/login?role=admin",
      color: "bg-primary",
    },
    {
      title: "Espace Client",
      description: "Gérer vos projets et suivre l'avancement",
      icon: Users,
      path: "/login?role=client",
      color: "bg-kpi-info",
    },
    {
      title: "Espace Partenaire",
      description: "Architectes, ingénieurs et fournisseurs",
      icon: Briefcase,
      path: "/login?role=partner",
      color: "bg-kpi-success",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background flex items-center justify-center p-4">
      <div className="max-w-6xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Building2 className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold text-foreground">KTRAIT</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Engineering & Construction Management
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {portals.map((portal) => (
            <Card
              key={portal.path}
              className="group hover:shadow-xl transition-all cursor-pointer"
              onClick={() => router.push(portal.path)}
            >
              <CardHeader className="text-center">
                <div
                  className={`mx-auto mb-4 h-16 w-16 rounded-full ${portal.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <portal.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">{portal.title}</CardTitle>
                <CardDescription>{portal.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="lg">
                  Accéder
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center pt-8">
          <p className="text-sm text-muted-foreground">
            © 2024 KTRAIT Engineering. Plateforme de gestion construction.
          </p>
        </div>
      </div>
    </div>
  );
};
