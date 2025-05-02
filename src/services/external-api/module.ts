import { externalApi } from "@/lib/axios";

export async function removeModule(
  courseId: number,
  id: number
): Promise<unknown> {
  const response = await externalApi.delete(
    `/courses/${courseId}/modules/${id}`
  );

  return response.data;
}
