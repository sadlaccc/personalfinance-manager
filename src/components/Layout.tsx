import { ReactNode } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Separator } from '@/components/ui/separator';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/sources': 'Income Sources',
  '/expenses': 'Expenses',
  '/goals': 'Savings Goals',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
};

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || 'IncomeFlow';
  const isMobile = useIsMobile();

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col min-w-0">
          <header className="flex h-14 sm:h-16 shrink-0 items-center gap-2 border-b border-border bg-card/50 backdrop-blur-sm px-3 sm:px-4 sticky top-0 z-40">
            <SidebarTrigger className="-ml-1 md:flex hidden">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            <Separator orientation="vertical" className="mr-2 h-4 hidden md:block" />
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <h1 className="font-display font-semibold text-base sm:text-lg text-foreground truncate">
                {pageTitle}
              </h1>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 overflow-x-hidden pb-20 md:pb-6">
            {children}
          </main>
        </SidebarInset>
        
        {/* Mobile Bottom Navigation */}
        <BottomNavigation />
      </div>
    </SidebarProvider>
  );
}
