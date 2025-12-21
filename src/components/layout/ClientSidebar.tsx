import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  Files,
  CreditCard,
  Settings,
  Home,
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
  { title: "Dashboard", url: "/client", icon: LayoutDashboard },
  { title: "Mes Projets", url: "/client/projects", icon: FolderKanban },
  { title: "Support", url: "/client/support", icon: MessageSquare },
  { title: "Documents", url: "/client/documents", icon: Files },
  { title: "Facturation", url: "/client/billing", icon: CreditCard },
  { title: "Paramètres", url: "/client/settings", icon: Settings },
];

export function ClientSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarContent>
        <div className="px-6 py-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Home className="h-8 w-8 text-sidebar-primary" />
            {open && (
              <div>
                <h2 className="text-lg font-bold text-sidebar-foreground">
                  Mon Espace
                </h2>
                <p className="text-xs text-sidebar-foreground/70">Client</p>
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
