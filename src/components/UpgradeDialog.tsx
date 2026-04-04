import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, Phone, Sparkles, Zap, TrendingUp, Crown, Users, Building2, Rocket } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useSubscription, PLAN_PRICES, PLAN_LABELS } from '@/hooks/useSubscription';
import { cn } from '@/lib/utils';

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const personalPlans = [
  {
    id: 'starter',
    name: 'Starter',
    icon: Zap,
    features: ['1 income source', 'Basic expense tracking (5 categories)', 'Monthly reports'],
  },
  {
    id: 'plus',
    name: 'Plus',
    icon: TrendingUp,
    features: ['Up to 5 income sources', '15 expense categories', 'Weekly reports', '3 savings goals', 'CSV export'],
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: Sparkles,
    popular: true,
    features: ['Unlimited income sources', 'Unlimited categories', 'Advanced analytics', 'PDF & CSV export', 'Unlimited savings goals'],
  },
  {
    id: 'premium',
    name: 'Premium',
    icon: Crown,
    features: ['Everything in Pro', 'Excel export', 'AI budget forecasting', 'Custom widgets', 'Priority support'],
  },
];

const businessPlans = [
  {
    id: 'team',
    name: 'Team',
    icon: Users,
    features: ['1 user included', 'Shared team dashboard', 'Team analytics', 'Role management', 'Company settings'],
  },
  {
    id: 'business',
    name: 'Business',
    icon: Building2,
    popular: true,
    features: ['Up to 3 users', 'Advanced team reports', 'Full role management', 'API access', 'Dedicated support'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: Rocket,
    features: ['Up to 5 users', 'Custom integrations', 'SSO & advanced security', 'SLA guarantee', 'Dedicated account manager'],
  },
];

type PlanId = 'starter' | 'plus' | 'pro' | 'premium' | 'team' | 'business';

export function UpgradeDialog({ open, onOpenChange }: UpgradeDialogProps) {
  const { currentPlan, initiateMpesaPayment } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('pro');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'select' | 'payment'>('select');
  const [tab, setTab] = useState<'personal' | 'business'>('personal');

  const handlePlanSelect = (planId: string) => {
    if (planId === 'enterprise') return;
    setSelectedPlan(planId as PlanId);
  };

  const handleContinue = () => {
    if (selectedPlan === 'starter' || selectedPlan === currentPlan) {
      initiateMpesaPayment.mutate(
        { phone: '', planType: selectedPlan },
        { onSuccess: () => { onOpenChange(false); setStep('select'); } }
      );
    } else {
      setStep('payment');
    }
  };

  const handlePayment = () => {
    if (!phone.trim()) return;
    initiateMpesaPayment.mutate(
      { phone, planType: selectedPlan },
      { onSuccess: () => { onOpenChange(false); setStep('select'); setPhone(''); } }
    );
  };

  const price = PLAN_PRICES[selectedPlan];

  const renderPlanList = (plans: typeof personalPlans) => (
    <div className="grid gap-3">
      {plans.map((plan) => {
        const Icon = plan.icon;
        const planPrice = PLAN_PRICES[plan.id];
        const isSelected = selectedPlan === plan.id;
        const isCurrent = currentPlan === plan.id;
        const isEnterprise = plan.id === 'enterprise';

        return (
          <button
            key={plan.id}
            onClick={() => isEnterprise ? window.location.href = '/contact' : handlePlanSelect(plan.id)}
            disabled={isCurrent}
            className={cn(
              'relative p-4 rounded-xl border-2 text-left transition-all',
              isSelected && !isEnterprise
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50',
              isCurrent && 'opacity-50 cursor-not-allowed'
            )}
          >
            {plan.popular && !isCurrent && (
              <span className="absolute -top-2.5 left-4 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                Popular
              </span>
            )}
            {isCurrent && (
              <span className="absolute -top-2.5 left-4 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                Current
              </span>
            )}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'p-2 rounded-lg',
                  isSelected && !isEnterprise ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold">{plan.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {isEnterprise ? 'Custom pricing' : planPrice === 0 ? 'Free' : `KSh ${planPrice?.toLocaleString()}/month`}
                  </p>
                </div>
              </div>
              {isSelected && !isEnterprise && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
            </div>
            <ul className="mt-3 space-y-1">
              {plan.features.map((feature) => (
                <li key={feature} className="text-xs text-muted-foreground flex items-center gap-2">
                  <Check className="w-3 h-3 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </button>
        );
      })}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'select' ? 'Choose Your Plan' : 'Complete Payment'}
          </DialogTitle>
          <DialogDescription>
            {step === 'select'
              ? 'Select a personal or business plan'
              : 'Enter your M-Pesa phone number to complete payment'
            }
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 'select' ? (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <Tabs value={tab} onValueChange={(v) => setTab(v as 'personal' | 'business')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="personal" className="gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    Personal
                  </TabsTrigger>
                  <TabsTrigger value="business" className="gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    Business
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="personal" className="mt-3">
                  {renderPlanList(personalPlans)}
                </TabsContent>
                <TabsContent value="business" className="mt-3">
                  {renderPlanList(businessPlans)}
                </TabsContent>
              </Tabs>

              <Button
                onClick={handleContinue}
                className="w-full"
                disabled={selectedPlan === currentPlan || selectedPlan === ('enterprise' as PlanId)}
              >
                {selectedPlan === 'starter' ? 'Activate Free Plan' : `Continue • KSh ${price?.toLocaleString()}/mo`}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Plan</span>
                  <span className="font-medium">{PLAN_LABELS[selectedPlan]}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>KSh {price?.toLocaleString()}/month</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">M-Pesa Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0712345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  You'll receive an M-Pesa prompt on this number
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep('select')} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handlePayment}
                  disabled={!phone.trim() || initiateMpesaPayment.isPending}
                  className="flex-1"
                >
                  {initiateMpesaPayment.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Pay with M-Pesa'
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
