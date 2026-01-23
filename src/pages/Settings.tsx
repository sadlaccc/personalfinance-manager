import { motion } from 'framer-motion';
import { User, Bell, Palette, Shield, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

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
  return (
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
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold text-xl">
            JD
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">John Doe</p>
            <p className="text-sm text-muted-foreground">john@example.com</p>
          </div>
          <Button variant="outline" className="rounded-xl">
            Edit Profile
          </Button>
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
        
        <div className="flex items-center justify-between">
          <Label htmlFor="compact-view" className="flex flex-col gap-1">
            <span>Compact View</span>
            <span className="text-sm font-normal text-muted-foreground">
              Show more content in less space
            </span>
          </Label>
          <Switch id="compact-view" />
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
        
        <Button variant="outline" className="rounded-xl">
          Change Password
        </Button>
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
  );
};

export default Settings;
