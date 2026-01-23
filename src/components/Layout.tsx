import { ReactNode } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Separator } from '@/components/ui/separator';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/sources': 'Income Sources',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
};

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || 'IncomeFlow';

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-card/50 backdrop-blur-sm px-4 sticky top-0 z-40">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center gap-2">
              <h1 className="font-display font-semibold text-lg text-foreground">
                {pageTitle}
              </h1>
            </div>
          </header>
          <main className="flex-1 p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
