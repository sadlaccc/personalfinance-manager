import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: 'starter' | 'plus' | 'pro' | 'premium';
  billing_cycle: 'monthly' | 'annual';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  current_period_start: string;
  current_period_end: string;
  trial_ends_at: string | null;
  mpesa_phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlanPricing {
  monthly: number;
  annual: number;
}

export const PLAN_PRICES: Record<string, PlanPricing> = {
  starter: { monthly: 49, annual: 470 },
  plus: { monthly: 149, annual: 1430 },
  pro: { monthly: 299, annual: 2870 },
  premium: { monthly: 499, annual: 4790 },
};

export function useSubscription() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: subscription, isLoading } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as Subscription | null;
    },
    enabled: !!user,
  });

  const initiateMpesaPayment = useMutation({
    mutationFn: async ({
      phone,
      planType,
      billingCycle,
    }: {
      phone: string;
      planType: 'starter' | 'plus' | 'pro' | 'premium';
      billingCycle: 'monthly' | 'annual';
    }) => {
      const amount = PLAN_PRICES[planType][billingCycle];
      
      if (amount === 0) {
        // Free plan - create subscription directly
        const now = new Date();
        const periodEnd = new Date(now);
        periodEnd.setFullYear(periodEnd.getFullYear() + 100); // "Forever"
        
        const { error } = await supabase.from('subscriptions').upsert({
          user_id: user!.id,
          plan_type: planType,
          billing_cycle: billingCycle,
          status: 'active',
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString(),
        }, { onConflict: 'user_id' });

        if (error) throw error;
        return { success: true, message: 'Starter plan activated!' };
      }

      const { data, error } = await supabase.functions.invoke('mpesa-stk-push', {
        body: { phone, amount, planType, billingCycle },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);
      
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Payment initiated! Check your phone.');
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to initiate payment');
    },
  });

  const currentPlan = subscription?.plan_type || 'starter';
  const isActive = subscription?.status === 'active';
  const daysRemaining = subscription?.current_period_end
    ? Math.max(0, Math.ceil((new Date(subscription.current_period_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return {
    subscription,
    isLoading,
    currentPlan,
    isActive,
    daysRemaining,
    initiateMpesaPayment,
  };
}
