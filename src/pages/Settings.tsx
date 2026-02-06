import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Palette, Shield, HelpCircle, Sun, Moon, Monitor, Loader2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { EditProfileDialog } from '@/components/EditProfileDialog';
import { ResetPasswordDialog } from '@/components/ResetPasswordDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const { profile, isLoading, updateProfile, isUpdating } = useProfile();
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
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  const handleSaveProfile = (data: { name: string; phone?: string }) => {
    updateProfile({ full_name: data.name, phone: data.phone }, {
      onSuccess: () => {
        setEditDialogOpen(false);
      },
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
      toast.success('Currency updated successfully');
    }
  };

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl space-y-6"
      >
        {/* Profile Section */}
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-xl">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">Profile</h3>
              <p className="text-sm text-muted-foreground">Manage your account settings</p>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold text-xl">
                {getInitials(profile?.full_name, user?.email)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {profile?.full_name || 'No name set'}
                </p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <Button 
                variant="outline" 
                className="rounded-xl"
                onClick={() => setEditDialogOpen(true)}
              >
                Edit Profile
              </Button>
            </div>
          )}
        </motion.div>

        {/* Currency Section */}
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-income/10 rounded-xl">
              <Globe className="w-5 h-5 text-income" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">Currency</h3>
              <p className="text-sm text-muted-foreground">Set your preferred currency</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="currency-select" className="flex flex-col gap-1">
                <span>Display Currency</span>
                <span className="text-sm font-normal text-muted-foreground">
                  All amounts will be displayed in this currency
                </span>
              </Label>
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
                        {curr.symbol} - {curr.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notifications Section */}
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-category-rental/10 rounded-xl">
              <Bell className="w-5 h-5 text-category-rental" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">Notifications</h3>
              <p className="text-sm text-muted-foreground">Configure your alerts</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="income-alerts" className="flex flex-col gap-1">
                <span>Income Alerts</span>
                <span className="text-sm font-normal text-muted-foreground">
                  Get notified when income is received
                </span>
              </Label>
              <Switch id="income-alerts" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="monthly-summary" className="flex flex-col gap-1">
                <span>Monthly Summary</span>
                <span className="text-sm font-normal text-muted-foreground">
                  Receive a monthly income report
                </span>
              </Label>
              <Switch id="monthly-summary" defaultChecked />
            </div>
          </div>
        </motion.div>

        {/* Appearance Section */}
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-category-freelance/10 rounded-xl">
              <Palette className="w-5 h-5 text-category-freelance" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">Appearance</h3>
              <p className="text-sm text-muted-foreground">Customize your experience</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="flex flex-col gap-1 mb-3">
                <span>Theme</span>
                <span className="text-sm font-normal text-muted-foreground">
                  Choose your preferred color scheme
                </span>
              </Label>
              <div className="flex gap-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("light")}
                  className="rounded-xl flex items-center gap-2"
                >
                  <Sun className="w-4 h-4" />
                  Light
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("dark")}
                  className="rounded-xl flex items-center gap-2"
                >
                  <Moon className="w-4 h-4" />
                  Dark
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("system")}
                  className="rounded-xl flex items-center gap-2"
                >
                  <Monitor className="w-4 h-4" />
                  System
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <Label htmlFor="compact-view" className="flex flex-col gap-1">
                <span>Compact View</span>
                <span className="text-sm font-normal text-muted-foreground">
                  Show more content in less space
                </span>
              </Label>
              <Switch id="compact-view" />
            </div>
          </div>
        </motion.div>

        {/* Security Section */}
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-income/10 rounded-xl">
              <Shield className="w-5 h-5 text-income" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">Security</h3>
              <p className="text-sm text-muted-foreground">Protect your account</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <ResetPasswordDialog
              trigger={
                <Button variant="outline" className="rounded-xl w-full sm:w-auto">
                  Reset Password
                </Button>
              }
            />
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-secondary rounded-xl">
              <HelpCircle className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">Help & Support</h3>
              <p className="text-sm text-muted-foreground">Get assistance</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl">
              Documentation
            </Button>
            <Button variant="outline" className="rounded-xl">
              Contact Support
            </Button>
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