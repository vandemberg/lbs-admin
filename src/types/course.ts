export interface Course {
  id: number;
  title: string;
  description: string;
  status: boolean;
  thumbnail: string;
}

export interface CourseList extends Course {
  uniqueAccess: number;
}

export interface CourseForm {
  title: string;
  description?: string;
  thumbnail?: File | null;
  status?: boolean;
}
