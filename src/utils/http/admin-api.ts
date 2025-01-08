import axios from 'axios';

const adminApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");

  if (token) {
    console.log("request: ", token);
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default adminApi;
