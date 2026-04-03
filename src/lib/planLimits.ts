export interface PlanLimits {
  incomeSources: number;
  expenseCategories: number;
  savingsGoals: number;
  weeklyReports: boolean;
  analytics: boolean;
  exportCsv: boolean;
  exportPdf: boolean;
  exportExcel: boolean;
  maxUsers: number;
  teamDashboard: boolean;
  teamAnalytics: boolean;
  roleManagement: boolean;
  companySettings: boolean;
  apiAccess: boolean;
  dedicatedSupport: boolean;
  ssoSecurity: boolean;
  customIntegrations: boolean;
  isBusinessPlan: boolean;
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
    maxUsers: 1,
    teamDashboard: false,
    teamAnalytics: false,
    roleManagement: false,
    companySettings: false,
    apiAccess: false,
    dedicatedSupport: false,
    ssoSecurity: false,
    customIntegrations: false,
    isBusinessPlan: false,
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
    maxUsers: 1,
    teamDashboard: false,
    teamAnalytics: false,
    roleManagement: false,
    companySettings: false,
    apiAccess: false,
    dedicatedSupport: false,
    ssoSecurity: false,
    customIntegrations: false,
    isBusinessPlan: false,
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
    maxUsers: 1,
    teamDashboard: false,
    teamAnalytics: false,
    roleManagement: false,
    companySettings: false,
    apiAccess: false,
    dedicatedSupport: false,
    ssoSecurity: false,
    customIntegrations: false,
    isBusinessPlan: false,
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
    maxUsers: 1,
    teamDashboard: false,
    teamAnalytics: false,
    roleManagement: false,
    companySettings: false,
    apiAccess: false,
    dedicatedSupport: false,
    ssoSecurity: false,
    customIntegrations: false,
    isBusinessPlan: false,
  },
  team: {
    incomeSources: Infinity,
    expenseCategories: Infinity,
    savingsGoals: Infinity,
    weeklyReports: true,
    analytics: true,
    exportCsv: true,
    exportPdf: true,
    exportExcel: true,
    maxUsers: 1,
    teamDashboard: true,
    teamAnalytics: true,
    roleManagement: true,
    companySettings: true,
    apiAccess: false,
    dedicatedSupport: false,
    ssoSecurity: false,
    customIntegrations: false,
    isBusinessPlan: true,
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
    maxUsers: 3,
    teamDashboard: true,
    teamAnalytics: true,
    roleManagement: true,
    companySettings: true,
    apiAccess: true,
    dedicatedSupport: true,
    ssoSecurity: false,
    customIntegrations: false,
    isBusinessPlan: true,
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
    maxUsers: Infinity,
    teamDashboard: true,
    teamAnalytics: true,
    roleManagement: true,
    companySettings: true,
    apiAccess: true,
    dedicatedSupport: true,
    ssoSecurity: true,
    customIntegrations: true,
    isBusinessPlan: true,
  },
};

export function getPlanLimits(planType: string): PlanLimits {
  return PLAN_LIMITS[planType] || PLAN_LIMITS.starter;
}

export function formatLimit(limit: number): string {
  return limit === Infinity ? 'Unlimited' : String(limit);
}

export function isBusinessPlan(planType: string): boolean {
  return PLAN_LIMITS[planType]?.isBusinessPlan ?? false;
}
