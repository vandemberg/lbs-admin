import { api } from "@/lib/axios";

export const login = async (email: string, password: string) => {
  const response = await api.post("/login", { email, password });
  return response.data;
};
