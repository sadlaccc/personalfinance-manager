import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Copy, Loader2 } from 'lucide-react';
import { format, subMonths } from 'date-fns';
import { toast } from 'sonner';

interface CopyBudgetDialogProps {
  currentMonth: number;
  currentYear: number;
  onCopy: (params: { fromMonth: number; fromYear: number }) => Promise<number>;
  isCopying: boolean;
}

export function CopyBudgetDialog({ currentMonth, currentYear, onCopy, isCopying }: CopyBudgetDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');

  // Generate last 12 months options (excluding current month)
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(currentYear, currentMonth - 1, 1), i + 1);
    return {
      value: `${date.getMonth() + 1}-${date.getFullYear()}`,
      label: format(date, 'MMMM yyyy'),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    };
  });

  const handleCopy = async () => {
    if (!selectedPeriod) {
      toast.error('Please select a month to copy from');
      return;
    }

    const [monthStr, yearStr] = selectedPeriod.split('-');
    const fromMonth = parseInt(monthStr);
    const fromYear = parseInt(yearStr);

    try {
      const count = await onCopy({ fromMonth, fromYear });
      toast.success(`Copied ${count} budget${count !== 1 ? 's' : ''} successfully!`);
      setOpen(false);
      setSelectedPeriod('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to copy budgets');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-xl">
          <Copy className="w-4 h-4 mr-2" />
          Copy Budgets
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl">
              <Copy className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="font-display text-xl">
              Copy Budgets from Another Month
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground">
            Copy all category budgets from a previous month to{' '}
            <span className="font-medium text-foreground">
              {format(new Date(currentYear, currentMonth - 1, 1), 'MMMM yyyy')}
            </span>
            .
          </p>

          <div className="space-y-2">
            <Label>Copy from</Label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select a month..." />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCopy}
              disabled={!selectedPeriod || isCopying}
              className="flex-1 rounded-xl"
            >
              {isCopying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Copying...
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Budgets
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
