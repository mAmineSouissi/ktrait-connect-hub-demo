import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardHeaderProps {
  title?: string;
  userName?: string;
}

export function DashboardHeader({
  title,
  userName = "Utilisateur",
}: DashboardHeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-6">
      <SidebarTrigger className="-ml-2" />

      <div className="flex-1" />

      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
      </Button>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium">{userName}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
