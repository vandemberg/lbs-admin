import { externalApi } from "@/lib/axios";

export const login = async (email: string, password: string) => {
  const payload = { email, password };
  const response = await externalApi.post("/login", payload);

  return response.data;
};

export const logout = async () => {
  const response = await externalApi.post("/logout", {});
  return response.data;
};
