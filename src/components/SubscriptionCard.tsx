import { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Sparkles, Zap, Calendar, Phone, ArrowRight, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSubscription, PLAN_PRICES, BILLING_CYCLE_LABELS, BillingCycle } from '@/hooks/useSubscription';
import { UpgradeDialog } from './UpgradeDialog';

const planIcons = {
  starter: Zap,
  plus: TrendingUp,
  pro: Sparkles,
  premium: Crown,
};

const planColors = {
  starter: 'bg-muted text-muted-foreground',
  plus: 'bg-ticket/10 text-ticket',
  pro: 'bg-primary/10 text-primary',
  premium: 'bg-accent/10 text-accent',
};

export function SubscriptionCard() {
  const { subscription, isLoading, currentPlan, isActive, daysRemaining } = useSubscription();
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="h-8 bg-muted rounded w-1/2" />
            <div className="h-2 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const PlanIcon = planIcons[currentPlan as keyof typeof planIcons] || Zap;
  const planColor = planColors[currentPlan as keyof typeof planColors] || planColors.starter;
  const periodProgress = subscription?.current_period_end
    ? Math.min(100, ((30 - daysRemaining) / 30) * 100)
    : 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="glass-card overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Your Plan</CardTitle>
              <Badge variant="secondary" className={planColor}>
                <PlanIcon className="w-3 h-3 mr-1" />
                {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscription && isActive ? (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Billing cycle</span>
                    <span className="font-medium">{BILLING_CYCLE_LABELS[subscription.billing_cycle as BillingCycle] || subscription.billing_cycle}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Next payment</span>
                    <span className="font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(subscription.current_period_end).toLocaleDateString()}
                    </span>
                  </div>
                  {subscription.mpesa_phone && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">M-Pesa</span>
                      <span className="font-medium flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {subscription.mpesa_phone}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Period progress</span>
                    <span className="text-muted-foreground">{daysRemaining} days left</span>
                  </div>
                  <Progress value={periodProgress} className="h-1.5" />
                </div>

                {currentPlan !== 'premium' && (
                  <Button 
                    onClick={() => setUpgradeOpen(true)} 
                    className="w-full group"
                    variant="outline"
                  >
                    Upgrade Plan
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  You're on the free Starter plan. Upgrade to unlock advanced features.
                </p>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-lg font-bold text-primary">KSh {PLAN_PRICES.pro['1_month']}</p>
                    <p className="text-xs text-muted-foreground">Pro/month</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-lg font-bold text-accent">KSh {PLAN_PRICES.premium['1_month']}</p>
                    <p className="text-xs text-muted-foreground">Premium/month</p>
                  </div>
                </div>
                <Button 
                  onClick={() => setUpgradeOpen(true)} 
                  className="w-full"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Upgrade Now
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <UpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </>
  );
}
