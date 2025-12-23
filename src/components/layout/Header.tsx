import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
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
