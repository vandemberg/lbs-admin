import { externalApi } from "@/lib/axios";
import { PlatformResponse, SwitchPlatformResponse } from "@/types/platform";

export async function fetchPlatforms(): Promise<PlatformResponse> {
  const response = await externalApi.get<PlatformResponse>("/platforms");
  return response.data;
}

export async function switchPlatform(
  platformId: number
): Promise<SwitchPlatformResponse> {
  const response = await externalApi.post<SwitchPlatformResponse>(
    "/platforms/switch",
    { platform_id: platformId }
  );
  return response.data;
}

