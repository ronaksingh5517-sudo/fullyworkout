// lib/planConfig.js

export const PLAN_CONFIG = {
  free: {
    name: "Free",
    ads: true,

    foodScansPerDay: 1,
    bodyScansPerDay: 1,
    aiChatsPerDay: 5,

    analytics: false,
    personalCoach: false,
    proAnalytics: false,
    vipAnalytics: false,
    seasonalChallenges: false,
    earlyAiAccess: false,
  },

  weekly: {
    name: "Weekly",
    ads: false,

    foodScansPerDay: 5,
    bodyScansPerDay: 3,
    aiChatsPerDay: 20,

    analytics: true,
    personalCoach: true,
    proAnalytics: false,
    vipAnalytics: false,
    seasonalChallenges: false,
    earlyAiAccess: false,
  },

  monthly: {
    name: "Monthly",
    ads: false,

    foodScansPerDay: 10,
    bodyScansPerDay: 5,
    aiChatsPerDay: 30,

    analytics: true,
    personalCoach: true,
    proAnalytics: true,
    vipAnalytics: false,
    seasonalChallenges: false,
    earlyAiAccess: false,
  },

  yearly: {
    name: "Yearly",
    ads: false,

    foodScansPerDay: 50,
    bodyScansPerDay: 10,
    aiChatsPerDay: 100,

    analytics: true,
    personalCoach: true,
    proAnalytics: true,
    vipAnalytics: true,
    seasonalChallenges: true,
    earlyAiAccess: true,
  },
};

export function getPlanConfig(plan) {
  const normalizedPlan = String(plan || "free").toLowerCase();

  return PLAN_CONFIG[normalizedPlan] || PLAN_CONFIG.free;
}