// import {
//   LayoutDashboard,
//   Users,
//   FolderKanban,
//   UserCheck,
//   HardHat,
//   FileText,
//   Files,
//   Settings,
//   Building2,
// } from "lucide-react";
// import { NavLink } from "@/components/NavLink";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   useSidebar,
// } from "@/components/ui/sidebar";

// const menuItems = [
//   { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
//   { title: "Clients", url: "/admin/clients", icon: Users },
//   { title: "Projets", url: "/admin/projects", icon: FolderKanban },
//   { title: "Partenaires", url: "/admin/partners", icon: UserCheck },
//   { title: "Chantiers", url: "/admin/chantiers", icon: HardHat },
//   { title: "Devis & Factures", url: "/admin/invoices", icon: FileText },
//   { title: "Documents", url: "/admin/documents", icon: Files },
//   { title: "Paramètres", url: "/admin/settings", icon: Settings },
// ];

// export function AdminSidebar() {
//   const { open } = useSidebar();

//   return (
//     <Sidebar className="border-r border-sidebar-border">
//       <SidebarContent>
//         <div className="px-6 py-4 border-b border-sidebar-border">
//           <div className="flex items-center gap-2">
//             <Building2 className="h-8 w-8 text-sidebar-primary" />
//             {open && (
//               <div>
//                 <h2 className="text-lg font-bold text-sidebar-foreground">
//                   KTRAIT
//                 </h2>
//                 <p className="text-xs text-sidebar-foreground/70">
//                   Engineering
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>

//         <SidebarGroup>
//           <SidebarGroupLabel>Administration</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {menuItems.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton asChild>
//                     <NavLink
//                       href={item.url}
//                       className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors"
//                       activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
//                     >
//                       <item.icon className="h-5 w-5" />
//                       {open && <span>{item.title}</span>}
//                     </NavLink>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//     </Sidebar>
//   );
// }
