import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Files,
  MessageSquare,
  Settings,
  Briefcase,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/partner", icon: LayoutDashboard },
  { title: "Mes Projets", url: "/partner/projects", icon: FolderKanban },
  { title: "Mes Tâches", url: "/partner/tasks", icon: CheckSquare },
  { title: "Documents", url: "/partner/documents", icon: Files },
  { title: "Messagerie", url: "/partner/messages", icon: MessageSquare },
  { title: "Paramètres", url: "/partner/settings", icon: Settings },
];

export function PartnerSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarContent>
        <div className="px-6 py-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-sidebar-primary" />
            {open && (
              <div>
                <h2 className="text-lg font-bold text-sidebar-foreground">
                  Espace Partenaire
                </h2>
                <p className="text-xs text-sidebar-foreground/70">Architecte</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      href={item.url}
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
                    >
                      <item.icon className="h-5 w-5" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
