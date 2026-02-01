import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Wallet, Receipt, LineChart, Target, Power } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Home' },
  { path: '/sources', icon: Wallet, label: 'Income' },
  { path: '/expenses', icon: Receipt, label: 'Expenses' },
  { path: '/goals', icon: Target, label: 'Budget' },
  { path: '/analytics', icon: LineChart, label: 'Analytics' },
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
      <div className="flex items-center justify-around h-14 px-1">
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
                "relative p-1 rounded-lg transition-all duration-200",
                isActive && "bg-primary/10"
              )}>
                <Icon className={cn(
                  "h-4 w-4 transition-all duration-200",
                  isActive && "scale-110"
                )} />
              </div>
              <span className={cn(
                "text-[9px] font-medium",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
        
        {/* Power/Logout button on right corner */}
        <button
          onClick={() => signOut()}
          className="flex flex-col items-center justify-center gap-0.5 w-12 h-full transition-all duration-200 active:scale-95 touch-manipulation group"
        >
          <div className="p-1.5 rounded-full bg-destructive/10 transition-all duration-200 group-hover:bg-destructive/20">
            <Power className="h-4 w-4 text-destructive transition-colors" />
          </div>
        </button>
      </div>
    </motion.nav>
  );
}
