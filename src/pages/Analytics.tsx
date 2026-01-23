import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { useIncomeSources } from '@/hooks/useIncomeSources';
import { useExpenses } from '@/hooks/useExpenses';
import { categoryLabels, IncomeCategory } from '@/types/income';
import { expenseCategoryLabels, ExpenseCategory } from '@/types/expense';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Target, Loader2, Wallet } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const INCOME_COLORS: Record<IncomeCategory, string> = {
  salary: '#3b82f6',
  freelance: '#a855f7',
  investment: '#10b981',
  rental: '#f59e0b',
  business: '#ec4899',
  other: '#6b7280',
};

const EXPENSE_COLORS: Record<ExpenseCategory, string> = {
  housing: '#ef4444',
  utilities: '#f59e0b',
  food: '#f97316',
  transportation: '#0ea5e9',
  healthcare: '#ec4899',
  entertainment: '#8b5cf6',
  shopping: '#6366f1',
  debt: '#dc2626',
  savings: '#10b981',
  other: '#6b7280',
};

const Analytics = () => {
  const { stats: incomeStats, incomeSources, isLoading: incomeLoading } = useIncomeSources();
  const { stats: expenseStats, expenses, isLoading: expenseLoading } = useExpenses();

  const isLoading = incomeLoading || expenseLoading;

  // Income category breakdown data
  const incomeCategoryData = Object.entries(incomeStats.byCategory)
    .filter(([_, value]) => value > 0)
    .map(([category, value]) => ({
      name: categoryLabels[category as IncomeCategory],
      value: Math.round(value),
      fill: INCOME_COLORS[category as IncomeCategory],
    }))
    .sort((a, b) => b.value - a.value);

  // Expense category breakdown data
  const expenseCategoryData = Object.entries(expenseStats.byCategory)
    .filter(([_, value]) => value > 0)
    .map(([category, value]) => ({
      name: expenseCategoryLabels[category as ExpenseCategory],
      value: Math.round(value),
      fill: EXPENSE_COLORS[category as ExpenseCategory],
    }))
    .sort((a, b) => b.value - a.value);

  // Net income data for pie chart
  const netData = [
    { name: 'Income', value: Math.round(incomeStats.totalMonthly), fill: '#10b981' },
    { name: 'Expenses', value: Math.round(expenseStats.totalMonthly), fill: '#ef4444' },
  ];

  // Monthly projection data (simulated for demo)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  const projectionData = months.map((month, index) => ({
    name: month,
    income: index <= currentMonth 
      ? Math.round(incomeStats.totalMonthly * (0.85 + Math.random() * 0.3))
      : Math.round(incomeStats.totalMonthly * (0.95 + Math.random() * 0.1)),
    expenses: index <= currentMonth 
      ? Math.round(expenseStats.totalMonthly * (0.85 + Math.random() * 0.3))
      : Math.round(expenseStats.totalMonthly * (0.95 + Math.random() * 0.1)),
  }));

  const netMonthly = incomeStats.totalMonthly - expenseStats.totalMonthly;
  const savingsRate = incomeStats.totalMonthly > 0 
    ? ((netMonthly / incomeStats.totalMonthly) * 100).toFixed(1)
    : '0';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-income/10 rounded-xl">
              <TrendingUp className="w-5 h-5 text-income" />
            </div>
            <span className="text-sm text-muted-foreground">Monthly Income</span>
          </div>
          <p className="text-2xl font-bold font-display text-income">
            +${incomeStats.totalMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-destructive/10 rounded-xl">
              <TrendingDown className="w-5 h-5 text-destructive" />
            </div>
            <span className="text-sm text-muted-foreground">Monthly Expenses</span>
          </div>
          <p className="text-2xl font-bold font-display text-destructive">
            -${expenseStats.totalMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Net Monthly</span>
          </div>
          <p className={`text-2xl font-bold font-display ${netMonthly >= 0 ? 'text-income' : 'text-destructive'}`}>
            {netMonthly >= 0 ? '+' : ''}${netMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-category-rental/10 rounded-xl">
              <Target className="w-5 h-5 text-category-rental" />
            </div>
            <span className="text-sm text-muted-foreground">Savings Rate</span>
          </div>
          <p className={`text-2xl font-bold font-display ${parseFloat(savingsRate) >= 0 ? 'text-income' : 'text-destructive'}`}>
            {savingsRate}%
          </p>
        </div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-display font-semibold text-lg text-foreground mb-4">
            Income vs Expenses Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                  }}
                  formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name === 'income' ? 'Income' : 'Expenses']}
                />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorIncome)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorExpenses)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Income vs Expenses Pie */}
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-display font-semibold text-lg text-foreground mb-4">
            Budget Distribution
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={netData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {netData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-income" />
              <span className="text-sm text-muted-foreground">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <span className="text-sm text-muted-foreground">Expenses</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Category Breakdowns */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Income Category Breakdown */}
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-display font-semibold text-lg text-foreground mb-4">
            Income by Category
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeCategoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Monthly']}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Expense Category Breakdown */}
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-display font-semibold text-lg text-foreground mb-4">
            Expenses by Category
          </h3>
          <div className="h-64">
            {expenseCategoryData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No expenses tracked yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expenseCategoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Monthly']}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Analytics;
