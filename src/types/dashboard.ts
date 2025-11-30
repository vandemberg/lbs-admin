export type DashboardPeriod = "7d" | "30d" | "month" | "all";

export interface DashboardSummary {
  averageWatchMinutes: number;
  completionRate: number;
  positiveReactions: number;
  totalStudents: number;
}

export interface EngagementPoint {
  date: string;
  count: number;
}

export interface TopStudent {
  userId: number;
  name: string;
  completedVideos: number;
  totalVideos: number;
  progressPercent: number;
  completedLabel: string;
}

export interface RatingDistribution {
  stars: number;
  count: number;
  percentage: number;
}

export interface DashboardRatings {
  average: number;
  totalReviews: number;
  distribution: RatingDistribution[];
}

export interface DashboardResponse {
  period: DashboardPeriod;
  summary: DashboardSummary;
  engagement: EngagementPoint[];
  topStudents: TopStudent[];
  ratings: DashboardRatings;
}

