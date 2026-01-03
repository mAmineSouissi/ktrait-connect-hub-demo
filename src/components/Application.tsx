import { AppProps } from "next/app";
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
  const { isAuthenticated } = useAuth();

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="text-lg">Chargement...</div>
  //     </div>
  //   );
  // }

  return (
    <div className={cn(`flex flex-col min-h-screen w-full`, className)}>
      {!isAuthenticated ? (
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
