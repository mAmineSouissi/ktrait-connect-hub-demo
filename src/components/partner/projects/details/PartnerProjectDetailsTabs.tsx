import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PartnerProjectPhases } from "./tabs/PartnerProjectPhases";
import { PartnerProjectGallery } from "./tabs/PartnerProjectGallery";
import { PartnerProjectDocuments } from "./tabs/PartnerProjectDocuments";
import { PartnerProjectTasks } from "./tabs/PartnerProjectTasks";
import {
  DollarSignIcon,
  FileIcon,
  ImageIcon,
  ListIcon,
  CheckSquare,
} from "lucide-react";

interface PartnerProjectDetailsTabsProps {
  projectId: string;
}

export const PartnerProjectDetailsTabs = ({
  projectId,
}: PartnerProjectDetailsTabsProps) => {
  const [activeTab, setActiveTab] = React.useState("phases");

  const tabs = [
    {
      value: "phases",
      label: "Phases",
      icon: <ListIcon className="h-4 w-4" />,
      content: <PartnerProjectPhases projectId={projectId} />,
    },
    {
      value: "tasks",
      label: "Tâches",
      icon: <CheckSquare className="h-4 w-4" />,
      content: <PartnerProjectTasks projectId={projectId} />,
    },
    {
      value: "documents",
      label: "Documents",
      icon: <FileIcon className="h-4 w-4" />,
      content: <PartnerProjectDocuments projectId={projectId} />,
    },
    {
      value: "gallery",
      label: "Galerie",
      icon: <ImageIcon className="h-4 w-4" />,
      content: <PartnerProjectGallery projectId={projectId} />,
    },
  ];

  return (
    <Tabs
      defaultValue={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-4">
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

