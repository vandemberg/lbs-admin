import { Video } from "./video";

export interface Module {
  id: number;
  courseId: number;
  name: string;
  description: string | null;
  status: "draft" | "published";
  createdAt: string | null;
  updatedAt: string | null;

  videos: Video[];
}
