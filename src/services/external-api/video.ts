import { externalApi } from "@/lib/axios";
import { Video } from "@/types/video";

export async function changeStatusVideo(
  courseId: number,
  moduleId: number,
  id: number,
  status: "draft" | "published"
) {
  const response = await externalApi.put(
    `/courses/${courseId}/modules/${moduleId}/videos/${id}`,
    {
      status,
    }
  );
  return response.data;
}

export async function updateVideo(
  courseId: number,
  moduleId: number,
  id: number,
  video: Video
) {
  const response = await externalApi.put(
    `/courses/${courseId}/modules/${moduleId}/videos/${id}`,
    video
  );

  return response.data;
}

export async function deleteVideo(
  courseId: number,
  moduleId: number,
  id: number
) {
  const response = await externalApi.delete(
    `/courses/${courseId}/modules/${moduleId}/videos/${id}`
  );
  return response.data;
}
