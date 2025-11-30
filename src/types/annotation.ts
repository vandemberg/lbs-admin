export interface Annotation {
  id: number;
  content: string;
  timestamp?: number;
  color?: string;
  tag?: string;
  video_id: number;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface AnnotationForm {
  content: string;
  timestamp?: number;
  color?: string;
  tag?: string;
  video_id: number;
}

