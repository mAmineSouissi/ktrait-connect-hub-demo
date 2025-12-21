/**
 * Project Gallery type matching the public.project_gallery table schema
 */
export interface ProjectGalleryItem {
  id: string;
  project_id: string;
  title: string;
  description?: string | null;
  media_type: "photo" | "video";
  file_url: string;
  thumbnail_url?: string | null;
  date?: string | null;
  created_at: string;
  updated_at: string;
}
