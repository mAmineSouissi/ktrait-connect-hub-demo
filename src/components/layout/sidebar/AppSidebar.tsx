"use client";

import React from "react";
import {
  Users,
  FileText,
  LayoutDashboard,
  FolderKanban,
  UserCheck,
  HardHat,
  Files,
  Settings,
  Building2,
  MessageSquare,
  CreditCard,
  CheckSquare,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "./TeamSwitcher";
import { MainNav } from "./MainNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const userRole = user?.role;
  console.log("User Role in Sidebar:", userRole);

  const adminData = {
    teams: [
      {
        name: "KTRAIT Engineering",
        logo: Building2,
      },
    ],
    navMain: [
      {
        id: 1,
        title: "Dashboard",
        icon: LayoutDashboard,
        url: "/admin",
      },
      {
        id: 2,
        title: "Clients",
        icon: Users,
        url: "/admin/clients",
      },
      {
        id: 3,
        title: "Projets",
        icon: FolderKanban,
        url: "/admin/projects",
      },
      {
        id: 4,
        title: "Partenaires",
        icon: UserCheck,
        url: "/admin/partners",
      },
      {
        id: 5,
        title: "Chantiers",
        icon: HardHat,
        url: "/admin/chantiers",
      },
      {
        id: 6,
        title: "Devis & Factures",
        icon: FileText,
        url: "/admin/invoices",
      },
      {
        id: 7,
        title: "Documents",
        icon: Files,
        url: "/admin/documents",
      },
      {
        id: 8,
        title: "Paramètres",
        icon: Settings,
        url: "/admin/settings",
      },
    ],
  };

  const clientData = {
    teams: [
      {
        name: "Mon Espace Client",
        logo: Users,
      },
    ],
    navMain: [
      {
        id: 1,
        title: "Dashboard",
        icon: LayoutDashboard,
        url: "/client",
      },
      {
        id: 2,
        title: "Mes Projets",
        icon: FolderKanban,
        url: "/client/projects",
      },
      {
        id: 3,
        title: "Support",
        icon: MessageSquare,
        url: "/client/support",
      },
      {
        id: 4,
        title: "Documents",
        icon: Files,
        url: "/client/documents",
      },
      {
        id: 5,
        title: "Facturation",
        icon: CreditCard,
        url: "/client/billing",
      },
      {
        id: 6,
        title: "Paramètres",
        icon: Settings,
        url: "/client/settings",
      },
    ],
  };

  const partnerData = {
    teams: [
      {
        name: "Espace Partenaire",
        logo: UserCheck,
      },
    ],
    navMain: [
      {
        id: 1,
        title: "Dashboard",
        icon: LayoutDashboard,
        url: "/partner",
      },
      {
        id: 2,
        title: "Mes Projets",
        icon: FolderKanban,
        url: "/partner/projects",
      },
      {
        id: 3,
        title: "Mes Tâches",
        icon: CheckSquare,
        url: "/partner/tasks",
      },
      {
        id: 4,
        title: "Documents",
        icon: Files,
        url: "/partner/documents",
      },
      {
        id: 5,
        title: "Messagerie",
        icon: MessageSquare,
        url: "/partner/messages",
      },
      {
        id: 6,
        title: "Paramètres",
        icon: Settings,
        url: "/partner/settings",
      },
    ],
  };

  const { open, toggleSidebar } = useSidebar();

  const hoverToggledRef = React.useRef(false);

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    e.stopPropagation();
    if (!open) {
      toggleSidebar();
      hoverToggledRef.current = true;
    }
  };

  const handleMouseLeave = (
    e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    e.stopPropagation();
    if (hoverToggledRef.current) {
      toggleSidebar();
      hoverToggledRef.current = false;
    }
  };

  const getCurrentData = () => {
    switch (userRole) {
      case "client":
        return clientData;
      case "partner":
        return partnerData;
      default:
        return adminData;
    }
  };
  const currentData = getCurrentData();

  return (
    <Sidebar
      side="left"
      collapsible="icon"
      {...props}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SidebarHeader>
        {/* @ts-ignore */}
        <TeamSwitcher teams={currentData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {/* @ts-ignore */}
        <MainNav items={currentData.navMain} />
      </SidebarContent>
      {/* <SidebarFooter>
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  );
}
