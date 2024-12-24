import adminApi from '@/utils/http/admin-api';

export async function login(email: string, password: string) {
  const response = await adminApi.post('/login', {
    email,
    password
  });
  
  return response.data;
}
