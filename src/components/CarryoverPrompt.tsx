import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { startOfMonth, format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

/**
 * Once per month, ask the user whether they want to carry over the previous
 * months' net unspent balance into the current month. Decision is stored per
 * user + month in localStorage and read by useIncomeSources.
 */
export function CarryoverPrompt() {
  const { user } = useAuth();
  const { formatAmount } = useProfile();
  const [open, setOpen] = useState(false);

  const monthKey = format(startOfMonth(new Date()), 'yyyy-MM');
  const storageKey = user ? `carryover-decision-${user.id}-${monthKey}` : null;

  const { data: pending = 0 } = useQuery({
    queryKey: ['carryover-pending', user?.id, monthKey],
    queryFn: async () => {
      if (!user) return 0;
      const cutoff = format(startOfMonth(new Date()), 'yyyy-MM-dd');
      const [incRes, expRes] = await Promise.all([
        supabase.from('income_sources').select('amount').eq('user_id', user.id).lt('date', cutoff),
        supabase.from('expenses').select('amount').eq('user_id', user.id).lt('date', cutoff),
      ]);
      const inc = (incRes.data || []).reduce((s, r: { amount: number }) => s + Number(r.amount), 0);
      const exp = (expRes.data || []).reduce((s, r: { amount: number }) => s + Number(r.amount), 0);
      return Math.max(0, inc - exp);
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!storageKey || pending <= 0) return;
    const decided = localStorage.getItem(storageKey);
    if (!decided) setOpen(true);
  }, [storageKey, pending]);

  const decide = (choice: 'accept' | 'decline') => {
    if (storageKey) localStorage.setItem(storageKey, choice);
    setOpen(false);
    // Force reload of income sources so the carryover row appears/disappears
    window.dispatchEvent(new CustomEvent('carryover-decision-changed'));
  };

  if (!user) return null;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Carry over unspent balance?</AlertDialogTitle>
          <AlertDialogDescription>
            You have <span className="font-semibold text-foreground">{formatAmount(pending)}</span> left
            unspent from previous months. Do you want to add it as income for {format(new Date(), 'MMMM yyyy')}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => decide('decline')}>No, start fresh</AlertDialogCancel>
          <AlertDialogAction onClick={() => decide('accept')}>Yes, carry it over</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
