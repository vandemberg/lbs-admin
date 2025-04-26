import { externalApi } from "@/lib/axios";
import { CourseList } from "@/types/course";

export async function fetchCourses() {
  const response = await externalApi.get<CourseList[]>("/courses");
  return response.data;
}

export async function fetchCourseById(id: number) {
  const response = await externalApi.get<CourseList>(`/courses/${id}`);
  return response.data;
}

export async function enableCourse(id: number) {
  const response = await externalApi.post(`/courses/${id}/enable`);
  return response.data;
}

export async function disableCourse(id: number) {
  const response = await externalApi.post(`/courses/${id}/disable`);
  return response.data;
}

export async function createCourse(formData: FormData) {
  const response = await externalApi.post("/courses", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function updateCourse(id: number, formData: FormData) {
  const response = await externalApi.post(`/courses/${id}/update`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function deleteCourse(id: number) {
  const response = await externalApi.delete(`/courses/${id}`);
  return response.data;
}
