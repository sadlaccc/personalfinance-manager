import { useState, useMemo } from 'react';
import { format, subMonths, addMonths, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { useAdminUserFinancials } from '@/hooks/useAdminUserFinancials';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

interface UserFinancialsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string | null;
}

const frequencyMultipliers: Record<string, number> = {
  daily: 30,
  weekly: 4,
  biweekly: 2,
  monthly: 1,
  quarterly: 1 / 3,
  yearly: 1 / 12,
};

const categoryColors: Record<string, string> = {
  housing: 'bg-blue-500/20 text-blue-500',
  utilities: 'bg-yellow-500/20 text-yellow-500',
  food: 'bg-green-500/20 text-green-500',
  transportation: 'bg-purple-500/20 text-purple-500',
  healthcare: 'bg-red-500/20 text-red-500',
  entertainment: 'bg-pink-500/20 text-pink-500',
  shopping: 'bg-orange-500/20 text-orange-500',
  debt: 'bg-gray-500/20 text-gray-500',
  savings: 'bg-emerald-500/20 text-emerald-500',
  other: 'bg-slate-500/20 text-slate-500',
  salary: 'bg-green-500/20 text-green-500',
  freelance: 'bg-blue-500/20 text-blue-500',
  investments: 'bg-purple-500/20 text-purple-500',
  rental: 'bg-orange-500/20 text-orange-500',
  business: 'bg-yellow-500/20 text-yellow-500',
};

export function UserFinancialsDialog({ 
  open, 
  onOpenChange, 
  userId, 
  userName 
}: UserFinancialsDialogProps) {
  const { expenses, income, isLoading } = useAdminUserFinancials(userId);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const handlePreviousMonth = () => setSelectedMonth(prev => subMonths(prev, 1));
  const handleNextMonth = () => setSelectedMonth(prev => addMonths(prev, 1));

  const monthlyExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return isSameMonth(expenseDate, selectedMonth);
    });
  }, [expenses, selectedMonth]);

  const stats = useMemo(() => {
    const totalMonthlyIncome = income.reduce((sum, i) => {
      const multiplier = frequencyMultipliers[i.frequency] || 1;
      return sum + (i.amount * multiplier);
    }, 0);

    const totalMonthlyExpenses = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
    const netIncome = totalMonthlyIncome - totalMonthlyExpenses;

    return {
      totalIncome: totalMonthlyIncome,
      totalExpenses: totalMonthlyExpenses,
      netIncome,
    };
  }, [income, monthlyExpenses]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Financial Data - {userName || 'User'}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
            <Skeleton className="h-64" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Month Selector */}
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 min-w-[160px] justify-center">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">
                  {format(selectedMonth, 'MMMM yyyy')}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleNextMonth}
                disabled={isSameMonth(selectedMonth, new Date())}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Monthly Income
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-green-500">
                    KES {stats.totalIncome.toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    Monthly Expenses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-red-500">
                    KES {stats.totalExpenses.toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    Net Income
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-xl font-bold ${stats.netIncome >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    KES {stats.netIncome.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="expenses" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="expenses">
                  Expenses ({monthlyExpenses.length})
                </TabsTrigger>
                <TabsTrigger value="income">
                  Income Sources ({income.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="expenses">
                <ScrollArea className="h-[300px]">
                  {monthlyExpenses.length > 0 ? (
                    <div className="space-y-2 pr-4">
                      {monthlyExpenses.map((expense) => (
                        <div 
                          key={expense.id} 
                          className="flex items-center justify-between p-3 rounded-lg border bg-card"
                        >
                          <div className="space-y-1">
                            <p className="font-medium">{expense.name}</p>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="secondary" 
                                className={categoryColors[expense.category] || 'bg-muted'}
                              >
                                {expense.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(expense.date), 'MMM d, yyyy')}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-red-500">
                              -KES {expense.amount.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {expense.frequency}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
                      <TrendingDown className="h-12 w-12 mb-2 opacity-50" />
                      <p>No expenses for {format(selectedMonth, 'MMMM yyyy')}</p>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="income">
                <ScrollArea className="h-[300px]">
                  {income.length > 0 ? (
                    <div className="space-y-2 pr-4">
                      {income.map((source) => (
                        <div 
                          key={source.id} 
                          className="flex items-center justify-between p-3 rounded-lg border bg-card"
                        >
                          <div className="space-y-1">
                            <p className="font-medium">{source.name}</p>
                            <Badge 
                              variant="secondary" 
                              className={categoryColors[source.category] || 'bg-muted'}
                            >
                              {source.category}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-500">
                              +KES {source.amount.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {source.frequency}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
                      <TrendingUp className="h-12 w-12 mb-2 opacity-50" />
                      <p>No income sources found</p>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
