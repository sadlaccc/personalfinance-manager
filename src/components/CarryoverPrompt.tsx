import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

/**
 * Once per month, ask the user whether they want to carry over the previous
 * month's net unspent balance into the current month. The amount is editable
 * and the decision + custom amount are stored per user + month in localStorage.
 */
export function CarryoverPrompt() {
  const { user } = useAuth();
  const { formatAmount } = useProfile();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<string>('');

  const monthKey = format(startOfMonth(new Date()), 'yyyy-MM');
  const decisionKey = user ? `carryover-decision-${user.id}-${monthKey}` : null;
  const amountKey = user ? `carryover-amount-${user.id}-${monthKey}` : null;

  // Previous month's net unspent balance only
  const { data: pending = 0 } = useQuery({
    queryKey: ['carryover-pending', user?.id, monthKey],
    queryFn: async () => {
      if (!user) return 0;
      const prev = subMonths(new Date(), 1);
      const start = format(startOfMonth(prev), 'yyyy-MM-dd');
      const end = format(endOfMonth(prev), 'yyyy-MM-dd');
      const [incRes, expRes] = await Promise.all([
        supabase.from('income_sources').select('amount').eq('user_id', user.id).gte('date', start).lte('date', end),
        supabase.from('expenses').select('amount').eq('user_id', user.id).gte('date', start).lte('date', end),
      ]);
      const inc = (incRes.data || []).reduce((s, r: { amount: number }) => s + Number(r.amount), 0);
      const exp = (expRes.data || []).reduce((s, r: { amount: number }) => s + Number(r.amount), 0);
      return Math.max(0, inc - exp);
    },
    enabled: !!user,
  });

  // Auto-show once per month
  useEffect(() => {
    if (!decisionKey || pending <= 0) return;
    const decided = localStorage.getItem(decisionKey);
    if (!decided) {
      setAmount(String(pending));
      setOpen(true);
    }
  }, [decisionKey, pending]);

  // Allow reopening from elsewhere (e.g. "Edit carryover" button)
  useEffect(() => {
    const handler = () => {
      const existing = amountKey ? localStorage.getItem(amountKey) : null;
      setAmount(existing ?? String(pending));
      setOpen(true);
    };
    window.addEventListener('carryover-edit-request', handler);
    return () => window.removeEventListener('carryover-edit-request', handler);
  }, [amountKey, pending]);

  const decide = (choice: 'accept' | 'decline') => {
    if (decisionKey) localStorage.setItem(decisionKey, choice);
    if (amountKey) {
      if (choice === 'accept') {
        const n = Number(amount);
        if (Number.isFinite(n) && n > 0) localStorage.setItem(amountKey, String(n));
        else localStorage.removeItem(amountKey);
      } else {
        localStorage.removeItem(amountKey);
      }
    }
    setOpen(false);
    window.dispatchEvent(new CustomEvent('carryover-decision-changed'));
  };

  if (!user) return null;

  const prevLabel = format(subMonths(new Date(), 1), 'MMMM yyyy');

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Carry over unspent balance?</AlertDialogTitle>
          <AlertDialogDescription>
            You had <span className="font-semibold text-foreground">{formatAmount(pending)}</span> left
            unspent from {prevLabel}. Adjust the amount if needed, then add it as income for {format(new Date(), 'MMMM yyyy')}.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="carryover-amount">Amount to carry over</Label>
          <Input
            id="carryover-amount"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => decide('decline')}>No, start fresh</AlertDialogCancel>
          <AlertDialogAction onClick={() => decide('accept')}>Yes, carry it over</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
