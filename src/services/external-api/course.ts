import { AddModuleFormValues } from "@/app/(admin)/courses/[id]/components/add-module-dialog";
import { AddVideoFormValues } from "@/app/(admin)/courses/[id]/components/add-video-dialog";
import { EditModuleFormValues } from "@/app/(admin)/courses/[id]/components/edit-module-dialog";
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

export async function updateCourseStatus(
  id: number,
  status: "draft" | "inprogress" | "complete"
) {
  const formData = new FormData();
  formData.append("status", status);
  const response = await externalApi.post(`/courses/${id}/update`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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
  data: AddModuleFormValues
): Promise<Module> {
  const response = await externalApi.post(`/courses/${courseId}/modules`, data);
  return response.data;
}

export async function updateCourseModule(
  courseId: number,
  id: number,
  data: EditModuleFormValues
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
  data: AddVideoFormValues
) {
  const response = await externalApi.post(
    `courses/${courseId}/modules/${moduleId}/videos`,
    data
  );
  return response.data;
}

export interface ReorderVideoItem {
  id: number;
  order: number;
  module_id: number;
}

export async function reorderVideos(
  courseId: number,
  videos: ReorderVideoItem[]
) {
  const response = await externalApi.post(
    `/courses/${courseId}/videos/reorder`,
    { videos }
  );
  return response.data;
}

export interface ReorderModuleItem {
  id: number;
  order: number;
}

export async function reorderModules(
  courseId: number,
  modules: ReorderModuleItem[]
) {
  const response = await externalApi.post(
    `/courses/${courseId}/modules/reorder`,
    { modules }
  );
  return response.data;
}
