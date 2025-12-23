"use client";

import { AdminGalleryDetail } from "@/components/admin/projects/details/project-gallery/AdminGalleryDetail";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const { id, galleryId } = router.query;

  if (!id || !galleryId) return null;

  return (
    <AdminGalleryDetail
      projectId={id as string}
      galleryId={galleryId as string}
    />
  );
}
