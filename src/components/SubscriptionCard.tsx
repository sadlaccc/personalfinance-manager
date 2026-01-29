import { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Sparkles, Zap, Calendar, Phone, ArrowRight, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSubscription, PLAN_PRICES } from '@/hooks/useSubscription';
import { UpgradeDialog } from './UpgradeDialog';

const planIcons: Record<string, typeof Zap> = {
  starter: Zap,
  plus: TrendingUp,
  pro: Sparkles,
  premium: Crown,
};

const planColors: Record<string, string> = {
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

  const PlanIcon = planIcons[currentPlan] || Zap;
  const planColor = planColors[currentPlan] || planColors.starter;
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
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                    <span className="text-xs text-muted-foreground">Billing</span>
                    <p className="font-medium text-sm">Monthly</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                    <span className="text-xs text-muted-foreground">Next Payment</span>
                    <p className="font-medium text-sm flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(subscription.current_period_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                {subscription.mpesa_phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 rounded-lg bg-muted/30">
                    <Phone className="w-4 h-4" />
                    <span>M-Pesa: {subscription.mpesa_phone}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Period progress</span>
                    <span className="font-medium text-primary">{daysRemaining} days left</span>
                  </div>
                  <Progress value={periodProgress} className="h-2" />
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
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
                    <p className="text-xl font-bold text-primary">KSh {PLAN_PRICES.pro}</p>
                    <p className="text-xs text-muted-foreground mt-1">Pro / month</p>
                  </div>
                  <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 text-center">
                    <p className="text-xl font-bold text-accent">KSh {PLAN_PRICES.premium}</p>
                    <p className="text-xs text-muted-foreground mt-1">Premium / month</p>
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