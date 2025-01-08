import adminApi from "@/utils/http/admin-api";
import User from "@/models/User";

export async function getUsers(search: string): Promise<User[]> {
  const response = await adminApi.get(`users?search=${search}`);

  return response.data;
}

export async function getUserById(userId: number): Promise<User> {
  const response = await adminApi.get(`/users/${userId}`);
  return response.data;
}

export const createUser = async (user: User) => {
  const response = await adminApi.post("/users", user);
  return response.data;
};

export const updateUser = async (userId: number, user: User) => {
  const response = await adminApi.put(`/users/${userId}`, user);
  return response.data;
};

export const deleteById = async (userId: number) => {
  await adminApi.delete(`/users/${userId}`);
};
