export type IncomeCategory = 
  | 'salary' 
  | 'freelance' 
  | 'investment' 
  | 'rental' 
  | 'business' 
  | 'other';

export interface IncomeSource {
  id: string;
  name: string;
  amount: number;
  category: IncomeCategory;
  frequency: 'monthly' | 'weekly' | 'biweekly' | 'yearly' | 'one-time';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IncomeStats {
  totalMonthly: number;
  totalYearly: number;
  byCategory: Record<IncomeCategory, number>;
  sourceCount: number;
}

export const categoryLabels: Record<IncomeCategory, string> = {
  salary: 'Salary',
  freelance: 'Freelance',
  investment: 'Investment',
  rental: 'Rental',
  business: 'Business',
  other: 'Other',
};

export const categoryColors: Record<IncomeCategory, string> = {
  salary: 'bg-category-salary',
  freelance: 'bg-category-freelance',
  investment: 'bg-category-investment',
  rental: 'bg-category-rental',
  business: 'bg-category-business',
  other: 'bg-category-other',
};

export const frequencyMultipliers: Record<IncomeSource['frequency'], number> = {
  'monthly': 1,
  'weekly': 4.33,
  'biweekly': 2.17,
  'yearly': 1/12,
  'one-time': 0,
};
