import api from "@/utils/http/admin-api";

export async function getAll(courseId: number, moduleId: number) {
  const response = await api.get(
    `/courses/${courseId}/modules/${moduleId}/videos`
  );
  return response.data;
}

export async function getById(
  courseId: number,
  moduleId: number,
  videoId: number
) {
  const response = await api.get(
    `/courses/${courseId}/modules/${moduleId}/videos/${videoId}`
  );
  return response.data;
}

export async function create(
  courseId: number,
  moduleId: number,
  video: {
    title: string;
    description: string;
    url: string;
    timeInSeconds: number;
  }
) {
  const response = await api.post(
    `/courses/${courseId}/modules/${moduleId}/videos`,
    video
  );
  return response.data;
}

export async function updateById(
  courseId: number,
  moduleId: number,
  videoId: number,
  video: {
    title: string;
    description: string;
    url: string;
    timeInSeconds: number;
  }
) {
  const { data } = await api.put(
    `/courses/${courseId}/modules/${moduleId}/videos/${videoId}`,
    video
  );
  return data;
}
