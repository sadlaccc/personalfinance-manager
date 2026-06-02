import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useMemo } from 'react';
import { Expense, ExpenseCategory, ExpenseStats } from '@/types/expense';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { useSubscription } from '@/hooks/useSubscription';
import { getPlanLimits } from '@/lib/planLimits';

interface UseExpensesOptions {
  month?: number; // 0-11
  year?: number;
}

export function useExpenses(options?: UseExpensesOptions) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { currentPlan } = useSubscription();
  const limits = getPlanLimits(currentPlan);
  
  // Default to current month/year if not specified
  const now = new Date();
  const selectedMonth = options?.month ?? now.getMonth();
  const selectedYear = options?.year ?? now.getFullYear();

  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ['expenses', user?.id, selectedMonth, selectedYear],
    queryFn: async () => {
      if (!user) return [];
      
      // Calculate date range for the selected month
      const monthStart = startOfMonth(new Date(selectedYear, selectedMonth));
      const monthEnd = endOfMonth(new Date(selectedYear, selectedMonth));
      
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', format(monthStart, 'yyyy-MM-dd'))
        .lte('date', format(monthEnd, 'yyyy-MM-dd'))
        .order('date', { ascending: false });

      if (error) throw error;
      return data as Expense[];
    },
    enabled: !!user,
  });

  // Count unique categories used by this user (for category limit enforcement)
  const usedCategories = useMemo(() => {
    const cats = new Set(expenses.map(e => e.category));
    return cats;
  }, [expenses]);

  const addMutation = useMutation({
    mutationFn: async (expense: Omit<Expense, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');
      
      // Check category limit if this is a new category
      if (!usedCategories.has(expense.category) && usedCategories.size >= limits.expenseCategories) {
        throw new Error(
          `Your ${currentPlan} plan allows only ${limits.expenseCategories} expense categories. Upgrade your plan to use more categories.`
        );
      }
      
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          ...expense,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Omit<Expense, 'id' | 'user_id' | 'created_at'>> }) => {
      if (!user) throw new Error('User not authenticated');
      const { data, error } = await supabase
        .from('expenses')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('User not authenticated');
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  const stats: ExpenseStats = useMemo(() => {
    const byCategory: Record<ExpenseCategory, number> = {
      housing: 0,
      utilities: 0,
      food: 0,
      transportation: 0,
      healthcare: 0,
      entertainment: 0,
      shopping: 0,
      debt: 0,
      savings: 0,
      other: 0,
    };

    let totalMonthly = 0;

    // Calculate all expenses at full amount regardless of frequency
    expenses.forEach(expense => {
      totalMonthly += expense.amount;
      byCategory[expense.category] += expense.amount;
    });

    return {
      totalMonthly,
      totalYearly: totalMonthly * 12,
      byCategory,
      expenseCount: expenses.length,
    };
  }, [expenses]);

  return {
    expenses,
    stats,
    isLoading,
    selectedMonth,
    selectedYear,
    addExpense: addMutation.mutateAsync,
    updateExpense: (id: string, updates: Partial<Omit<Expense, 'id' | 'user_id' | 'created_at'>>) => 
      updateMutation.mutateAsync({ id, updates }),
    deleteExpense: deleteMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
