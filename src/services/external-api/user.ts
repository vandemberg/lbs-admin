import { externalApi } from "@/lib/axios";
import { User } from "@/types/user";

export async function fetchUsers(): Promise<User[]> {
  const response = await externalApi.get<User[]>("/users");
  return response.data;
}

export async function registerUser(user: User): Promise<User> {
  const payload = {
    name: user.name,
    email: user.email,
    password: user.password,
    password_confirmation: user.passwordVerify,
    role: user.role,
  };

  const response = await externalApi.post<User>("/users", payload);
  return response.data;
}

export async function updateUser(user: User): Promise<User> {
  const payload = {
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const response = await externalApi.put<User>(`/users/${user.id}`, payload);
  return response.data;
}

export async function updateUserPassword(user: User): Promise<void> {
  const payload = {
    password: user.password,
    password_confirmation: user.passwordVerify,
  };

  await externalApi.put(`/users/${user.id}`, payload);
}

export async function deleteUser(userId: number): Promise<void> {
  await externalApi.delete(`/users/${userId}`);
}
