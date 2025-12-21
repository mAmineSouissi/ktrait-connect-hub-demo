import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buildBreadcrumbs } from "@/lib/object.lib";
import { Separator } from "../ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface HeaderProps {
  title?: string;
  className?: string;
}

export function Header({ title, className }: HeaderProps) {
  const pathname = usePathname();
  const crumbs = buildBreadcrumbs(pathname);

  const { user, signOut } = useAuth();

  const handleLogout = React.useCallback(async () => {
    try {
      await signOut();
      toast.success("Déconnexion réussie");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  }, [signOut]);

  return (
    <header
      className={cn(
        "flex h-14 items-center gap-2 border-b px-4 lg:h-15 lg:px-6 w-full",
        className
      )}
    >
      <SidebarTrigger />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <Breadcrumb>
        <BreadcrumbList>
          {crumbs.length === 0 ? (
            <BreadcrumbItem>
              <BreadcrumbPage>{title ?? "Accueil"}</BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            crumbs.map((crumb, idx) => {
              const isLast = idx === crumbs.length - 1;
              return (
                <React.Fragment key={`${crumb.href ?? crumb.label}-${idx}`}>
                  <BreadcrumbItem
                    className={idx === 0 ? "hidden md:block" : undefined}
                  >
                    {isLast ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={crumb.href}>
                        {crumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              );
            })
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-center items-center gap-4 ml-auto">
        {/* <UserNav />*/}
        <div className="ml-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
          </Button>
          <div className="text-right">
            <p className="text-sm font-medium">
              {user?.full_name || "Utilisateur"}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
