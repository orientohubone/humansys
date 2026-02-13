// src/config/cacheConfig.ts

export const cacheTTLs = {
  dashboardStats: process.env.NODE_ENV === "development" ? 60 * 1000 : 2 * 60 * 1000, // 1min DEV, 2min PROD
  recentActivities: process.env.NODE_ENV === "development" ? 30 * 1000 : 60 * 1000,   // 30s DEV, 1min PROD
  pendingTasks: process.env.NODE_ENV === "development" ? 2 * 60 * 1000 : 5 * 60 * 1000, // 2min DEV, 5min PROD
  trends: process.env.NODE_ENV === "development" ? 5 * 60 * 1000 : 10 * 60 * 1000,      // 5min DEV, 10min PROD
  onboarding: process.env.NODE_ENV === "development" ? 10 * 1000 : 30 * 1000,           // 10s DEV, 30s PROD
  founderRole: process.env.NODE_ENV === "development" ? 15 * 1000 : 30 * 1000,          // 15s DEV, 30s PROD
  cacheDefault: process.env.NODE_ENV === "development" ? 60 * 1000 : 3 * 60 * 1000      // 1min DEV, 3min PROD
};
