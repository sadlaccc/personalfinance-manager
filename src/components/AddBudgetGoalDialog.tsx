import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { BudgetGoal } from '@/hooks/useBudgetGoals';

interface AddBudgetGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (goal: Omit<BudgetGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  editingGoal?: BudgetGoal | null;
}

export function AddBudgetGoalDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  editingGoal 
}: AddBudgetGoalDialogProps) {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingGoal) {
      setName(editingGoal.name);
      setTargetAmount(editingGoal.target_amount.toString());
      setCurrentAmount(editingGoal.current_amount.toString());
      setDeadline(editingGoal.deadline || '');
    } else {
      setName('');
      setTargetAmount('');
      setCurrentAmount('0');
      setDeadline('');
    }
  }, [editingGoal, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        name,
        target_amount: parseFloat(targetAmount) || 0,
        current_amount: parseFloat(currentAmount) || 0,
        deadline: deadline || null,
      });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display">
            {editingGoal ? 'Edit Goal' : 'Create Savings Goal'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Goal Name</Label>
            <Input
              id="name"
              placeholder="e.g., Emergency Fund, Vacation"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target">Target Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="target"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="10,000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="rounded-xl pl-7"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="current">Current Saved</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="current"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  className="rounded-xl pl-7"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Target Date (Optional)</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="rounded-xl"
            />
          </div>

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
              disabled={isSubmitting || !name || !targetAmount}
              className="flex-1 rounded-xl bg-gradient-income hover:opacity-90"
            >
              {isSubmitting ? 'Saving...' : editingGoal ? 'Update' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
