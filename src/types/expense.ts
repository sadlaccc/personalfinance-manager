export type ExpenseCategory = 
  | 'housing' 
  | 'utilities' 
  | 'food' 
  | 'transportation' 
  | 'healthcare' 
  | 'entertainment' 
  | 'shopping' 
  | 'debt' 
  | 'savings' 
  | 'other';

export type Frequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly' | 'one-time';

export interface Expense {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  category: ExpenseCategory;
  frequency: Frequency;
  date: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseStats {
  totalMonthly: number;
  totalYearly: number;
  byCategory: Record<ExpenseCategory, number>;
  expenseCount: number;
}

export const expenseCategoryLabels: Record<ExpenseCategory, string> = {
  housing: 'Housing',
  utilities: 'Utilities',
  food: 'Food & Dining',
  transportation: 'Transportation',
  healthcare: 'Healthcare',
  entertainment: 'Entertainment',
  shopping: 'Shopping',
  debt: 'Debt Payments',
  savings: 'Savings',
  other: 'Other',
};

export const expenseCategoryColors: Record<ExpenseCategory, string> = {
  housing: 'bg-rose-500',
  utilities: 'bg-amber-500',
  food: 'bg-orange-500',
  transportation: 'bg-sky-500',
  healthcare: 'bg-pink-500',
  entertainment: 'bg-violet-500',
  shopping: 'bg-indigo-500',
  debt: 'bg-red-600',
  savings: 'bg-emerald-500',
  other: 'bg-slate-500',
};

export const frequencyMultipliers: Record<Frequency, number> = {
  'monthly': 1,
  'weekly': 4.33,
  'biweekly': 2.17,
  'quarterly': 1/3,
  'yearly': 1/12,
  'one-time': 0,
};
