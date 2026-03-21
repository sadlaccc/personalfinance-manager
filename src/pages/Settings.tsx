import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Palette, Shield, HelpCircle, Sun, Moon, Monitor, Loader2, Globe, Crown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useSubscription, PLAN_LABELS } from '@/hooks/useSubscription';
import { getPlanLimits, formatLimit } from '@/lib/planLimits';
import { EditProfileDialog } from '@/components/EditProfileDialog';
import { ResetPasswordDialog } from '@/components/ResetPasswordDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const CURRENCIES = [
  { code: 'KES', name: 'Kenya Shilling (KSh)', symbol: 'KSh' },
  { code: 'USD', name: 'US Dollar ($)', symbol: '$' },
  { code: 'EUR', name: 'Euro (€)', symbol: '€' },
  { code: 'GBP', name: 'British Pound (£)', symbol: '£' },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh' },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 }
};

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const { profile, isLoading, updateProfile, isUpdating } = useProfile();
  const { currentPlan, isActive, daysRemaining } = useSubscription();
  const limits = getPlanLimits(currentPlan);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currency, setCurrency] = useState('KES');
  const [isUpdatingCurrency, setIsUpdatingCurrency] = useState(false);

  useEffect(() => {
    if (profile) {
      setCurrency((profile as any).currency || 'KES');
    }
  }, [profile]);

  const getInitials = (name: string | null | undefined, email: string | undefined) => {
    if (name) {
      return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) return email[0].toUpperCase();
    return 'U';
  };

  const handleSaveProfile = (data: { name: string; phone?: string }) => {
    updateProfile({ full_name: data.name, phone: data.phone }, {
      onSuccess: () => setEditDialogOpen(false),
    });
  };

  const handleCurrencyChange = async (newCurrency: string) => {
    if (!user?.id) return;
    setIsUpdatingCurrency(true);
    setCurrency(newCurrency);
    const { error } = await supabase
      .from('profiles')
      .update({ currency: newCurrency })
      .eq('user_id', user.id);
    setIsUpdatingCurrency(false);
    if (error) {
      toast.error('Failed to update currency');
    } else {
      toast.success('Currency updated');
    }
  };

  const planLabel = PLAN_LABELS[currentPlan] || 'Starter';

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl space-y-5"
      >
        {/* Profile */}
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-primary/10 rounded-xl">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">Profile</h3>
              <p className="text-sm text-muted-foreground">Your account details</p>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg">
                {getInitials(profile?.full_name, user?.email)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {profile?.full_name || 'No name set'}
                </p>
                <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="rounded-xl shrink-0"
                onClick={() => setEditDialogOpen(true)}
              >
                Edit
              </Button>
            </div>
          )}
        </motion.div>

        {/* Plan & Usage */}
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-ticket/10 rounded-xl">
              <Crown className="w-5 h-5 text-ticket" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold text-foreground">Plan & Usage</h3>
              <p className="text-sm text-muted-foreground">
                {planLabel} plan {isActive ? '(active)' : ''}
                {daysRemaining > 0 && ` · ${daysRemaining} days left`}
              </p>
            </div>
            <Link to="/pricing">
              <Button variant="outline" size="sm" className="rounded-xl gap-1.5">
                Upgrade
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Income sources</span>
              <span className="font-medium text-foreground">{formatLimit(limits.incomeSources)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Expense categories</span>
              <span className="font-medium text-foreground">{formatLimit(limits.expenseCategories)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Savings goals</span>
              <span className="font-medium text-foreground">{limits.savingsGoals === 0 ? 'Not included' : formatLimit(limits.savingsGoals)}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Analytics</span>
              <span className={`font-medium ${limits.analytics ? 'text-income' : 'text-muted-foreground'}`}>
                {limits.analytics ? 'Included' : 'Not included'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">CSV export</span>
              <span className={`font-medium ${limits.exportCsv ? 'text-income' : 'text-muted-foreground'}`}>
                {limits.exportCsv ? 'Included' : 'Not included'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">PDF reports</span>
              <span className={`font-medium ${limits.exportPdf ? 'text-income' : 'text-muted-foreground'}`}>
                {limits.exportPdf ? 'Included' : 'Not included'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Currency */}
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-income/10 rounded-xl">
              <Globe className="w-5 h-5 text-income" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">Currency</h3>
              <p className="text-sm text-muted-foreground">All amounts displayed in this currency</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="currency-select">Display Currency</Label>
            <div className="w-48">
              <Select 
                value={currency} 
                onValueChange={handleCurrencyChange}
                disabled={isUpdatingCurrency}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.symbol} {curr.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-warning/10 rounded-xl">
              <Bell className="w-5 h-5 text-warning" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">Notifications</h3>
              <p className="text-sm text-muted-foreground">Configure alerts</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="income-alerts">Income alerts</Label>
              <Switch id="income-alerts" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="monthly-summary">Monthly summary</Label>
              <Switch id="monthly-summary" defaultChecked />
            </div>
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-accent/10 rounded-xl">
              <Palette className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">Appearance</h3>
              <p className="text-sm text-muted-foreground">Theme preference</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme("light")}
              className="rounded-xl gap-2"
            >
              <Sun className="w-4 h-4" />
              Light
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme("dark")}
              className="rounded-xl gap-2"
            >
              <Moon className="w-4 h-4" />
              Dark
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme("system")}
              className="rounded-xl gap-2"
            >
              <Monitor className="w-4 h-4" />
              System
            </Button>
          </div>
        </motion.div>

        {/* Security */}
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">Security</h3>
              <p className="text-sm text-muted-foreground">Account protection</p>
            </div>
          </div>
          
          <ResetPasswordDialog
            trigger={
              <Button variant="outline" size="sm" className="rounded-xl">
                Reset Password
              </Button>
            }
          />
        </motion.div>

        {/* Help */}
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-muted rounded-xl">
              <HelpCircle className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">Help</h3>
              <p className="text-sm text-muted-foreground">Get assistance</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Link to="/blog">
              <Button variant="outline" size="sm" className="rounded-xl">Guides</Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="sm" className="rounded-xl">Contact Support</Button>
            </Link>
          </div>
        </motion.div>
      </motion.div>

      <EditProfileDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        currentName={profile?.full_name || null}
        currentPhone={profile?.phone || null}
        onSave={handleSaveProfile}
        isLoading={isUpdating}
      />
    </>
  );
};

export default Settings;
