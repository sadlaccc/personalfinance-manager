import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UserExpense {
  id: string;
  name: string;
  amount: number;
  category: string;
  frequency: string;
  date: string;
  created_at: string;
}

export interface UserIncome {
  id: string;
  name: string;
  amount: number;
  category: string;
  frequency: string;
  created_at: string;
}

export function useAdminUserFinancials(userId: string | null) {
  const expensesQuery = useQuery({
    queryKey: ['admin-user-expenses', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching user expenses:', error);
        throw error;
      }

      return data as UserExpense[];
    },
    enabled: !!userId,
  });

  const incomeQuery = useQuery({
    queryKey: ['admin-user-income', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('income_sources')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user income:', error);
        throw error;
      }

      return data as UserIncome[];
    },
    enabled: !!userId,
  });

  return {
    expenses: expensesQuery.data || [],
    income: incomeQuery.data || [],
    isLoading: expensesQuery.isLoading || incomeQuery.isLoading,
  };
}
