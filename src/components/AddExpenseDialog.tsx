import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Expense, ExpenseCategory, expenseCategoryLabels, Frequency } from '@/types/expense';
import { ArrowDownCircle, DollarSign } from 'lucide-react';

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (expense: Omit<Expense, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  editingExpense?: Expense | null;
}

const categories: ExpenseCategory[] = ['housing', 'utilities', 'food', 'transportation', 'healthcare', 'entertainment', 'shopping', 'debt', 'savings', 'other'];
const frequencies: Frequency[] = ['monthly', 'weekly', 'biweekly', 'quarterly', 'yearly', 'one-time'];

export function AddExpenseDialog({ open, onOpenChange, onSubmit, editingExpense }: AddExpenseDialogProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [frequency, setFrequency] = useState<Frequency>('monthly');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingExpense) {
      setName(editingExpense.name);
      setAmount(editingExpense.amount.toString());
      setCategory(editingExpense.category);
      setFrequency(editingExpense.frequency);
      setDescription(editingExpense.description || '');
    } else {
      resetForm();
    }
  }, [editingExpense, open]);

  const resetForm = () => {
    setName('');
    setAmount('');
    setCategory('food');
    setFrequency('monthly');
    setDescription('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !amount) return;
    
    onSubmit({
      name: name.trim(),
      amount: parseFloat(amount),
      category,
      frequency,
      description: description.trim() || undefined,
    });
    
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-destructive/10 p-2 rounded-xl">
              <ArrowDownCircle className="w-5 h-5 text-destructive" />
            </div>
            <DialogTitle className="font-display text-xl">
              {editingExpense ? 'Edit Expense' : 'Add Expense'}
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g., Rent Payment"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-9 rounded-xl"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as ExpenseCategory)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {expenseCategoryLabels[cat]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select value={frequency} onValueChange={(v) => setFrequency(v as Frequency)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencies.map((freq) => (
                    <SelectItem key={freq} value={freq}>
                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Add notes about this expense..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl resize-none"
              rows={3}
            />
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 rounded-xl bg-destructive hover:bg-destructive/90 transition-opacity"
            >
              {editingExpense ? 'Save Changes' : 'Add Expense'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
