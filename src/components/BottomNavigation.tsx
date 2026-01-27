import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Wallet, PiggyBank, BarChart3, Target, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Home' },
  { path: '/sources', icon: Wallet, label: 'Income' },
  { path: '/expenses', icon: PiggyBank, label: 'Expenses' },
  { path: '/goals', icon: Target, label: 'Budget' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
];

export function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border safe-area-bottom md:hidden"
    >
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all duration-200",
                "active:scale-95 touch-manipulation",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "relative p-1.5 rounded-xl transition-all duration-200",
                isActive && "bg-primary/10"
              )}>
                <Icon className={cn(
                  "h-5 w-5 transition-all duration-200",
                  isActive && "scale-110"
                )} />
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
              <span className={cn(
                "text-[9px] font-medium transition-all duration-200",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
        
        {/* Logout button */}
        <button
          onClick={() => signOut()}
          className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all duration-200 active:scale-95 touch-manipulation text-muted-foreground hover:text-destructive"
        >
          <div className="p-1.5 rounded-xl transition-all duration-200">
            <LogOut className="h-5 w-5" />
          </div>
          <span className="text-[9px] font-medium">Logout</span>
        </button>
      </div>
    </motion.nav>
  );
}
