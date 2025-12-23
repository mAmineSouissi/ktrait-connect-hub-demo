"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  Loader2,
  Image,
  Video,
  FileImage,
} from "lucide-react";
import { useRouter } from "next/router";
import { api } from "@/api";
import { formatDate } from "@/lib/date.util";
import type { ProjectGalleryItem } from "@/types/gallery.types";

interface AdminGalleryDetailProps {
  projectId: string;
  galleryId: string;
}

// Media type mapping for display
const mediaTypeMap: Record<string, string> = {
  photo: "Photo",
  video: "Vidéo",
};

export const AdminGalleryDetail = ({
  projectId,
  galleryId,
}: AdminGalleryDetailProps) => {
  const router = useRouter();

  const {
    data: galleryData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["galleryItem", projectId, galleryId],
    queryFn: async () => {
      const result = await api.admin.gallery.getById(projectId, galleryId);
      return result;
    },
    enabled: !!projectId && !!galleryId,
  });

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.push(`/admin/projects/${projectId}`)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au projet
        </Button>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (isError || !galleryData) {
    return (
      <div className="w-full space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.push(`/admin/projects/${projectId}`)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au projet
        </Button>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-destructive mb-4">
            {error instanceof Error
              ? error.message
              : "Erreur lors du chargement de l'élément de galerie"}
          </p>
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/projects/${projectId}`)}
          >
            Retour au projet
          </Button>
        </div>
      </div>
    );
  }

  const galleryItem: ProjectGalleryItem = galleryData.galleryItem;

  return (
    <div className="w-full space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.push(`/admin/projects/${projectId}`)}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour au projet
      </Button>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{galleryItem.title}</CardTitle>
              {galleryItem.description && (
                <p className="text-muted-foreground mt-1">
                  {galleryItem.description}
                </p>
              )}
            </div>
            <Badge variant="outline" className="text-sm">
              {mediaTypeMap[galleryItem.media_type] || galleryItem.media_type}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            {galleryItem.file_url && (
              <div className="w-full">
                {galleryItem.media_type === "photo" ? (
                  <div className="relative w-full rounded-lg overflow-hidden border">
                    <img
                      src={galleryItem.file_url}
                      alt={galleryItem.title}
                      className="w-full h-auto object-contain max-h-[600px] mx-auto"
                    />
                  </div>
                ) : (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                    <video
                      src={galleryItem.file_url}
                      controls
                      className="w-full h-full object-contain"
                    >
                      Votre navigateur ne supporte pas la lecture de vidéos.
                    </video>
                  </div>
                )}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              {galleryItem.date && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {formatDate(galleryItem.date)}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                {galleryItem.media_type === "photo" ? (
                  <FileImage className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Video className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Type de média</p>
                  <p className="font-medium">
                    {mediaTypeMap[galleryItem.media_type] ||
                      galleryItem.media_type}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Créé le</p>
                  <p className="font-medium">
                    {formatDate(galleryItem.created_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Modifié le</p>
                  <p className="font-medium">
                    {formatDate(galleryItem.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                ID de l'élément
              </p>
              <p className="text-sm font-mono">{galleryItem.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">ID du projet</p>
              <p className="text-sm font-mono">{galleryItem.project_id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Type de média
              </p>
              <Badge variant="outline">
                {mediaTypeMap[galleryItem.media_type] || galleryItem.media_type}
              </Badge>
            </div>
            {galleryItem.thumbnail_url && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Miniature</p>
                <img
                  src={galleryItem.thumbnail_url}
                  alt="Thumbnail"
                  className="w-full rounded-lg border"
                />
              </div>
            )}
            {galleryItem.file_url && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  URL du fichier
                </p>
                <a
                  href={galleryItem.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline break-all"
                >
                  {galleryItem.file_url}
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
