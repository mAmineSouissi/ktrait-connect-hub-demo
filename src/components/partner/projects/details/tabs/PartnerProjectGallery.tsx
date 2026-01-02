"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { api } from "@/api";
import { formatDate } from "@/lib/date.util";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PartnerProjectGalleryProps {
  projectId: string;
}

interface GalleryItem {
  id: string;
  title: string;
  description?: string | null;
  media_type: string;
  file_url: string;
  thumbnail_url?: string | null;
  date?: string | null;
  created_at: string;
}

export const PartnerProjectGallery: React.FC<PartnerProjectGalleryProps> = ({
  projectId,
}) => {
  const [selectedImage, setSelectedImage] = React.useState<GalleryItem | null>(null);

  const { data: galleryData, isLoading, error } = useQuery({
    queryKey: ["partner-project-gallery", projectId],
    queryFn: () => api.partner.projects.getGallery(projectId),
    enabled: !!projectId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-destructive text-center">
            Erreur lors du chargement de la galerie
          </p>
        </CardContent>
      </Card>
    );
  }

  const galleryItems: GalleryItem[] = galleryData?.gallery || [];

  if (galleryItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Galerie du projet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Aucune image dans la galerie
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Galerie du projet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-square rounded-lg overflow-hidden border cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedImage(item)}
              >
                {item.thumbnail_url || item.file_url ? (
                  <img
                    src={item.thumbnail_url || item.file_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center p-2">
                    <p className="text-sm font-medium">{item.title}</p>
                    {item.date && (
                      <p className="text-xs mt-1">
                        {formatDate(item.date)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedImage?.title}</DialogTitle>
            {selectedImage?.description && (
              <DialogDescription>{selectedImage.description}</DialogDescription>
            )}
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              {selectedImage.file_url && (
                <img
                  src={selectedImage.file_url}
                  alt={selectedImage.title}
                  className="w-full h-auto rounded-lg"
                />
              )}
              {selectedImage.date && (
                <p className="text-sm text-muted-foreground">
                  Date: {formatDate(selectedImage.date)}
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

