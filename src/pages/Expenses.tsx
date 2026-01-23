import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExpenseCard } from '@/components/ExpenseCard';
import { AddExpenseDialog } from '@/components/AddExpenseDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useExpenses } from '@/hooks/useExpenses';
import { Expense, ExpenseCategory, expenseCategoryLabels } from '@/types/expense';
import { Plus, Search, Filter, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const Expenses = () => {
  const { expenses, addExpense, updateExpense, deleteExpense, isLoading } = useExpenses();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<ExpenseCategory[]>([]);

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setDialogOpen(true);
  };

  const handleSubmit = async (expenseData: Omit<Expense, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, expenseData);
        toast({ title: 'Expense updated successfully' });
        setEditingExpense(null);
      } else {
        await addExpense(expenseData);
        toast({ title: 'Expense added successfully' });
      }
    } catch (error) {
      toast({ 
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save expense'
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExpense(id);
      toast({ title: 'Expense deleted successfully' });
    } catch (error) {
      toast({ 
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete expense'
      });
    }
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) setEditingExpense(null);
  };

  const toggleCategory = (category: ExpenseCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(expense.category);
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            All Expenses
          </h2>
          <p className="text-muted-foreground">
            {expenses.length} total expense{expenses.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button 
          onClick={() => setDialogOpen(true)}
          className="rounded-xl bg-destructive hover:bg-destructive/90 transition-opacity gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Expense
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-xl gap-2">
              <Filter className="w-4 h-4" />
              Filter
              {selectedCategories.length > 0 && (
                <span className="bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full">
                  {selectedCategories.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {(Object.keys(expenseCategoryLabels) as ExpenseCategory[]).map((category) => (
              <DropdownMenuCheckboxItem
                key={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              >
                {expenseCategoryLabels[category]}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Expenses Grid */}
      {filteredExpenses.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <p className="text-muted-foreground">
            {searchQuery || selectedCategories.length > 0
              ? 'No expenses match your filters'
              : 'No expenses yet. Add your first one!'}
          </p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4 md:grid-cols-2"
        >
          {filteredExpenses.map((expense) => (
            <motion.div key={expense.id} variants={itemVariants}>
              <ExpenseCard
                expense={expense}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      <AddExpenseDialog
        open={dialogOpen}
        onOpenChange={handleDialogChange}
        onSubmit={handleSubmit}
        editingExpense={editingExpense}
      />
    </div>
  );
};

export default Expenses;
