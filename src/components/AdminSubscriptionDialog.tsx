import { useState } from 'react';
import { format, addMonths, addYears } from 'date-fns';
import { CreditCard, Crown, Check, Calendar, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PLAN_PRICES, PLAN_LABELS } from '@/hooks/useSubscription';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface AdminSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string | null;
  currentSubscription?: {
    plan_type: string;
    status: string;
    current_period_end: string;
  } | null;
}

const PLAN_ORDER = ['starter', 'plus', 'pro', 'premium', 'team', 'business', 'enterprise'];

export function AdminSubscriptionDialog({
  open,
  onOpenChange,
  userId,
  userName,
  currentSubscription,
}: AdminSubscriptionDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState(currentSubscription?.plan_type || 'starter');
  const [duration, setDuration] = useState<'1' | '3' | '6' | '12'>('1');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateSubscription = async () => {
    setIsLoading(true);
    try {
      const now = new Date();
      const periodEnd = addMonths(now, parseInt(duration));

      const { error } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: userId,
          plan_type: selectedPlan,
          billing_cycle: 'monthly',
          status: 'active',
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString(),
        }, { onConflict: 'user_id' });

      if (error) throw error;

      toast({
        title: 'Subscription updated',
        description: `${userName || 'User'} now has ${PLAN_LABELS[selectedPlan]} plan for ${duration} month(s).`,
      });

      queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update subscription',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: 'Subscription cancelled',
        description: `${userName || 'User'}'s subscription has been cancelled.`,
      });

      queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to cancel subscription',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Manage Subscription
          </DialogTitle>
          <DialogDescription>
            Update subscription for {userName || 'this user'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Subscription */}
          {currentSubscription && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Plan</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Crown className="h-4 w-4 text-primary" />
                      <span className="font-semibold">
                        {PLAN_LABELS[currentSubscription.plan_type] || currentSubscription.plan_type}
                      </span>
                      <Badge variant={currentSubscription.status === 'active' ? 'default' : 'secondary'}>
                        {currentSubscription.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Expires</p>
                    <p className="text-sm font-medium">
                      {format(new Date(currentSubscription.current_period_end), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Plan Selection */}
          <div className="space-y-2">
            <Label>Select Plan</Label>
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLAN_ORDER.map((plan) => (
                  <SelectItem key={plan} value={plan}>
                    <div className="flex items-center justify-between w-full gap-4">
                      <span>{PLAN_LABELS[plan]}</span>
                      <span className="text-muted-foreground">
                        {PLAN_PRICES[plan] > 0 ? `KES ${PLAN_PRICES[plan]}/mo` : 'Custom'}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration Selection */}
          <div className="space-y-2">
            <Label>Subscription Duration</Label>
            <Select value={duration} onValueChange={(v) => setDuration(v as '1' | '3' | '6' | '12')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Month</SelectItem>
                <SelectItem value="3">3 Months</SelectItem>
                <SelectItem value="6">6 Months</SelectItem>
                <SelectItem value="12">12 Months (1 Year)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">New expiry:</span>
                <span className="font-medium">
                  {format(addMonths(new Date(), parseInt(duration)), 'MMMM d, yyyy')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button onClick={handleUpdateSubscription} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              Update Subscription
            </Button>
            {currentSubscription?.status === 'active' && (
              <Button 
                variant="outline" 
                onClick={handleCancelSubscription} 
                disabled={isLoading}
                className="text-destructive hover:text-destructive"
              >
                Cancel Subscription
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
