import { AppProps } from "next/app";
import { Layout } from "./layout/Layout";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";

interface ApplicationProps {
  className?: string;
  Component: AppProps["Component"];
  pageProps: AppProps["pageProps"];
}

function Application({ className, Component, pageProps }: ApplicationProps) {
  return (
    <AppContent
      className={className}
      Component={Component}
      pageProps={pageProps}
    />
  );
}

function AppContent({
  className,
  Component,
  pageProps,
}: {
  className?: string;
  Component: AppProps["Component"];
  pageProps: AppProps["pageProps"];
}) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const landingPageRoutes = [
    "/",
    "/about",
    "/services",
    "/devis",
    "/contact",
    "/realisations",
    "/partenaires",
    "/gestionprojet",
    "/detailsagence",
  ];

  const authPageRoutes = [
    "/login",
    "/register",
    "/pending-approval",
    "/unauthorized",
  ];

  const dashboardRoutes = ["/admin", "/client", "/partner"];

  const isLandingPage = landingPageRoutes.includes(router.pathname);

  const isAuthPage = authPageRoutes.includes(router.pathname);

  const isDashboardRoute = dashboardRoutes.some((route) =>
    router.pathname.startsWith(route)
  );

  const shouldShowLayout =
    isAuthenticated && isDashboardRoute && !isLandingPage && !isAuthPage;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </div>
        <Toaster className="m-5" />
      </div>
    );
  }

  return (
    <div className={cn(`flex flex-col min-h-screen w-full`, className)}>
      {shouldShowLayout ? (
        <Layout className="flex w-full h-screen">
          <Component {...pageProps} />
        </Layout>
      ) : (
        <Component {...pageProps} />
      )}
      <Toaster className="m-5" />
    </div>
  );
}

export default Application;
