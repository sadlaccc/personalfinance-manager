import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface BudgetProgressCardProps {
  category: string;
  spent: number;
  budget: number;
}

const categoryLabels: Record<string, string> = {
  housing: 'Housing',
  utilities: 'Utilities',
  food: 'Food',
  transportation: 'Transportation',
  healthcare: 'Healthcare',
  entertainment: 'Entertainment',
  shopping: 'Shopping',
  debt: 'Debt',
  savings: 'Savings',
  other: 'Other',
};

const categoryColors: Record<string, string> = {
  housing: 'bg-blue-500',
  utilities: 'bg-yellow-500',
  food: 'bg-green-500',
  transportation: 'bg-purple-500',
  healthcare: 'bg-red-500',
  entertainment: 'bg-pink-500',
  shopping: 'bg-orange-500',
  debt: 'bg-gray-500',
  savings: 'bg-emerald-500',
  other: 'bg-slate-500',
};

export function BudgetProgressCard({ category, spent, budget }: BudgetProgressCardProps) {
  const percentage = Math.min((spent / budget) * 100, 100);
  const isOverBudget = spent > budget;
  const isNearLimit = percentage >= 80 && !isOverBudget;
  const remaining = budget - spent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${categoryColors[category] || 'bg-gray-500'}`} />
              {categoryLabels[category] || category}
            </CardTitle>
            {isOverBudget ? (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Over Budget
              </Badge>
            ) : isNearLimit ? (
              <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                Near Limit
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                On Track
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Progress 
              value={percentage} 
              className={`h-2 ${isOverBudget ? '[&>div]:bg-red-500' : isNearLimit ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'}`}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>KES {spent.toLocaleString()} spent</span>
              <span>{percentage.toFixed(0)}%</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-1 border-t">
            <span className="text-xs text-muted-foreground">Budget: KES {budget.toLocaleString()}</span>
            <span className={`text-sm font-semibold ${isOverBudget ? 'text-red-500' : 'text-green-500'}`}>
              {isOverBudget ? '-' : '+'}KES {Math.abs(remaining).toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
