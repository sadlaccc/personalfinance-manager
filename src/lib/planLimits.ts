// Plan-based feature limits
// These limits are enforced client-side and match the pricing page

export interface PlanLimits {
  incomeSources: number;       // total income sources allowed
  expenseCategories: number;   // unique expense categories allowed
  savingsGoals: number;        // total savings goals allowed
  weeklyReports: boolean;
  analytics: boolean;
  exportCsv: boolean;
  exportPdf: boolean;
  exportExcel: boolean;
}

export const PLAN_LIMITS: Record<string, PlanLimits> = {
  starter: {
    incomeSources: 1,
    expenseCategories: 5,
    savingsGoals: 0,
    weeklyReports: false,
    analytics: false,
    exportCsv: false,
    exportPdf: false,
    exportExcel: false,
  },
  plus: {
    incomeSources: 5,
    expenseCategories: 15,
    savingsGoals: 3,
    weeklyReports: true,
    analytics: true,
    exportCsv: true,
    exportPdf: false,
    exportExcel: false,
  },
  pro: {
    incomeSources: Infinity,
    expenseCategories: Infinity,
    savingsGoals: Infinity,
    weeklyReports: true,
    analytics: true,
    exportCsv: true,
    exportPdf: true,
    exportExcel: false,
  },
  premium: {
    incomeSources: Infinity,
    expenseCategories: Infinity,
    savingsGoals: Infinity,
    weeklyReports: true,
    analytics: true,
    exportCsv: true,
    exportPdf: true,
    exportExcel: true,
  },
  // Business plans get unlimited everything
  team: {
    incomeSources: Infinity,
    expenseCategories: Infinity,
    savingsGoals: Infinity,
    weeklyReports: true,
    analytics: true,
    exportCsv: true,
    exportPdf: true,
    exportExcel: true,
  },
  business: {
    incomeSources: Infinity,
    expenseCategories: Infinity,
    savingsGoals: Infinity,
    weeklyReports: true,
    analytics: true,
    exportCsv: true,
    exportPdf: true,
    exportExcel: true,
  },
  enterprise: {
    incomeSources: Infinity,
    expenseCategories: Infinity,
    savingsGoals: Infinity,
    weeklyReports: true,
    analytics: true,
    exportCsv: true,
    exportPdf: true,
    exportExcel: true,
  },
};

export function getPlanLimits(planType: string): PlanLimits {
  return PLAN_LIMITS[planType] || PLAN_LIMITS.starter;
}

export function formatLimit(limit: number): string {
  return limit === Infinity ? 'Unlimited' : String(limit);
}
