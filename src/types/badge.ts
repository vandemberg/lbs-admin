// Tipos de badges
export const BADGE_TYPES = {
  VIDEOS_COMPLETED: 'videos_completed',
  COURSES_COMPLETED: 'courses_completed',
  HOURS_WATCHED: 'hours_watched',
  COMMENTS_MADE: 'comments_made',
  RATINGS_GIVEN: 'ratings_given',
  COMMUNITY_POSTS: 'community_posts',
} as const;

export const BADGE_TYPE_LABELS: Record<string, string> = {
  [BADGE_TYPES.VIDEOS_COMPLETED]: 'Vídeos Concluídos',
  [BADGE_TYPES.COURSES_COMPLETED]: 'Cursos Concluídos',
  [BADGE_TYPES.HOURS_WATCHED]: 'Horas Assistidas',
  [BADGE_TYPES.COMMENTS_MADE]: 'Comentários Realizados',
  [BADGE_TYPES.RATINGS_GIVEN]: 'Avaliações Realizadas',
  [BADGE_TYPES.COMMUNITY_POSTS]: 'Postagens na Comunidade',
};

// Cores disponíveis (limitadas)
export const BADGE_COLORS = {
  PRIMARY: '#8E2DE2',
  SECONDARY: '#4A00E0',
  YELLOW: '#FFD700',
  BLUE: '#3B82F6',
  GREEN: '#10B981',
  RED: '#EF4444',
  PURPLE: '#A855F7',
  ORANGE: '#F97316',
} as const;

export const BADGE_COLOR_OPTIONS = [
  { value: BADGE_COLORS.PRIMARY, label: 'Roxo Primário' },
  { value: BADGE_COLORS.SECONDARY, label: 'Roxo Secundário' },
  { value: BADGE_COLORS.YELLOW, label: 'Amarelo' },
  { value: BADGE_COLORS.BLUE, label: 'Azul' },
  { value: BADGE_COLORS.GREEN, label: 'Verde' },
  { value: BADGE_COLORS.RED, label: 'Vermelho' },
  { value: BADGE_COLORS.PURPLE, label: 'Roxo' },
  { value: BADGE_COLORS.ORANGE, label: 'Laranja' },
];

export interface Badge {
  id: number;
  platform_id: number;
  type: string;
  title: string;
  icon?: string;
  color: string;
  threshold: number;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BadgeForm {
  title: string;
  type: string;
  icon?: string;
  color: string;
  threshold: number;
  description?: string;
  is_active?: boolean;
}

