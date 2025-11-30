import { externalApi } from "@/lib/axios";
import {
  DashboardPeriod,
  DashboardResponse,
} from "@/types/dashboard";

export async function fetchDashboardMetrics(
  period: DashboardPeriod
): Promise<DashboardResponse> {
  const response = await externalApi.get<DashboardResponse>("/dashboard", {
    params: { period },
  });

  return response.data;
}

