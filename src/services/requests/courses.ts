import api from "@/utils/http/admin-api";

export async function getCourses(search: string) {
  const response = await api.get("/courses?search=" + search);
  return response?.data;
}

export async function getById(courseId: number) {
  const response = await api.get(`/courses/${courseId}`);

  return response.data;
}

export async function createCourse(course: FormData) {
  const { data } = await api.post("/courses", course, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}

export async function disableCourse(courseId: number) {
  const { data } = await api.put(`/courses/${courseId}/disable`);

  return data;
}

export async function enableCourse(courseId: number) {
  const { data } = await api.put(`/courses/${courseId}/enable`);

  return data;
}

export async function updateById(courseId: number, course: FormData) {
  const { data } = await api.post(`/courses/${courseId}/update`, course, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}
