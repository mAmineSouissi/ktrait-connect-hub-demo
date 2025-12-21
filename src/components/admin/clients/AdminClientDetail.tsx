"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ClientCard } from "./ClientCard";
import { ClientTableTabs } from "./ClientTableTabs";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import type { ClientDetailResponse } from "@/types/client.types";

interface AdminClientDetailProps {
  id: string;
}

export const AdminClientDetail = ({ id }: AdminClientDetailProps) => {
  const router = useRouter();

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery<ClientDetailResponse>({
    queryKey: ["client", id],
    queryFn: async () => {
      const result = await api.admin.clients.getById(id);
      return result;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <Button variant="ghost" onClick={() => router.push("/admin/clients")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (isError || !response) {
    return (
      <div className="p-6">
        <Button variant="ghost" onClick={() => router.push("/admin/clients")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>
        <p className="mt-4 text-sm text-muted-foreground">
          {error?.message || "Client introuvable."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-background">
      <div className="flex flex-1 flex-col">
        <div className="flex-1 space-y-6 p-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/clients")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la liste
          </Button>

          <div className="grid lg:grid-cols-3 gap-6">
            <ClientCard client={response.client} />
            <ClientTableTabs client={response.client} />
          </div>
        </div>
      </div>
    </div>
  );
};
