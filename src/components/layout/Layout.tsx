import React from "react";
import { cn } from "@/lib/utils";
import { Header } from "./Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { AppSidebar } from "./sidebar/AppSidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { PageIntro } from "./PageIntro";
import { usePageMetadata } from "@/hooks/usePageMetadata";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout = ({ children, className }: LayoutProps) => {
  const isMobile = useIsMobile();
  const pageMetadata = usePageMetadata();

  const Content = () => {
    const { state, isMobile: sidebarMobile } = useSidebar();
    const paddingLeft = sidebarMobile
      ? undefined
      : state === "collapsed"
      ? "var(--sidebar-width-icon)"
      : "var(--sidebar-width)";

    return (
      <SidebarInset
        className="flex flex-1 flex-col overflow-hidden"
        style={{ paddingLeft, transition: "padding-left 200ms linear" }}
      >
        <Header />
        <main
          className={cn(
            "flex flex-col flex-1 overflow-auto",
            isMobile ? "px-4" : "px-10",
            className
          )}
        >
          <PageIntro metadata={pageMetadata} />
          {children}
        </main>
      </SidebarInset>
    );
  };

  return (
    <div className={cn("min-h-screen w-full bg-background")}>
      <SidebarProvider>
        <AppSidebar />
        <Content />
      </SidebarProvider>
    </div>
  );
};
