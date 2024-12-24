import Course from "@/models/Course";
import api from "@/utils/http/admin-api";

export async function getCourses() {
  const { data } = await api.get("/courses");

  return data;
}

export async function getCouresesById(courseId: number) {
  const { data } = await api.get(`/courses/${courseId}`);

  return data;
}

export async function createCourse(course: Course) {
  const { data } = await api.post("/courses", course);

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
