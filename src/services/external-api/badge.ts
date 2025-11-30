import { externalApi } from "@/lib/axios";
import { Badge, BadgeForm } from "@/types/badge";

export async function fetchBadges(): Promise<Badge[]> {
  // TODO: Update endpoint when backend API is available
  const response = await externalApi.get<Badge[]>("/badges");
  return response.data;
}

export async function fetchBadgeById(id: number): Promise<Badge> {
  const response = await externalApi.get<Badge>(`/badges/${id}`);
  return response.data;
}

export async function createBadge(data: BadgeForm): Promise<Badge> {
  const response = await externalApi.post<Badge>("/badges", data);
  return response.data;
}

export async function updateBadge(id: number, data: BadgeForm): Promise<Badge> {
  const response = await externalApi.put<Badge>(`/badges/${id}`, data);
  return response.data;
}

export async function deleteBadge(id: number): Promise<void> {
  await externalApi.delete(`/badges/${id}`);
}

