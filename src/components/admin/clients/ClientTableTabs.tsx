import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FolderKanban, FileText, CreditCard } from "lucide-react";
import { ClientProjectTable } from "./tables/ClientProjectTable";
import { ClientDocsTable } from "./tables/ClientDocsTable";
import { ClientPaymentTable } from "./tables/ClientPaymentTable";
import type { ClientDetail } from "@/types/client.types";

interface ClientTableTabsProps {
  client: ClientDetail;
}

export const ClientTableTabs = ({ client }: ClientTableTabsProps) => {
  return (
    <Card className="lg:col-span-2">
      <Tabs defaultValue="projects" className="w-full">
        <CardHeader>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderKanban className="h-4 w-4" />
              Projets
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Paiements
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <TabsContent value="projects" className="mt-0">
            <ClientProjectTable client={client} />
          </TabsContent>

          <TabsContent value="documents" className="mt-0">
            <ClientDocsTable client={client} />
          </TabsContent>

          <TabsContent value="payments" className="mt-0">
            <ClientPaymentTable client={client} />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};
