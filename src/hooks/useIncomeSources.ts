import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useMemo } from 'react';
import { IncomeCategory } from '@/types/income';
import { Frequency } from '@/types/expense';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { useSubscription } from '@/hooks/useSubscription';
import { getPlanLimits } from '@/lib/planLimits';

export interface IncomeSource {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  category: IncomeCategory;
  frequency: Frequency;
  description?: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface IncomeStats {
  totalMonthly: number;
  totalYearly: number;
  byCategory: Record<IncomeCategory, number>;
  sourceCount: number;
}

interface UseIncomeSourcesOptions {
  month?: number; // 0-11
  year?: number;
}

export function useIncomeSources(options?: UseIncomeSourcesOptions) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Default to current month/year if not specified
  const now = new Date();
  const selectedMonth = options?.month ?? now.getMonth();
  const selectedYear = options?.year ?? now.getFullYear();

  const { data: incomeSources = [], isLoading } = useQuery({
    queryKey: ['income-sources', user?.id, selectedMonth, selectedYear],
    queryFn: async () => {
      if (!user) return [];
      
      // Calculate date range for the selected month
      const monthStart = startOfMonth(new Date(selectedYear, selectedMonth));
      const monthEnd = endOfMonth(new Date(selectedYear, selectedMonth));
      
      const { data, error } = await supabase
        .from('income_sources')
        .select('*')
        .gte('date', format(monthStart, 'yyyy-MM-dd'))
        .lte('date', format(monthEnd, 'yyyy-MM-dd'))
        .order('date', { ascending: false });

      if (error) throw error;
      return data as IncomeSource[];
    },
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: async (source: Omit<IncomeSource, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('income_sources')
        .insert({
          ...source,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income-sources'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Omit<IncomeSource, 'id' | 'user_id' | 'created_at'>> }) => {
      const { data, error } = await supabase
        .from('income_sources')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income-sources'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('income_sources')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income-sources'] });
    },
  });

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

    // Calculate all income at full amount for the month
    incomeSources.forEach(source => {
      totalMonthly += source.amount;
      byCategory[source.category] += source.amount;
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
    isLoading,
    selectedMonth,
    selectedYear,
    addIncomeSource: addMutation.mutateAsync,
    updateIncomeSource: (id: string, updates: Partial<Omit<IncomeSource, 'id' | 'user_id' | 'created_at'>>) => 
      updateMutation.mutateAsync({ id, updates }),
    deleteIncomeSource: deleteMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
