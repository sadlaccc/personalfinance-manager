import { useState, useCallback, useMemo } from 'react';
import { IncomeSource, IncomeStats, IncomeCategory, frequencyMultipliers } from '@/types/income';

const initialIncomeSources: IncomeSource[] = [
  {
    id: '1',
    name: 'Software Developer Salary',
    amount: 7500,
    category: 'salary',
    frequency: 'monthly',
    description: 'Full-time position at Tech Corp',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Freelance Web Design',
    amount: 1500,
    category: 'freelance',
    frequency: 'monthly',
    description: 'Side projects and client work',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    id: '3',
    name: 'Stock Dividends',
    amount: 350,
    category: 'investment',
    frequency: 'monthly',
    description: 'Quarterly dividends from portfolio',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: '4',
    name: 'Rental Property',
    amount: 2000,
    category: 'rental',
    frequency: 'monthly',
    description: 'Downtown apartment rental',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
];

export function useIncomeStore() {
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>(initialIncomeSources);

  const addIncomeSource = useCallback((source: Omit<IncomeSource, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSource: IncomeSource = {
      ...source,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setIncomeSources(prev => [...prev, newSource]);
  }, []);

  const updateIncomeSource = useCallback((id: string, updates: Partial<Omit<IncomeSource, 'id' | 'createdAt'>>) => {
    setIncomeSources(prev =>
      prev.map(source =>
        source.id === id
          ? { ...source, ...updates, updatedAt: new Date() }
          : source
      )
    );
  }, []);

  const deleteIncomeSource = useCallback((id: string) => {
    setIncomeSources(prev => prev.filter(source => source.id !== id));
  }, []);

  const stats: IncomeStats = useMemo(() => {
    const byCategory: Record<IncomeCategory, number> = {
      salary: 0,
      freelance: 0,
      investment: 0,
      rental: 0,
      business: 0,
      other: 0,
    };

    let totalMonthly = 0;

    incomeSources.forEach(source => {
      const monthlyAmount = source.amount * frequencyMultipliers[source.frequency];
      totalMonthly += monthlyAmount;
      byCategory[source.category] += monthlyAmount;
    });

    return {
      totalMonthly,
      totalYearly: totalMonthly * 12,
      byCategory,
      sourceCount: incomeSources.length,
    };
  }, [incomeSources]);

  return {
    incomeSources,
    stats,
    addIncomeSource,
    updateIncomeSource,
    deleteIncomeSource,
  };
}
