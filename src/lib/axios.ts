"use client";

import axios from "axios";

export const externalApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_EXTERNAL_API_URL}/api/admin`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

externalApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
