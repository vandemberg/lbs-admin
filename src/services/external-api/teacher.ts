import { externalApi } from '@/lib/axios';
export const lbsTeacher = {
  fetchTeachers: async () => {
    const { data } = await externalApi.get('/teachers');
    return data;
  },
  fetchTeacher: async (id: number) => {
    const { data } = await externalApi.get(`/teachers/${id}`);
    return data;
  },
  createTeacher: async (formData: FormData) => {
    const { data } = await externalApi.post('/teachers', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
  updateTeacher: async (id: number, formData: FormData) => {
    const { data } = await externalApi.post(`/teachers/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
  deleteTeacher: async (id: number) => {
    const { data } = await externalApi.delete(`/teachers/${id}`);
    return data;
  },
};
