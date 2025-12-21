import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Shield, Building2, Bell, Edit } from "lucide-react";
import { UserManagement } from "./settings/users/UserManagement";

const roles = [
  {
    id: 1,
    name: "Super Admin",
    description: "Accès complet à toutes les fonctionnalités",
    users: 1,
  },
  {
    id: 2,
    name: "Gestionnaire",
    description: "Gestion des projets et clients",
    users: 1,
  },
  {
    id: 3,
    name: "Comptable",
    description: "Accès aux devis et factures",
    users: 1,
  },
  { id: 4, name: "Assistant", description: "Accès en lecture seule", users: 1 },
];

export const AdminSettings = () => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-6 p-6">
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Rôles
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Entreprise
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                Gestion des utilisateurs
              </h2>
            </div>

            <Card>
              <CardContent className="pt-6">
                <UserManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            <h2 className="text-lg font-semibold">Gestion des rôles</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {roles.map((role) => (
                <Card key={role.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{role.name}</CardTitle>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {role.users} utilisateur(s)
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="company" className="space-y-4">
            <h2 className="text-lg font-semibold">Informations entreprise</h2>
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Nom de l'entreprise</Label>
                    <Input defaultValue="KTRAIT Engineering" />
                  </div>
                  <div className="space-y-2">
                    <Label>SIRET</Label>
                    <Input defaultValue="123 456 789 00012" />
                  </div>
                  <div className="space-y-2">
                    <Label>Adresse</Label>
                    <Input defaultValue="123 Avenue des Ingénieurs" />
                  </div>
                  <div className="space-y-2">
                    <Label>Ville</Label>
                    <Input defaultValue="75008 Paris" />
                  </div>
                  <div className="space-y-2">
                    <Label>Téléphone</Label>
                    <Input defaultValue="01 23 45 67 89" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input defaultValue="contact@ktrait.com" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>Enregistrer</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <h2 className="text-lg font-semibold">
              Paramètres de notifications
            </h2>
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifications par email</p>
                    <p className="text-sm text-muted-foreground">
                      Recevoir les alertes par email
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Nouveaux projets</p>
                    <p className="text-sm text-muted-foreground">
                      Notification lors de la création d'un projet
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Paiements</p>
                    <p className="text-sm text-muted-foreground">
                      Notification lors d'un paiement reçu
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Retards de paiement</p>
                    <p className="text-sm text-muted-foreground">
                      Alerte pour les factures en retard
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mises à jour chantier</p>
                    <p className="text-sm text-muted-foreground">
                      Notification des avancées de chantier
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
