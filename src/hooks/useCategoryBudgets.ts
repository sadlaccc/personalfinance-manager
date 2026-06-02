import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CategoryBudget {
  id: string;
  user_id: string;
  category: string;
  budget_amount: number;
  month: number;
  year: number;
  created_at: string;
  updated_at: string;
}

export function useCategoryBudgets(month: number, year: number) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: budgets = [], isLoading } = useQuery({
    queryKey: ['category-budgets', user?.id, month, year],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('category_budgets')
        .select('*')
        .eq('user_id', user.id)
        .eq('month', month)
        .eq('year', year);

      if (error) throw error;
      return data as CategoryBudget[];
    },
    enabled: !!user,
  });

  const upsertMutation = useMutation({
    mutationFn: async ({ category, budget_amount }: { category: string; budget_amount: number }) => {
      if (!user) throw new Error('User not authenticated');

      // Check if budget exists for this category/month/year
      const { data: existing } = await supabase
        .from('category_budgets')
        .select('id')
        .eq('user_id', user.id)
        .eq('category', category)
        .eq('month', month)
        .eq('year', year)
        .maybeSingle();

      if (existing) {
        const { data, error } = await supabase
          .from('category_budgets')
          .update({ budget_amount })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('category_budgets')
          .insert({
            user_id: user.id,
            category,
            budget_amount,
            month,
            year,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category-budgets'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('User not authenticated');
      const { error } = await supabase
        .from('category_budgets')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category-budgets'] });
    },
  });

  const copyFromMonthMutation = useMutation({
    mutationFn: async ({ fromMonth, fromYear }: { fromMonth: number; fromYear: number }) => {
      if (!user) throw new Error('User not authenticated');

      // Fetch budgets from source month
      const { data: sourceBudgets, error: fetchError } = await supabase
        .from('category_budgets')
        .select('*')
        .eq('user_id', user.id)
        .eq('month', fromMonth)
        .eq('year', fromYear);

      if (fetchError) throw fetchError;
      if (!sourceBudgets || sourceBudgets.length === 0) {
        throw new Error('No budgets found in the selected month');
      }

      // Insert/update budgets for target month
      const results = await Promise.all(
        sourceBudgets.map(async (budget) => {
          const { data: existing } = await supabase
            .from('category_budgets')
            .select('id')
            .eq('user_id', user.id)
            .eq('category', budget.category)
            .eq('month', month)
            .eq('year', year)
            .maybeSingle();

          if (existing) {
            return supabase
              .from('category_budgets')
              .update({ budget_amount: budget.budget_amount })
              .eq('id', existing.id);
          } else {
            return supabase
              .from('category_budgets')
              .insert({
                user_id: user.id,
                category: budget.category,
                budget_amount: budget.budget_amount,
                month,
                year,
              });
          }
        })
      );

      const errors = results.filter(r => r.error);
      if (errors.length > 0) {
        throw new Error('Some budgets failed to copy');
      }

      return sourceBudgets.length;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category-budgets'] });
    },
  });

  const getBudgetForCategory = (category: string): number | null => {
    const budget = budgets.find(b => b.category === category);
    return budget ? budget.budget_amount : null;
  };

  return {
    budgets,
    isLoading,
    upsertBudget: upsertMutation.mutateAsync,
    deleteBudget: deleteMutation.mutateAsync,
    copyFromMonth: copyFromMonthMutation.mutateAsync,
    getBudgetForCategory,
    isUpdating: upsertMutation.isPending,
    isCopying: copyFromMonthMutation.isPending,
  };
}
