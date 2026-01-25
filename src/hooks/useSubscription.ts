import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: 'starter' | 'plus' | 'pro' | 'premium';
  billing_cycle: '1_month' | '2_months' | '6_months' | '1_year' | '2_years';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  current_period_start: string;
  current_period_end: string;
  trial_ends_at: string | null;
  mpesa_phone: string | null;
  created_at: string;
  updated_at: string;
}

export type BillingCycle = '1_month' | '2_months' | '6_months' | '1_year' | '2_years';

export interface PlanPricing {
  '1_month': number;
  '2_months': number;
  '6_months': number;
  '1_year': number;
  '2_years': number;
}

export const BILLING_CYCLE_LABELS: Record<BillingCycle, string> = {
  '1_month': '1 Month',
  '2_months': '2 Months',
  '6_months': '6 Months',
  '1_year': '1 Year',
  '2_years': '2 Years',
};

export const BILLING_CYCLE_MONTHS: Record<BillingCycle, number> = {
  '1_month': 1,
  '2_months': 2,
  '6_months': 6,
  '1_year': 12,
  '2_years': 24,
};

// Prices with discounts: 2mo (5%), 6mo (10%), 1yr (20%), 2yr (30%)
export const PLAN_PRICES: Record<string, PlanPricing> = {
  starter: {
    '1_month': 49,
    '2_months': 93,      // 49*2 * 0.95
    '6_months': 265,     // 49*6 * 0.90
    '1_year': 470,       // 49*12 * 0.80
    '2_years': 823,      // 49*24 * 0.70
  },
  plus: {
    '1_month': 149,
    '2_months': 283,     // 149*2 * 0.95
    '6_months': 805,     // 149*6 * 0.90
    '1_year': 1430,      // 149*12 * 0.80
    '2_years': 2503,     // 149*24 * 0.70
  },
  pro: {
    '1_month': 299,
    '2_months': 568,     // 299*2 * 0.95
    '6_months': 1615,    // 299*6 * 0.90
    '1_year': 2870,      // 299*12 * 0.80
    '2_years': 5023,     // 299*24 * 0.70
  },
  premium: {
    '1_month': 499,
    '2_months': 948,     // 499*2 * 0.95
    '6_months': 2695,    // 499*6 * 0.90
    '1_year': 4790,      // 499*12 * 0.80
    '2_years': 8383,     // 499*24 * 0.70
  },
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
      billingCycle: BillingCycle;
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
