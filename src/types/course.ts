import { Module } from "./module";

export type CourseStatus = "draft" | "inprogress" | "complete";

export interface Course {
  id: number;
  title: string;
  description: string;
  status: CourseStatus;
  thumbnail: string;
}

export interface CourseList extends Course {
  uniqueAccess: number;
}

export interface CourseDetails extends Course {
  modules: Module[];
}

export interface CourseForm {
  title: string;
  description?: string;
  thumbnail?: File | null;
  status?: CourseStatus;
}
