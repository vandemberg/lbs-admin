export type ResourceType = "pdf" | "link" | "file" | "video";

export interface Resource {
  id: number;
  title: string;
  description?: string;
  type: ResourceType;
  url?: string;
  file_path?: string;
  course_id?: number;
  module_id?: number;
  video_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ResourceForm {
  title: string;
  description?: string;
  type: ResourceType;
  url?: string;
  file?: File | null;
  course_id?: number;
  module_id?: number;
  video_id?: number;
}

