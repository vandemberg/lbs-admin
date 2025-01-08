import api from "@/utils/http/admin-api";

export async function getAll(courseId: number) {
  const response = await api.get(`/courses/${courseId}/modules`);
  return response.data;
}

export async function getById(courseId: number, moduleId: number) {
  const response = await api.get(`/courses/${courseId}/modules/${moduleId}`);
  return response.data;
}

export async function create(courseId: number, module: { name: string }) {
  const response = await api.post(`/courses/${courseId}/modules`, module);
  return response.data;
}

export async function updateById(
  courseId: number,
  moduleId: number,
  module: { name: string }
) {
  const { data } = await api.put(
    `/courses/${courseId}/modules/${moduleId}`,
    module
  );
  return data;
}
