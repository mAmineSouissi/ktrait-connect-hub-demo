import "@/styles/globals.css";
import Application from "@/components/Application";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Application Component={Component} pageProps={pageProps} />
      </QueryClientProvider>
    </AuthProvider>
  );
}
