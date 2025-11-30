import { externalApi } from "@/lib/axios";
import { Resource, ResourceForm } from "@/types/resource";

export async function fetchResources(): Promise<Resource[]> {
  // TODO: Update endpoint when backend API is available
  const response = await externalApi.get<Resource[]>("/resources");
  return response.data;
}

export async function fetchResourceById(id: number): Promise<Resource> {
  const response = await externalApi.get<Resource>(`/resources/${id}`);
  return response.data;
}

export async function createResource(data: ResourceForm): Promise<Resource> {
  const formData = new FormData();
  formData.append("title", data.title);
  if (data.description) formData.append("description", data.description);
  formData.append("type", data.type);
  if (data.url) formData.append("url", data.url);
  if (data.file) formData.append("file", data.file);
  if (data.course_id) formData.append("course_id", data.course_id.toString());
  if (data.module_id) formData.append("module_id", data.module_id.toString());
  if (data.video_id) formData.append("video_id", data.video_id.toString());

  const response = await externalApi.post<Resource>("/resources", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function updateResource(
  id: number,
  data: ResourceForm
): Promise<Resource> {
  const formData = new FormData();
  formData.append("title", data.title);
  if (data.description) formData.append("description", data.description);
  formData.append("type", data.type);
  if (data.url) formData.append("url", data.url);
  if (data.file) formData.append("file", data.file);
  if (data.course_id) formData.append("course_id", data.course_id.toString());
  if (data.module_id) formData.append("module_id", data.module_id.toString());
  if (data.video_id) formData.append("video_id", data.video_id.toString());

  const response = await externalApi.put<Resource>(
    `/resources/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

export async function deleteResource(id: number): Promise<void> {
  await externalApi.delete(`/resources/${id}`);
}

