"use client";

import { AdminGalleryDetail } from "@/components/admin/projects/details/project-gallery/AdminGalleryDetail";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const projectId = params?.id as string;
  const galleryId = params?.galleryId as string;

  return <AdminGalleryDetail projectId={projectId} galleryId={galleryId} />;
}
