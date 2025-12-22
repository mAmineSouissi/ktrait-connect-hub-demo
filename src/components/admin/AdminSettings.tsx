import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Building2, Bell, FileText } from "lucide-react";
import { UserManagement } from "./settings/users/UserManagement";
import { InvoiceTemplateManagement } from "./invoices/templates/InvoiceTemplateManagement";
import { cn } from "@/lib/utils";

interface AdminSettingsProps {
  className?: string;
}

export const AdminSettings = ({ className }: AdminSettingsProps) => {
  return (
    <div className={cn("flex flex-1 flex-col", className)}>
      <div className="flex-1 space-y-6 p-6">
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-5 max-w-3xl">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Entreprise
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Modèles
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

          <TabsContent value="templates" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                Gestion des modèles de factures
              </h2>
            </div>
            <Card>
              <CardContent className="pt-6">
                <InvoiceTemplateManagement />
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
