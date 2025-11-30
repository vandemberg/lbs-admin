import { externalApi } from "@/lib/axios";
import { Annotation, AnnotationForm } from "@/types/annotation";

export async function fetchAnnotations(videoId?: number): Promise<Annotation[]> {
  // TODO: Update endpoint when backend API is available
  const url = videoId
    ? `/annotations?video_id=${videoId}`
    : "/annotations";
  const response = await externalApi.get<Annotation[]>(url);
  return response.data;
}

export async function fetchAnnotationById(id: number): Promise<Annotation> {
  const response = await externalApi.get<Annotation>(`/annotations/${id}`);
  return response.data;
}

export async function createAnnotation(
  data: AnnotationForm
): Promise<Annotation> {
  const response = await externalApi.post<Annotation>("/annotations", data);
  return response.data;
}

export async function updateAnnotation(
  id: number,
  data: AnnotationForm
): Promise<Annotation> {
  const response = await externalApi.put<Annotation>(
    `/annotations/${id}`,
    data
  );
  return response.data;
}

export async function deleteAnnotation(id: number): Promise<void> {
  await externalApi.delete(`/annotations/${id}`);
}

