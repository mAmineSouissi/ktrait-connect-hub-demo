/**
 * Project Gallery table types
 */
import type { MediaTypeType } from "../enums/media-type.enum";

export interface ProjectGalleryRow {
  id: string;
  project_id: string;
  title: string;
  description?: string | null;
  media_type: MediaTypeType;
  file_url: string;
  thumbnail_url?: string | null;
  date?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectGalleryInsert {
  id?: string;
  project_id: string;
  title: string;
  description?: string | null;
  media_type?: MediaTypeType;
  file_url: string;
  thumbnail_url?: string | null;
  date?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectGalleryUpdate {
  project_id?: string;
  title?: string;
  description?: string | null;
  media_type?: MediaTypeType;
  file_url?: string;
  thumbnail_url?: string | null;
  date?: string | null;
  updated_at?: string;
}
