import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BudgetGoal } from '@/hooks/useBudgetGoals';

interface AddFundsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: BudgetGoal | null;
  onAddFunds: (goalId: string, amount: number) => Promise<void>;
}

export function AddFundsDialog({ open, onOpenChange, goal, onAddFunds }: AddFundsDialogProps) {
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!goal) return null;

  const currentProgress = goal.target_amount > 0 
    ? Math.min((goal.current_amount / goal.target_amount) * 100, 100) 
    : 0;

  const addAmount = parseFloat(amount) || 0;
  const newTotal = goal.current_amount + addAmount;
  const newProgress = goal.target_amount > 0 
    ? Math.min((newTotal / goal.target_amount) * 100, 100) 
    : 0;

  const remaining = Math.max(0, goal.target_amount - goal.current_amount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || addAmount <= 0) return;
    
    setIsSubmitting(true);
    try {
      await onAddFunds(goal.id, addAmount);
      setAmount('');
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickAmounts = [50, 100, 250, 500];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display">Add Funds to "{goal.name}"</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Progress */}
          <div className="bg-secondary/50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current Progress</span>
              <span className="font-medium text-foreground">{currentProgress.toFixed(0)}%</span>
            </div>
            <Progress value={currentProgress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>${goal.current_amount.toLocaleString()} saved</span>
              <span>${remaining.toLocaleString()} to go</span>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="add-amount">Amount to Add</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="add-amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="rounded-xl pl-7 text-lg"
                autoFocus
              />
            </div>
          </div>

          {/* Quick Amounts */}
          <div className="flex gap-2">
            {quickAmounts.map((qa) => (
              <Button
                key={qa}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAmount(qa.toString())}
                className="flex-1 rounded-lg"
              >
                ${qa}
              </Button>
            ))}
          </div>

          {/* Preview */}
          {addAmount > 0 && (
            <div className="bg-income/10 border border-income/20 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">New Total</span>
                <span className="font-bold text-income">${newTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">New Progress</span>
                <span className="font-medium text-foreground">{newProgress.toFixed(0)}%</span>
              </div>
              {newProgress >= 100 && (
                <p className="text-xs text-income font-medium mt-2">
                  🎉 This will complete your goal!
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || addAmount <= 0}
              className="flex-1 rounded-xl bg-gradient-income hover:opacity-90"
            >
              {isSubmitting ? 'Adding...' : 'Add Funds'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
