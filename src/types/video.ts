export interface Video {
  id: number;
  title: string;
  description?: string; // campo nullable (YES)
  url: string;
  status: 'draft' | 'published'; // enum com valores específicos
  transcription?: string; // campo nullable (YES)
  thumbnail?: string; // campo nullable (YES)
  time_in_seconds?: number; // campo nullable (YES)
  courseId: number; // course_id no banco
  moduleId: number; // module_id no banco
  createdAt?: string; // campo nullable (YES)
  updatedAt?: string; // campo nullable (YES)
}
