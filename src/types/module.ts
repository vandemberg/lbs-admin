import { Video } from "./video";

export interface Module {
  id: number;
  courseId: number;
  name: string;
  description: string | null;
  status: "draft" | "published";
  order: number; // ordem do módulo dentro do curso
  createdAt: string | null;
  updatedAt: string | null;

  videos: Video[];
}
