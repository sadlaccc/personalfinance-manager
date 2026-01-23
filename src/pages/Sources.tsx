import { useState } from 'react';
import { motion } from 'framer-motion';
import { IncomeCard } from '@/components/IncomeCard';
import { AddIncomeDialog } from '@/components/AddIncomeDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIncomeStore } from '@/hooks/useIncomeStore';
import { IncomeSource, categoryLabels, IncomeCategory } from '@/types/income';
import { Plus, Search, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const { incomeSources, addIncomeSource, updateIncomeSource, deleteIncomeSource } = useIncomeStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<IncomeSource | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<IncomeCategory[]>([]);

  const handleEdit = (income: IncomeSource) => {
    setEditingIncome(income);
    setDialogOpen(true);
  };

  const handleSubmit = (incomeData: Omit<IncomeSource, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingIncome) {
      updateIncomeSource(editingIncome.id, incomeData);
      setEditingIncome(null);
    } else {
      addIncomeSource(incomeData);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            All Income Sources
          </h2>
          <p className="text-muted-foreground">
            {incomeSources.length} total source{incomeSources.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button 
          onClick={() => setDialogOpen(true)}
          className="rounded-xl bg-gradient-income hover:opacity-90 transition-opacity gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Income Source
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
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <p className="text-muted-foreground">
            {searchQuery || selectedCategories.length > 0
              ? 'No income sources match your filters'
              : 'No income sources yet. Add your first one!'}
          </p>
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
                onDelete={deleteIncomeSource}
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
