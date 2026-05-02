import { useEffect, useState } from 'react';
import { Eye, Loader2, Shield, Crown, Users, TrendingUp, TrendingDown, Target, PieChart, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { PLAN_LABELS } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';

interface UserOverviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  avatarUrl: string | null;
}

interface OverviewData {
  profile: {
    full_name: string | null;
    email: string | null;
    phone: string | null;
    currency: string | null;
    created_at: string;
    last_sign_in_at: string | null;
  } | null;
  subscription: {
    plan_type: string;
    billing_cycle: string;
    status: string;
    current_period_end: string;
    trial_ends_at: string | null;
  } | null;
  roles: string[];
  stats: {
    income: { count: number; total: number };
    expenses: { count: number; total: number };
    goals: { count: number; totalTarget: number; totalCurrent: number };
    budgets: { count: number; total: number };
    payments: { count: number; totalPaid: number };
    team: { count: number };
  };
}

const formatNum = (n: number, currency = 'KES') => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `${currency} ${n.toLocaleString()}`;
  }
};

const getInitials = (name: string | null) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export function UserOverviewDialog({
  open, onOpenChange, userId, userName, userEmail, avatarUrl,
}: UserOverviewDialogProps) {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!open || !userId) return;
    let cancelled = false;
    setLoading(true);
    setData(null);

    supabase.functions
      .invoke('get-user-overview', { body: { userId } })
      .then(({ data: res, error }) => {
        if (cancelled) return;
        if (error) {
          toast({ title: 'Failed to load overview', description: error.message, variant: 'destructive' });
          return;
        }
        setData(res as OverviewData);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, userId, toast]);

  const currency = data?.profile?.currency || 'KES';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            User Overview
          </DialogTitle>
          <DialogDescription>
            Profile and aggregated activity. No individual records are shown.
          </DialogDescription>
        </DialogHeader>

        {/* Identity */}
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatarUrl || ''} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-semibold truncate">{userName || 'No name'}</p>
            <p className="text-sm text-muted-foreground truncate">{userEmail || 'No email'}</p>
            {data?.roles && data.roles.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {data.roles.map((r) => (
                  <Badge key={r} variant={r === 'admin' ? 'default' : 'secondary'} className="text-[10px] gap-1">
                    {r === 'admin' && <Shield className="h-3 w-3" />}
                    {r}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Plan + meta */}
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : data ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <InfoRow label="Plan">
                {data.subscription ? (
                  <div className="flex items-center gap-1.5">
                    <Crown className="h-3.5 w-3.5 text-amber-500" />
                    <span className="font-medium text-sm">
                      {PLAN_LABELS[data.subscription.plan_type] || data.subscription.plan_type}
                    </span>
                    <Badge variant="outline" className="text-[10px]">{data.subscription.status}</Badge>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">No plan</span>
                )}
              </InfoRow>
              <InfoRow label="Billing">
                <span className="text-sm">{data.subscription?.billing_cycle || '—'}</span>
              </InfoRow>
              <InfoRow label="Joined">
                <span className="text-sm">
                  {data.profile?.created_at ? format(new Date(data.profile.created_at), 'MMM d, yyyy') : '—'}
                </span>
              </InfoRow>
              <InfoRow label="Last sign in">
                <span className="text-sm">
                  {data.profile?.last_sign_in_at
                    ? format(new Date(data.profile.last_sign_in_at), 'MMM d, yyyy HH:mm')
                    : 'Never'}
                </span>
              </InfoRow>
              <InfoRow label="Phone">
                <span className="text-sm">{data.profile?.phone || '—'}</span>
              </InfoRow>
              <InfoRow label="Currency">
                <span className="text-sm">{data.profile?.currency || 'KES'}</span>
              </InfoRow>
            </div>

            <Separator />

            {/* Aggregated stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <StatCell
                icon={TrendingUp}
                label="Income sources"
                count={data.stats.income.count}
                total={formatNum(data.stats.income.total, currency)}
                tone="income"
              />
              <StatCell
                icon={TrendingDown}
                label="Expenses"
                count={data.stats.expenses.count}
                total={formatNum(data.stats.expenses.total, currency)}
                tone="destructive"
              />
              <StatCell
                icon={Target}
                label="Goals"
                count={data.stats.goals.count}
                total={`${formatNum(data.stats.goals.totalCurrent, currency)} / ${formatNum(data.stats.goals.totalTarget, currency)}`}
                tone="primary"
              />
              <StatCell
                icon={PieChart}
                label="Budgets"
                count={data.stats.budgets.count}
                total={formatNum(data.stats.budgets.total, currency)}
                tone="primary"
              />
              <StatCell
                icon={CreditCard}
                label="Payments"
                count={data.stats.payments.count}
                total={formatNum(data.stats.payments.totalPaid, currency)}
                tone="accent"
              />
              <StatCell
                icon={Users}
                label="Team members"
                count={data.stats.team.count}
                total=""
                tone="primary"
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Loading overview...
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
      {children}
    </div>
  );
}

function StatCell({
  icon: Icon, label, count, total, tone,
}: {
  icon: any;
  label: string;
  count: number;
  total: string;
  tone: 'income' | 'destructive' | 'primary' | 'accent';
}) {
  const toneMap = {
    income: 'bg-income/10 text-income',
    destructive: 'bg-destructive/10 text-destructive',
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent-foreground',
  } as const;
  return (
    <div className="rounded-xl border border-border/60 bg-card p-3">
      <div className={`inline-flex p-1.5 rounded-lg ${toneMap[tone]} mb-2`}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
      <p className="text-lg font-bold tracking-tight">{count}</p>
      {total && <p className="text-xs text-muted-foreground truncate">{total}</p>}
    </div>
  );
}
