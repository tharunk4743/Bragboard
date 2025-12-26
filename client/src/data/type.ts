export enum UserRole {
  ADMIN = "ADMIN",
  EMPLOYEE = "EMPLOYEE",
}

export type ShoutoutCategory =
  | "Innovation"
  | "Teamwork"
  | "Customer Success"
  | "Leadership"
  | "Reliability";

export type CoreSkill =
  | "Problem Solving"
  | "Communication"
  | "Technical Excellence"
  | "Creative Thinking"
  | "Mentorship"
  | "Collaboration";

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  icon: string;
  category: "Wellness" | "Career" | "Social";
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  avatarUrl?: string;
  department?: string;
  createdAt: string;
  badges?: string[];
  points: number;
  skills: Record<string, number>;
}

export interface Comment {
  id: string;
  shoutoutId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface Shoutout {
  id: string;
  title: string;
  description: string;
  category: ShoutoutCategory;
  skills: CoreSkill[];
  creatorId: string;
  recipientIds: string[];
  recipients: User[];
  comments: Comment[];
  cheers: string[];
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface LeaderboardEntry {
  userId: string;
  fullName: string;
  avatarUrl?: string;
  shoutoutCount: number;
  cheerCount: number;
  points: number;
  rank: number;
  topSkill?: string;
  lastActivity?: string;
  badge?: "gold" | "silver" | "bronze" | "none";
}

export interface CulturePulse {
  summary: string;
  topValue: ShoutoutCategory;
  moraleScore: number;
}

export interface Notification {
  id: string;
  userId: string;
  actorId?: string | null;
  title?: string | null;
  content?: string | null;
  relatedType?: string | null;
  relatedId?: string | number | null;
  isRead: boolean;
  createdAt: string;
} 
