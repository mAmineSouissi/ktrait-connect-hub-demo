import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientProjectPhases } from "./tabs/ClientProjectPhases";
import { ClientProjectGallery } from "./tabs/ClientProjectGallery";
import { ClientProjectExpenses } from "./tabs/ClientProjectExpenses";
import { ClientProjectDocuments } from "./tabs/ClientProjectDocuments";
import { ClientProjectPartners } from "./tabs/ClientProjectPartners";
import { ClientProjectChantiers } from "./tabs/ClientProjectChantiers";
import { ClientProjectPayments } from "./tabs/ClientProjectPayments";
import {
  DollarSignIcon,
  FileIcon,
  ImageIcon,
  ListIcon,
  UserCheckIcon,
  HardHat,
  CreditCard,
} from "lucide-react";

interface ClientProjectDetailsTabsProps {
  projectId: string;
}

export const ClientProjectDetailsTabs = ({
  projectId,
}: ClientProjectDetailsTabsProps) => {
  const [activeTab, setActiveTab] = React.useState("phases");

  const tabs = [
    {
      value: "phases",
      label: "Phases",
      icon: <ListIcon className="h-4 w-4" />,
      content: <ClientProjectPhases projectId={projectId} />,
    },
    {
      value: "partners",
      label: "Partenaires",
      icon: <UserCheckIcon className="h-4 w-4" />,
      content: <ClientProjectPartners projectId={projectId} />,
    },
    {
      value: "chantiers",
      label: "Chantiers",
      icon: <HardHat className="h-4 w-4" />,
      content: <ClientProjectChantiers projectId={projectId} />,
    },
    {
      value: "documents",
      label: "Documents",
      icon: <FileIcon className="h-4 w-4" />,
      content: <ClientProjectDocuments projectId={projectId} />,
    },
    {
      value: "expenses",
      label: "Dépenses",
      icon: <DollarSignIcon className="h-4 w-4" />,
      content: <ClientProjectExpenses projectId={projectId} />,
    },
    {
      value: "payments",
      label: "Paiements",
      icon: <CreditCard className="h-4 w-4" />,
      content: <ClientProjectPayments projectId={projectId} />,
    },
    {
      value: "gallery",
      label: "Galerie",
      icon: <ImageIcon className="h-4 w-4" />,
      content: <ClientProjectGallery projectId={projectId} />,
    },
  ];

  return (
    <Tabs
      defaultValue={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-7">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.icon} {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent className="pb-2" key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};
