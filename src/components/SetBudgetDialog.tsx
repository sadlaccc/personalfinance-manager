import { useState } from 'react';
import { Target } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface SetBudgetDialogProps {
  onSubmit: (data: { category: string; budget_amount: number }) => Promise<unknown>;
  existingBudgets: { category: string; budget_amount: number }[];
  isUpdating: boolean;
}

const expenseCategories = [
  { value: 'housing', label: 'Housing' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'food', label: 'Food' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'debt', label: 'Debt' },
  { value: 'savings', label: 'Savings' },
  { value: 'other', label: 'Other' },
];

export function SetBudgetDialog({ onSubmit, existingBudgets, isUpdating }: SetBudgetDialogProps) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !amount) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      await onSubmit({ category, budget_amount: parseFloat(amount) });
      toast({
        title: 'Success',
        description: 'Budget limit set successfully',
      });
      setOpen(false);
      setCategory('');
      setAmount('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to set budget limit',
        variant: 'destructive',
      });
    }
  };

  const existingBudget = existingBudgets.find(b => b.category === category);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Target className="mr-2 h-4 w-4" />
          Set Budget
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Monthly Budget Limit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {expenseCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Budget Amount (KES)</Label>
            <Input
              id="amount"
              type="number"
              placeholder={existingBudget ? `Current: ${existingBudget.budget_amount}` : 'Enter amount'}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="100"
            />
            {existingBudget && (
              <p className="text-xs text-muted-foreground">
                This will update the existing budget of KES {existingBudget.budget_amount.toLocaleString()}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isUpdating}>
            {isUpdating ? 'Saving...' : 'Set Budget'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
