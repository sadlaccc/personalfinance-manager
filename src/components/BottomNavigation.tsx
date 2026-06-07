import { memo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Wallet, Receipt, LineChart, Target, Settings, Power, PieChart, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const mainNavItems = [
  { path: '/dashboard', icon: Home, label: 'Home' },
  { path: '/sources', icon: Wallet, label: 'Income' },
  { path: '/expenses', icon: Receipt, label: 'Expenses' },
  { path: '/budget', icon: PieChart, label: 'Budget' },
];

const moreNavItems = [
  { path: '/goals', icon: Target, label: 'Goals' },
  { path: '/analytics', icon: LineChart, label: 'Analytics' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

function BottomNavigationImpl() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom md:hidden"
      style={{
        height: 'calc(3.5rem + env(safe-area-inset-bottom, 0px))',
        contain: 'layout paint style',
        willChange: 'auto',
      }}
    >
      <div className="flex items-center justify-around h-14 px-1">
        {mainNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors duration-200 touch-manipulation',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className={cn('relative p-1 rounded-lg', isActive && 'bg-primary/10')}>
                <Icon className="h-4 w-4" />
              </div>
              <span className={cn('text-[9px] font-medium', isActive ? 'text-primary' : 'text-muted-foreground')}>
                {item.label}
              </span>
            </button>
          );
        })}

        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors duration-200 touch-manipulation text-muted-foreground hover:text-foreground">
              <div className="p-1 rounded-lg">
                <MoreHorizontal className="h-4 w-4" />
              </div>
              <span className="text-[9px] font-medium">More</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-xl">
            <div className="py-4 space-y-2">
              {moreNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;

                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setMoreOpen(false);
                    }}
                    className={cn(
                      'flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors duration-200',
                      isActive ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-secondary'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}

              <button
                onClick={() => {
                  signOut();
                  setMoreOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors duration-200 text-destructive hover:bg-destructive/10"
              >
                <Power className="h-5 w-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

export const BottomNavigation = memo(BottomNavigationImpl);
