import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Layout } from "./layout/Layout";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";

interface ApplicationProps {
  className?: string;
  Component: AppProps["Component"];
  pageProps: AppProps["pageProps"];
}

function Application({ className, Component, pageProps }: ApplicationProps) {
  const router = useRouter();
  const isAuthPage =
    router.pathname === "/login" ||
    router.pathname === "/register" ||
    router.pathname === "/pending-approval";

  return (
    <AppContent
      className={className}
      Component={Component}
      pageProps={pageProps}
      isAuthPage={isAuthPage}
    />
  );
}

function AppContent({
  className,
  Component,
  pageProps,
  isAuthPage,
}: {
  className?: string;
  Component: AppProps["Component"];
  pageProps: AppProps["pageProps"];
  isAuthPage: boolean;
}) {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  if (
    loading &&
    !isAuthenticated &&
    !user &&
    !isAuthPage &&
    router.pathname !== "/login" &&
    router.pathname !== "/register"
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        `flex flex-col min-h-screen w-full`,
        className
      )}
    >
      {isAuthPage || !isAuthenticated ? (
        <Component {...pageProps} />
      ) : (
        <Layout className="flex w-full h-screen">
          <Component {...pageProps} />
        </Layout>
      )}
      <Toaster className="m-5" />
    </div>
  );
}

export default Application;
