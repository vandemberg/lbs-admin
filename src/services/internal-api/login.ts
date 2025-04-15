import { internalApi } from "@/lib/axios";

interface LoginInput {
  email: string;
  password: string;
}

export const login = async function ({ email, password }: LoginInput) {
  const response = await internalApi.post("auth/login", {
    email,
    password,
  });

  return response.data;
};
