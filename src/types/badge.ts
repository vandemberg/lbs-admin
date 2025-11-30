export interface Badge {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  image?: string;
  color?: string;
  criteria?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BadgeForm {
  name: string;
  description?: string;
  icon?: string;
  image?: string;
  color?: string;
  criteria?: string;
}

