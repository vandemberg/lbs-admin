import axios from "axios";

export const externalApi = axios.create({
  baseURL: `${process.env.NEXT_API_URL}/api/admin`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const internalApi = axios.create({
  baseURL: `/api`,
  headers: {
    "Content-Type": "application/json",
  },
});
