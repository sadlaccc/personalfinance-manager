import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IncomeSource, IncomeCategory, categoryLabels } from '@/types/income';
import { Wallet, DollarSign } from 'lucide-react';

interface AddIncomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (income: Omit<IncomeSource, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingIncome?: IncomeSource | null;
}

const categories: IncomeCategory[] = ['salary', 'freelance', 'investment', 'rental', 'business', 'other'];
const frequencies: IncomeSource['frequency'][] = ['monthly', 'weekly', 'biweekly', 'yearly', 'one-time'];

export function AddIncomeDialog({ open, onOpenChange, onSubmit, editingIncome }: AddIncomeDialogProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<IncomeCategory>('salary');
  const [frequency, setFrequency] = useState<IncomeSource['frequency']>('monthly');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingIncome) {
      setName(editingIncome.name);
      setAmount(editingIncome.amount.toString());
      setCategory(editingIncome.category);
      setFrequency(editingIncome.frequency);
      setDescription(editingIncome.description || '');
    } else {
      resetForm();
    }
  }, [editingIncome, open]);

  const resetForm = () => {
    setName('');
    setAmount('');
    setCategory('salary');
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
            <div className="bg-gradient-income p-2 rounded-xl">
              <Wallet className="w-5 h-5 text-income-foreground" />
            </div>
            <DialogTitle className="font-display text-xl">
              {editingIncome ? 'Edit Income Source' : 'Add Income Source'}
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g., Full-time Salary"
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
              <Select value={category} onValueChange={(v) => setCategory(v as IncomeCategory)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {categoryLabels[cat]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select value={frequency} onValueChange={(v) => setFrequency(v as IncomeSource['frequency'])}>
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
              placeholder="Add notes about this income source..."
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
              className="flex-1 rounded-xl bg-gradient-income hover:opacity-90 transition-opacity"
            >
              {editingIncome ? 'Save Changes' : 'Add Income'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
