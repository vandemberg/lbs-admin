import { QueryClient } from "@tanstack/react-query";

const SLATE_TIMEOUT_IN_MILLISECONDS = 1000 * 60 * 5; // 5 minutes

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: SLATE_TIMEOUT_IN_MILLISECONDS,
    },
  },
});
