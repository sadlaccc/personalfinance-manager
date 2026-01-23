import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface BudgetGoal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  created_at: string;
  updated_at: string;
}

export interface BudgetGoalStats {
  goalCount: number;
  totalTarget: number;
  totalSaved: number;
  overallProgress: number;
  completedGoals: number;
}

export function useBudgetGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<BudgetGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGoals = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('budget_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching budget goals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [user]);

  const stats: BudgetGoalStats = useMemo(() => {
    const totalTarget = goals.reduce((sum, goal) => sum + goal.target_amount, 0);
    const totalSaved = goals.reduce((sum, goal) => sum + goal.current_amount, 0);
    const completedGoals = goals.filter(g => g.current_amount >= g.target_amount).length;
    
    return {
      goalCount: goals.length,
      totalTarget,
      totalSaved,
      overallProgress: totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0,
      completedGoals,
    };
  }, [goals]);

  const addGoal = async (goalData: Omit<BudgetGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('budget_goals')
      .insert({
        ...goalData,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    setGoals(prev => [data, ...prev]);
    return data;
  };

  const updateGoal = async (id: string, updates: Partial<Omit<BudgetGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    const { data, error } = await supabase
      .from('budget_goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    setGoals(prev => prev.map(g => g.id === id ? data : g));
    return data;
  };

  const deleteGoal = async (id: string) => {
    const { error } = await supabase
      .from('budget_goals')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const addToGoal = async (id: string, amount: number) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) throw new Error('Goal not found');
    
    return updateGoal(id, { current_amount: goal.current_amount + amount });
  };

  return {
    goals,
    stats,
    isLoading,
    addGoal,
    updateGoal,
    deleteGoal,
    addToGoal,
    refetch: fetchGoals,
  };
}
