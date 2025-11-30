export interface Platform {
  id: number;
  name: string;
  slug: string;
  brand: string;
}

export interface PlatformResponse {
  platforms: Platform[];
  current_platform_id: number | null;
  current_platform: Platform | null;
  show_selector: boolean;
}

export interface SwitchPlatformResponse {
  success: boolean;
  message: string;
  access_token: string;
  platform: Platform;
  platform_id: number;
}

