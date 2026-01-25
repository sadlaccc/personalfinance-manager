import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, Phone, Sparkles, Zap, TrendingUp, Crown } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSubscription, PLAN_PRICES } from '@/hooks/useSubscription';
import { cn } from '@/lib/utils';

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    icon: Zap,
    features: ['Up to 5 income sources', 'Basic expense tracking', 'Monthly reports'],
  },
  {
    id: 'plus',
    name: 'Plus',
    icon: TrendingUp,
    features: ['Up to 15 income sources', 'Weekly reports', 'Basic savings goals'],
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: Sparkles,
    popular: true,
    features: ['Unlimited entries', 'Advanced analytics', 'Export reports'],
  },
  {
    id: 'premium',
    name: 'Premium',
    icon: Crown,
    features: ['Everything in Pro', 'AI forecasting', 'Priority support'],
  },
];

export function UpgradeDialog({ open, onOpenChange }: UpgradeDialogProps) {
  const { currentPlan, initiateMpesaPayment } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'plus' | 'pro' | 'premium'>('pro');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'select' | 'payment'>('select');

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId as 'starter' | 'plus' | 'pro' | 'premium');
  };

  const handleContinue = () => {
    if (selectedPlan === 'starter' || selectedPlan === currentPlan) {
      // Free plan or same plan - activate directly
      initiateMpesaPayment.mutate(
        { phone: '', planType: selectedPlan, billingCycle },
        {
          onSuccess: () => {
            onOpenChange(false);
            setStep('select');
          },
        }
      );
    } else {
      setStep('payment');
    }
  };

  const handlePayment = () => {
    if (!phone.trim()) return;
    
    initiateMpesaPayment.mutate(
      { phone, planType: selectedPlan, billingCycle },
      {
        onSuccess: () => {
          onOpenChange(false);
          setStep('select');
          setPhone('');
        },
      }
    );
  };

  const price = PLAN_PRICES[selectedPlan][billingCycle];
  const annualSavings = Math.round(((PLAN_PRICES[selectedPlan].monthly * 12) - PLAN_PRICES[selectedPlan].annual) / 12);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {step === 'select' ? 'Choose Your Plan' : 'Complete Payment'}
          </DialogTitle>
          <DialogDescription>
            {step === 'select' 
              ? 'Select a plan that fits your needs'
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
              <Tabs value={billingCycle} onValueChange={(v) => setBillingCycle(v as 'monthly' | 'annual')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="annual" className="relative">
                    Annual
                    <span className="absolute -top-2 -right-2 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                      Save 17%
                    </span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="grid gap-3">
                {plans.map((plan) => {
                  const Icon = plan.icon;
                  const planPrice = PLAN_PRICES[plan.id as keyof typeof PLAN_PRICES][billingCycle];
                  const isSelected = selectedPlan === plan.id;
                  const isCurrent = currentPlan === plan.id;

                  return (
                    <button
                      key={plan.id}
                      onClick={() => handlePlanSelect(plan.id)}
                      disabled={isCurrent}
                      className={cn(
                        'relative p-4 rounded-xl border-2 text-left transition-all',
                        isSelected
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
                            isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                          )}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{plan.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {planPrice === 0 ? 'Free' : `KSh ${planPrice}/${billingCycle === 'annual' ? 'year' : 'month'}`}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
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

              <Button 
                onClick={handleContinue} 
                className="w-full"
                disabled={selectedPlan === currentPlan}
              >
                {selectedPlan === 'starter' ? 'Activate Free Plan' : `Continue • KSh ${price}`}
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
                  <span className="font-medium capitalize">{selectedPlan}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Billing</span>
                  <span className="font-medium capitalize">{billingCycle}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>KSh {price}</span>
                </div>
                {billingCycle === 'annual' && annualSavings > 0 && (
                  <p className="text-xs text-primary">
                    You save KSh {annualSavings}/month with annual billing!
                  </p>
                )}
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
