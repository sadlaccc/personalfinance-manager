import { 
  LayoutDashboard, 
  Wallet, 
  PieChart, 
  Settings,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ArrowDownCircle,
  Target,
  LogOut,
  X,
  Shield,
  Building2,
  User as UserIcon,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserRole } from '@/hooks/useUserRole';
import { useSubscription } from '@/hooks/useSubscription';
import { useAdminMode } from '@/contexts/AdminModeContext';
import { useNavigate } from 'react-router-dom';

const mainNavItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Income Sources', url: '/sources', icon: Wallet },
  { title: 'Expenses', url: '/expenses', icon: ArrowDownCircle },
  { title: 'Budgets', url: '/budget', icon: PieChart },
  { title: 'Savings Goals', url: '/goals', icon: Target },
  { title: 'Analytics', url: '/analytics', icon: TrendingUp },
];

const secondaryNavItems = [
  { title: 'Settings', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const { state, toggleSidebar, setOpenMobile } = useSidebar();
  const { signOut, user } = useAuth();
  const isMobile = useIsMobile();
  const { isAdmin } = useUserRole();
  const { subscription } = useSubscription();
  const { mode, setMode } = useAdminMode();
  const navigate = useNavigate();
  const isCollapsed = state === 'collapsed';

  // Check if user has business-tier plan
  const isBusinessPlan = subscription?.plan_type === 'business' || 
                         subscription?.plan_type === 'enterprise' || 
                         subscription?.plan_type === 'team';

  const showPersonalNav = !isAdmin || mode === 'personal';
  const showAdminNav = isAdmin && mode === 'admin';

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleModeChange = (next: 'admin' | 'personal') => {
    setMode(next);
    handleNavClick();
    navigate(next === 'admin' ? '/admin' : '/dashboard');
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-gradient-income p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-md flex-shrink-0">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-income-foreground" />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <h1 className="font-display text-base sm:text-lg font-bold text-foreground truncate">
                  FedhaFlow
                </h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                  Smart Budgeting
                </p>
              </div>
            )}
          </div>
          {/* Mobile close button */}
          {isMobile && !isCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpenMobile(false)}
              className="h-8 w-8 p-0 rounded-lg"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className={cn(
            "text-xs font-medium text-muted-foreground uppercase tracking-wider",
            isCollapsed && "sr-only"
          )}>
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/dashboard'}
                      onClick={handleNavClick}
                      className="flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-secondary"
                      activeClassName="bg-gradient-income text-income-foreground shadow-md hover:bg-gradient-income hover:text-income-foreground"
                    >
                      <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      {!isCollapsed && <span className="font-medium text-sm sm:text-base">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section - Only visible for admins */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className={cn(
              "text-xs font-medium text-muted-foreground uppercase tracking-wider",
              isCollapsed && "sr-only"
            )}>
              Admin
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Admin Dashboard">
                    <NavLink 
                      to="/admin"
                      onClick={handleNavClick}
                      className="flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-secondary"
                      activeClassName="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md hover:from-amber-500 hover:to-orange-500 hover:text-white"
                    >
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      {!isCollapsed && <span className="font-medium text-sm sm:text-base">Admin Dashboard</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
 
         {/* Business Admin Section - Only visible for business plan subscribers */}
         {isBusinessPlan && !isAdmin && (
           <SidebarGroup>
             <SidebarGroupLabel className={cn(
               "text-xs font-medium text-muted-foreground uppercase tracking-wider",
               isCollapsed && "sr-only"
             )}>
               Business
             </SidebarGroupLabel>
             <SidebarGroupContent>
               <SidebarMenu>
                 <SidebarMenuItem>
                   <SidebarMenuButton asChild tooltip="Business Dashboard">
                     <NavLink 
                       to="/business-admin"
                       onClick={handleNavClick}
                       className="flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-secondary"
                       activeClassName="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md hover:from-amber-500 hover:to-orange-500 hover:text-white"
                     >
                       <Building2 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                       {!isCollapsed && <span className="font-medium text-sm sm:text-base">Business Dashboard</span>}
                     </NavLink>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
               </SidebarMenu>
             </SidebarGroupContent>
           </SidebarGroup>
         )}

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className={cn(
            "text-xs font-medium text-muted-foreground uppercase tracking-wider",
            isCollapsed && "sr-only"
          )}>
            Preferences
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink 
                      to={item.url}
                      onClick={handleNavClick}
                      className="flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-secondary"
                      activeClassName="bg-primary text-primary-foreground shadow-md hover:bg-primary hover:text-primary-foreground"
                    >
                      <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      {!isCollapsed && <span className="font-medium text-sm sm:text-base">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {/* Sign Out Button */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Sign Out">
                  <button 
                    onClick={() => {
                      handleNavClick();
                      signOut();
                    }}
                    className="flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-200 text-muted-foreground hover:text-destructive hover:bg-destructive/10 w-full"
                  >
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    {!isCollapsed && <span className="font-medium text-sm sm:text-base">Sign Out</span>}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        {!isCollapsed && user && (
          <div className="px-2 sm:px-3 py-1.5 sm:py-2 mb-2 bg-secondary/50 rounded-lg sm:rounded-xl">
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        )}
        {/* Only show collapse button on desktop */}
        {!isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="w-full justify-center rounded-xl hover:bg-secondary"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 mr-2" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
