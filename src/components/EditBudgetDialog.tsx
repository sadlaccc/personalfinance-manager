import { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { expenseCategoryLabels, ExpenseCategory } from '@/types/expense';

interface Budget {
  id: string;
  category: string;
  budget_amount: number;
}

interface EditBudgetDialogProps {
  budget: Budget | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (data: { category: string; budget_amount: number }) => Promise<unknown>;
  onDelete: (id: string) => Promise<void>;
  isUpdating: boolean;
}

export function EditBudgetDialog({ 
  budget, 
  open, 
  onOpenChange, 
  onUpdate, 
  onDelete, 
  isUpdating 
}: EditBudgetDialogProps) {
  const [amount, setAmount] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (budget) {
      setAmount(budget.budget_amount.toString());
    }
  }, [budget]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !budget) {
      toast({
        title: 'Error',
        description: 'Please enter an amount',
        variant: 'destructive',
      });
      return;
    }

    try {
      await onUpdate({ category: budget.category, budget_amount: parseFloat(amount) });
      toast({
        title: 'Success',
        description: 'Budget updated successfully',
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update budget',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!budget) return;
    
    setIsDeleting(true);
    try {
      await onDelete(budget.id);
      toast({
        title: 'Success',
        description: 'Budget deleted successfully',
      });
      setDeleteDialogOpen(false);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete budget',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!budget) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-primary" />
              Edit {expenseCategoryLabels[budget.category as ExpenseCategory] || budget.category} Budget
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Budget Amount (KES)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="100"
                className="text-lg font-medium"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                type="button" 
                variant="destructive" 
                className="flex-1 gap-2"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
              <Button type="submit" className="flex-1" disabled={isUpdating}>
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Budget</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the {expenseCategoryLabels[budget.category as ExpenseCategory] || budget.category} budget? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
