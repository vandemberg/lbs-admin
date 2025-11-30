import { externalApi } from "@/lib/axios";
import { FAQ, FAQForm, HelpCategory, HelpCategoryForm } from "@/types/faq";

// FAQ/Help Articles endpoints
export async function fetchFAQs(): Promise<FAQ[]> {
  const response = await externalApi.get<FAQ[]>("/help-articles?is_faq=true");
  return response.data;
}

export async function fetchAllHelpArticles(params?: {
  is_faq?: boolean;
  category_id?: number;
  search?: string;
}): Promise<FAQ[]> {
  const queryParams = new URLSearchParams();
  if (params?.is_faq !== undefined) {
    queryParams.append("is_faq", String(params.is_faq));
  }
  if (params?.category_id) {
    queryParams.append("category_id", String(params.category_id));
  }
  if (params?.search) {
    queryParams.append("search", params.search);
  }
  const response = await externalApi.get<FAQ[]>(
    `/help-articles${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`
  );
  return response.data;
}

export async function fetchFAQById(id: number): Promise<FAQ> {
  const response = await externalApi.get<FAQ>(`/help-articles/${id}`);
  return response.data;
}

export async function createFAQ(data: FAQForm): Promise<FAQ> {
  const response = await externalApi.post<FAQ>("/help-articles", {
    ...data,
    is_faq: true,
  });
  return response.data;
}

export async function updateFAQ(id: number, data: FAQForm): Promise<FAQ> {
  const response = await externalApi.put<FAQ>(`/help-articles/${id}`, {
    ...data,
    is_faq: true,
  });
  return response.data;
}

export async function deleteFAQ(id: number): Promise<void> {
  await externalApi.delete(`/help-articles/${id}`);
}

// Help Categories endpoints
export async function fetchHelpCategories(params?: {
  search?: string;
}): Promise<HelpCategory[]> {
  const queryParams = new URLSearchParams();
  if (params?.search) {
    queryParams.append("search", params.search);
  }
  const response = await externalApi.get<HelpCategory[]>(
    `/help-categories${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`
  );
  return response.data;
}

export async function fetchHelpCategoryById(id: number): Promise<HelpCategory> {
  const response = await externalApi.get<HelpCategory>(
    `/help-categories/${id}`
  );
  return response.data;
}

export async function createHelpCategory(
  data: HelpCategoryForm
): Promise<HelpCategory> {
  const response = await externalApi.post<HelpCategory>(
    "/help-categories",
    data
  );
  return response.data;
}

export async function updateHelpCategory(
  id: number,
  data: HelpCategoryForm
): Promise<HelpCategory> {
  const response = await externalApi.put<HelpCategory>(
    `/help-categories/${id}`,
    data
  );

  return response.data;
}

export async function deleteHelpCategory(id: number): Promise<void> {
  await externalApi.delete(`/help-categories/${id}`);
}
