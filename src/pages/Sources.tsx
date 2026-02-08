import { useState } from 'react';
import { motion } from 'framer-motion';
import { IncomeCard } from '@/components/IncomeCard';
import { AddIncomeDialog } from '@/components/AddIncomeDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIncomeSources, IncomeSource } from '@/hooks/useIncomeSources';
import { IncomeCategory, categoryLabels } from '@/types/income';
import { Plus, Search, Filter, Loader2, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { format, addMonths, subMonths } from 'date-fns';

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

const Sources = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const selectedMonth = selectedDate.getMonth();
  const selectedYear = selectedDate.getFullYear();

  const { incomeSources, addIncomeSource, updateIncomeSource, deleteIncomeSource, isLoading } = useIncomeSources({ month: selectedMonth, year: selectedYear });
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<IncomeSource | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<IncomeCategory[]>([]);

  const handlePrevMonth = () => setSelectedDate(prev => subMonths(prev, 1));
  const handleNextMonth = () => setSelectedDate(prev => addMonths(prev, 1));
  const handleCurrentMonth = () => setSelectedDate(new Date());
  const isCurrentMonth = selectedDate.getMonth() === new Date().getMonth() && selectedDate.getFullYear() === new Date().getFullYear();

  const handleEdit = (income: IncomeSource) => {
    setEditingIncome(income);
    setDialogOpen(true);
  };

  const handleSubmit = async (incomeData: Omit<IncomeSource, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingIncome) {
        await updateIncomeSource(editingIncome.id, incomeData);
        toast({ title: 'Income updated successfully' });
        setEditingIncome(null);
      } else {
        await addIncomeSource(incomeData);
        toast({ title: 'Income added successfully' });
      }
    } catch (error) {
      toast({ 
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save income'
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteIncomeSource(id);
      toast({ title: 'Income deleted successfully' });
    } catch (error) {
      toast({ 
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete income'
      });
    }
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) setEditingIncome(null);
  };

  const toggleCategory = (category: IncomeCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredSources = incomeSources.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(source.category);
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
    <div className="space-y-4">
      {/* Month Selector */}
      <div className="flex items-center justify-center sm:justify-start">
        <div className="flex items-center gap-2 bg-card border border-border rounded-xl p-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={handlePrevMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <button
            onClick={handleCurrentMonth}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors min-w-[140px] justify-center"
          >
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {format(selectedDate, 'MMMM yyyy')}
            </span>
          </button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={handleNextMonth}
            disabled={isCurrentMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
            Income Sources
          </h2>
          <p className="text-sm text-muted-foreground">
            {incomeSources.length} source{incomeSources.length !== 1 ? 's' : ''} in {format(selectedDate, 'MMMM')}
          </p>
        </div>
        <Button 
          onClick={() => setDialogOpen(true)}
          className="rounded-xl bg-gradient-income hover:opacity-90 transition-opacity gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Income
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search income sources..."
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
                <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                  {selectedCategories.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {(Object.keys(categoryLabels) as IncomeCategory[]).map((category) => (
              <DropdownMenuCheckboxItem
                key={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              >
                {categoryLabels[category]}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Sources Grid */}
      {filteredSources.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-8 sm:p-12 text-center">
          <div className="bg-gradient-to-br from-income/20 to-income/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-income" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">
            {searchQuery || selectedCategories.length > 0
              ? 'No matching sources'
              : 'No income sources yet'}
          </h3>
          <p className="text-muted-foreground mb-6 text-sm max-w-xs mx-auto">
            {searchQuery || selectedCategories.length > 0
              ? 'Try adjusting your search or filters'
              : 'Add your first income source to start tracking your earnings'}
          </p>
          {!(searchQuery || selectedCategories.length > 0) && (
            <Button 
              onClick={() => setDialogOpen(true)}
              className="rounded-xl bg-gradient-income hover:opacity-90 gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Income Source
            </Button>
          )}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4 md:grid-cols-2"
        >
          {filteredSources.map((income) => (
            <motion.div key={income.id} variants={itemVariants}>
              <IncomeCard
                income={income}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      <AddIncomeDialog
        open={dialogOpen}
        onOpenChange={handleDialogChange}
        onSubmit={handleSubmit}
        editingIncome={editingIncome}
      />
    </div>
  );
};

export default Sources;
