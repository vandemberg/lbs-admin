export interface FAQ {
  id: number;
  category_id: number;
  platform_id?: number | null;
  question: string;
  answer: string;
  is_faq: boolean;
  views_count?: number;
  created_at?: string;
  updated_at?: string;
  category?: HelpCategory;
  platform?: {
    id: number;
    name: string;
    slug: string;
    brand?: string;
  };
}

export interface FAQForm {
  category_id: number;
  question: string;
  answer: string;
  is_faq?: boolean;
  platform_id?: number | null;
}

export interface HelpCategory {
  id: number;
  name: string;
  slug: string;
  icon?: string | null;
  description?: string | null;
  platform_id?: number | null;
  articles_count?: number;
  created_at?: string;
  updated_at?: string;
  platform?: {
    id: number;
    name: string;
    slug: string;
    brand?: string;
  };
}

export interface HelpCategoryForm {
  name: string;
  slug?: string;
  icon?: string | null;
  description?: string | null;
  platform_id?: number | null;
}

