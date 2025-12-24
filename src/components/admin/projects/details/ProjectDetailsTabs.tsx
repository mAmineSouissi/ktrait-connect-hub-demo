import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectPhases } from "./project-phases/ProjectPhases";
import { ProjectGallary } from "./project-gallery/ProjectGallary";
import { ProjectExpenses } from "./project-expenses/ProjectExpenses";
import { ProjectDocuments } from "./project-documents/ProjectDocuments";
import { ProjectPartners } from "./project-partners/ProjectPartners";
import { ProjectPayments } from "./project-payments/ProjectPayments";
import React from "react";
import {
  DollarSignIcon,
  FileIcon,
  ImageIcon,
  ListIcon,
  UserCheckIcon,
  CreditCard,
} from "lucide-react";

interface ProjectDetailsTabsProps {
  projectId: string;
}

export const ProjectDetailsTabs = ({ projectId }: ProjectDetailsTabsProps) => {
  const [activeTab, setActiveTab] = React.useState("phases");

  const tabs = [
    {
      value: "phases",
      label: "Phases",
      icon: <ListIcon className="h-4 w-4" />,
      content: <ProjectPhases projectId={projectId} />,
    },
    {
      value: "partners",
      label: "Partenaires",
      icon: <UserCheckIcon className="h-4 w-4" />,
      content: <ProjectPartners projectId={projectId} />,
    },
    {
      value: "documents",
      label: "Documents",
      icon: <FileIcon className="h-4 w-4" />,
      content: <ProjectDocuments projectId={projectId} />,
    },
    {
      value: "expenses",
      label: "Dépenses",
      icon: <DollarSignIcon className="h-4 w-4" />,
      content: <ProjectExpenses projectId={projectId} />,
    },
    {
      value: "payments",
      label: "Paiements",
      icon: <CreditCard className="h-4 w-4" />,
      content: <ProjectPayments projectId={projectId} />,
    },
    {
      value: "gallery",
      label: "Galerie",
      icon: <ImageIcon className="h-4 w-4" />,
      content: <ProjectGallary projectId={projectId} />,
    },
  ];

  return (
    <Tabs
      defaultValue={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-6">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.icon} {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};
