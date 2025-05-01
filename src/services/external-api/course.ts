import { externalApi } from "@/lib/axios";
import { CourseDetails, CourseList } from "@/types/course";
import { Module } from "@/types/module";

export async function fetchCourses() {
  const response = await externalApi.get<CourseList[]>("/courses");
  return response.data;
}

export async function fetchCourseById(id: number) {
  const response = await externalApi.get<CourseDetails>(`/courses/${id}`);
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
export async function createCourseModule(
  courseId: number,
  data: any
): Promise<Module> {
  const response = await externalApi.post(`/courses/${courseId}/modules`, data);
  return response.data;
}

export async function updateCourseModule(
  courseId: number,
  id: number,
  data: any
): Promise<unknown> {
  const response = await externalApi.put(
    `/courses/${courseId}/modules/${id}`,
    data
  );
  return response.data;
}

export async function createModuleVideo(
  courseId: number,
  moduleId: number,
  data: any
) {
  const response = await externalApi.post(
    `courses/${courseId}/modules/${moduleId}/videos`,
    data
  );
  return response.data;
}

export async function updateModuleVideo(
  moduleId: number,
  videoId: string,
  data: any
) {
  const response = await externalApi.put(
    `/modules/${moduleId}/videos/${videoId}`,
    data
  );
  return response.data;
}
