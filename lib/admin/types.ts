export type AdminRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "CONTENT_ADMIN"
  | "MODERATOR"
  | "ANALYST"
  | "ASPIRANT"
  | "USER";

export interface AdminUserSession {
  userId: string;
  email: string;
  displayName: string;
  role: AdminRole;
  isSuperAdmin: boolean;
  canManageUsers: boolean;
  canManageContent: boolean;
  canManageGames: boolean;
  canManageSystem: boolean;
}

export interface PlatformLiveStats {
  liveNow: number;
  activeToday: number;
  newUsersToday: number;
  totalStudyHours: number;
  pyqsAttemptedToday: number;
  revisionsDoneToday: number;
  mockTestsActive: number;
  chillZoneActivePlayers: number;
  platformHealthPercent: number;
  healthStatus: "EXCELLENT" | "OPTIMAL" | "ATTENTION_REQUIRED" | "DEGRADED";
  dbLatencyMs: number;
}

export interface ActivityEvent {
  id: string;
  userId?: string;
  displayName: string;
  eventType: "PYQ_SOLVED" | "TEST_COMPLETED" | "MAINS_DRAFTED" | "CHILL_GAME" | "USER_SIGNUP" | "REVISION_COMPLETED";
  description: string;
  timestamp: string;
  stateLocation?: string;
}

export interface AdminAuditRecord {
  id: string;
  adminId: string;
  adminEmail: string;
  adminRole: AdminRole;
  action: string;
  targetType: "USER" | "PYQ" | "SCORE" | "FLAG" | "MAINTENANCE" | "BROADCAST" | "SETTING";
  targetId?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface UserAdminSummary {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole | "USER";
  accountStatus: "ACTIVE" | "SUSPENDED" | "FLAGGED";
  joinedAt: string;
  lastActiveAt: string;
  totalStudyHours: number;
  pyqsSolved: number;
  pyqAccuracy: number;
  testsTaken: number;
  mainsDraftsCount: number;
  revisionsPending: number;
  chillGamesCount: number;
}

export interface FeatureFlagItem {
  id: string;
  key: string;
  name: string;
  description: string;
  isEnabled: boolean;
  isBeta: boolean;
  targetAudience: "ALL" | "BETA_TESTERS" | "ADMINS_ONLY";
  updatedAt: string;
}

export interface MaintenanceConfig {
  isActive: boolean;
  title: string;
  message: string;
  estimatedEndTime?: string;
  allowAdminBypass: boolean;
  updatedAt: string;
}

export interface QuestionDraft {
  id: string;
  subject: string;
  topic: string;
  year: number;
  status: "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED";
  question: string;
  options: { id: string; text: string }[];
  answer: string;
  explanation: string;
  difficulty: "Easy" | "Moderate" | "High";
  validationErrors?: string[];
  createdAt: string;
  updatedAt: string;
}
